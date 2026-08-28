import crypto from 'crypto'
import { addHours } from 'date-fns'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../errors/ApiError.js'
import bcrypt from 'bcrypt'

export class PasswordResetService {
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static async createResetToken(email: string): Promise<string> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new ApiError(404, 'User not found with this email')
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    })

    // Generate new token
    const token = this.generateResetToken()
    const expiresAt = addHours(new Date(), 1) // 1 hour expiry

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt
      }
    })

    return token
  }

  static async validateResetToken(token: string): Promise<{ email: string }> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      throw new ApiError(400, 'Invalid or expired reset token')
    }

    if (resetToken.usedAt) {
      throw new ApiError(400, 'Token has already been used')
    }

    if (resetToken.expiresAt < new Date()) {
      throw new ApiError(400, 'Token has expired')
    }

    return { email: resetToken.email }
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    // Validate token
    const { email } = await this.validateResetToken(token)

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { token },
      data: { usedAt: new Date() }
    })

    // Delete all other reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: {
        email,
        NOT: { token }
      }
    })
  }
}