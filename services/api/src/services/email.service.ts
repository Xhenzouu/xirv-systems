import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../errors/ApiError.js'
import { logger } from '../lib/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
})

export class EmailService {
  private static templateDir = path.join(__dirname, '../templates/emails')

  private static loadTemplate(templateName: string, variables: Record<string, string>): string {
    const templatePath = path.join(this.templateDir, `${templateName}.html`)
    let html = fs.readFileSync(templatePath, 'utf-8')
    
    for (const [key, value] of Object.entries(variables)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }
    
    return html
  }

  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static async sendEmail(email: string, subject: string, html: string) {
    try {
      if (process.env.NODE_ENV === 'production') {
        const command = new SendEmailCommand({
          Source: process.env.FROM_EMAIL || 'arroyobrix@gmail.com',
          Destination: { ToAddresses: [email] },
          Message: {
            Subject: { Data: subject },
            Body: { Html: { Data: html } }
          }
        })

        const result = await sesClient.send(command)
        logger.info(`✅ Email sent to ${email} via SES - MessageId: ${result.MessageId}`)
        return { success: true, messageId: result.MessageId }
      }

      logger.info(`📧 [DEV] Email would be sent to ${email}`)
      logger.info(`📧 [DEV] Subject: ${subject}`)
      logger.info(`📧 [DEV] HTML preview: ${html.substring(0, 200)}...`)
      return { success: true, messageId: 'dev-mode' }
    } catch (error: any) {
      logger.error(`❌ Failed to send email: ${error.message || String(error)}`)
      throw error
    }
  }

  static async sendVerificationEmail(email: string, firstName: string, token: string) {
    const frontendUrl = process.env.APP_URL || 'http://localhost:5173'
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`
    const year = new Date().getFullYear()

    const html = this.loadTemplate('verification', {
      firstName,
      verifyUrl,
      year: String(year)
    })

    return this.sendEmail(email, 'Verify Your Email - XIRV Systems', html)
  }

  static async sendInvitationEmail(
    email: string,
    inviterName: string,
    organizationName: string,
    role: string,
    token: string
  ) {
    const frontendUrl = process.env.APP_URL || 'http://localhost:5173'
    const acceptUrl = `${frontendUrl}/invite/accept?token=${token}`
    const year = new Date().getFullYear()

    const html = this.loadTemplate('invitation', {
      inviterName,
      organizationName,
      role,
      acceptUrl,
      year: String(year)
    })

    return this.sendEmail(email, `You've been invited to join ${organizationName} on XIRV Systems`, html)
  }

  static async sendWelcomeEmail(email: string, firstName: string) {
    const frontendUrl = process.env.APP_URL || 'http://localhost:5173'
    const dashboardUrl = `${frontendUrl}/dashboard`
    const year = new Date().getFullYear()

    const html = this.loadTemplate('welcome', {
      firstName,
      dashboardUrl,
      year: String(year)
    })

    return this.sendEmail(email, 'Welcome to XIRV Systems! 🚀', html)
  }

  static async sendPasswordResetEmail(email: string, firstName: string, token: string) {
    const frontendUrl = process.env.APP_URL || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`
    const year = new Date().getFullYear()

    const html = this.loadTemplate('password-reset', {
      firstName,
      resetUrl,
      year: String(year)
    })

    return this.sendEmail(email, 'Reset Your Password - XIRV Systems', html)
  }

  static async verifyEmail(token: string): Promise<{ userId: string; email: string }> {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        isEmailVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isEmailVerified: true,
        verificationToken: true,
      },
    })

    if (!user) {
      throw new ApiError(400, 'Invalid or expired verification token')
    }

    if (user.isEmailVerified) {
      throw new ApiError(400, 'Email already verified')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        verificationToken: null,
      },
    })

    await this.sendWelcomeEmail(user.email, user.firstName)

    return {
      userId: user.id,
      email: user.email,
    }
  }

  static async resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        isEmailVerified: true,
        verificationToken: true,
      },
    })

    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    if (user.isEmailVerified) {
      throw new ApiError(400, 'Email already verified')
    }

    let token = user.verificationToken
    if (!token) {
      token = this.generateVerificationToken()
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken: token },
      })
    }

    return this.sendVerificationEmail(user.email, user.firstName, token)
  }

  static async isEmailVerified(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isEmailVerified: true },
    })

    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    return user.isEmailVerified
  }
}