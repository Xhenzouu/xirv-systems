import type {
  NextFunction,
  Request,
  Response,
} from "express"

import { ApiError } from "../errors/ApiError.js"

import {
  verifyAccessToken,
} from "../lib/jwt.js"

import {
  getUserById,
} from "../services/index.js"

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader =
      req.headers.authorization

    if (!authHeader) {
      throw new ApiError(
        401,
        "Authentication required.",
      )
    }

    const [scheme, token] =
      authHeader.split(" ")

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      throw new ApiError(
        401,
        "Invalid authorization header.",
      )
    }

    const decoded =
      verifyAccessToken(token)

    const user =
      await getUserById(
        decoded.sub,
      )

    req.user = user

    next()
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error)
    }

    return next(
      new ApiError(
        401,
        "Invalid or expired token.",
      ),
    )
  }
}