import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../errors/ApiError.js'
import { requireUser } from '../utils/require-user.js'

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req)

    if (user.role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'SUPER_ADMIN access required.')
    }

    next()
  } catch (error) {
    next(error)
  }
}