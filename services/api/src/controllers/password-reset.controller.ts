import { Request, Response } from 'express'
import { PasswordResetService } from '../services/password-reset.service.js'
import { EmailService } from '../services/email.service.js'
import { ApiError } from '../errors/ApiError.js'
import { ok } from '../utils/response.js'
import { prisma } from '../lib/prisma.js'

export class PasswordResetController {
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body

      if (!email) {
        throw new ApiError(400, 'Email is required')
      }

      // Create reset token
      const token = await PasswordResetService.createResetToken(email)

      // Get user for name
      const user = await prisma.user.findUnique({
        where: { email },
        select: { firstName: true, lastName: true }
      })

      // Send reset email
      await EmailService.sendPasswordResetEmail(
        email,
        user?.firstName || 'User',
        token
      )

      return ok(res, null, 'Password reset email sent successfully')
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        })
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send reset email'
      })
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const { token } = req.params

      // Handle token as string or string[]
      const tokenValue = Array.isArray(token) ? token[0] : token

      if (!tokenValue) {
        throw new ApiError(400, 'Token is required')
      }

      await PasswordResetService.validateResetToken(tokenValue)

      return ok(res, { valid: true }, 'Token is valid')
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        })
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid token'
      })
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params
      const { password } = req.body

      // Handle token as string or string[]
      const tokenValue = Array.isArray(token) ? token[0] : token

      if (!tokenValue) {
        throw new ApiError(400, 'Token is required')
      }

      if (!password) {
        throw new ApiError(400, 'New password is required')
      }

      if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters')
      }

      await PasswordResetService.resetPassword(tokenValue, password)

      return ok(res, null, 'Password reset successfully')
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        })
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset password'
      })
    }
  }
}