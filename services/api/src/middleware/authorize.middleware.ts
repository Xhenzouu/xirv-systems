import type { Role } from "@prisma/client"

import { ApiError } from "../errors/ApiError.js"

import type {
  NextFunction,
  Request,
  Response,
} from "express"

export function authorize(
  ...allowedRoles: Role[]
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {

    const user = req.user

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      })
    }


    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions.",
      })
    }


    next()
  }
}