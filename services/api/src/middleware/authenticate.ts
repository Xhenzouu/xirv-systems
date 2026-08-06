import type {
  NextFunction,
  Request,
  Response,
} from "express"

import {
  ApiError,
} from "../errors/ApiError.js"

import {
  verifyAccessToken,
} from "../lib/jwt.js"

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader =
      req.headers.authorization

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new ApiError(
        401,
        "Authentication required.",
      )
    }

    const token =
      authHeader.substring(7)

    const payload =
      verifyAccessToken(token)

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch {
    next(
      new ApiError(
        401,
        "Invalid or expired access token.",
      ),
    )
  }
}