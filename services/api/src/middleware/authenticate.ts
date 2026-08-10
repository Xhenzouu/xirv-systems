import type {
  NextFunction,
  Request,
  Response,
} from "express"

import jwt from "jsonwebtoken"

import { prisma } from "../lib/prisma.js"
import { ApiError } from "../errors/ApiError.js"

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new ApiError(401, "Authentication required.")
    }

    const parts = authHeader.split(" ")

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new ApiError(401, "Invalid authorization header.")
    }

    const token = parts[1]

    let payload: any

    try {
      payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!,
      )
    } catch {
      throw new ApiError(401, "Invalid or expired token.")
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    })

    if (!user) {
      throw new ApiError(401, "User not found.")
    }

    // Attach the FULL user object, not a partial one
    req.user = user

    next()
  } catch (error) {
    next(error)
  }
}