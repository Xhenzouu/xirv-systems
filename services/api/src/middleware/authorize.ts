import type { Role } from "@prisma/client"

import type {
  NextFunction,
  Request,
  Response,
} from "express"

import {
  ApiError,
} from "../errors/ApiError.js"

export function authorize(
  ...allowedRoles: Role[]
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user

      if (!user) {
        throw new ApiError(
          401,
          "Authentication required.",
        )
      }

      if (
        !allowedRoles.includes(
          user.role,
        )
      ) {
        throw new ApiError(
          403,
          "Forbidden. Insufficient permissions.",
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}