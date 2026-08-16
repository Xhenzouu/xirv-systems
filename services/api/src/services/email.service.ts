import crypto from 'crypto'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../errors/ApiError.js'
import { logger } from '../lib/logger.js'

export class EmailService {
  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static async sendVerificationEmail(userId: string, email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`

    // In development, log the verification link
    logger.info(`🔐 Verification link for ${email}: ${verificationUrl}`)

    // TODO: In production, send actual email
    // For now, we'll just log it and return success
    return {
      success: true,
      message: 'Verification email sent',
      verificationUrl,
    }
  }

  static async sendWelcomeEmail(email: string, firstName: string) {
    logger.info(`👋 Welcome email sent to ${email}`)
    return { success: true }
  }

  static async verifyEmail(token: string): Promise<{ userId: string; email: string }> {
    // Find user with this verification token
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

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        verificationToken: null,
      },
    })

    // Send welcome email
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

    // Generate new token if none exists
    let token = user.verificationToken
    if (!token) {
      token = this.generateVerificationToken()
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken: token },
      })
    }

    // Send verification email
    return this.sendVerificationEmail(user.id, user.email, token)
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