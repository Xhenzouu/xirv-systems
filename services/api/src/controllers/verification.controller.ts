import type { Request, Response, NextFunction } from 'express'
import { requireUser } from '../utils/require-user.js'
import { ok } from '../utils/response.js'
import { ApiError } from '../errors/ApiError.js'
import { EmailService } from '../services/email.service.js'

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.query

    if (!token || typeof token !== 'string') {
      throw new ApiError(400, 'Verification token is required')
    }

    const result = await EmailService.verifyEmail(token)

    return ok(res, result, 'Email verified successfully')
  } catch (error) {
    next(error)
  }
}

export async function resendVerification(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body

    if (!email) {
      throw new ApiError(400, 'Email is required')
    }

    const result = await EmailService.resendVerificationEmail(email)

    return ok(res, result, 'Verification email sent successfully')
  } catch (error) {
    next(error)
  }
}

export async function checkVerificationStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const isVerified = await EmailService.isEmailVerified(user.id)

    return ok(res, { isVerified }, 'Verification status retrieved successfully')
  } catch (error) {
    next(error)
  }
}