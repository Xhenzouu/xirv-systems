import type { Request } from "express"

import type {
  AuthenticatedUser,
} from "../types/authenticated-user.js"

import {
  ApiError,
} from "../errors/ApiError.js"

export function requireUser(
  req: Request,
): AuthenticatedUser {
  if (!req.user) {
    throw new ApiError(
      401,
      "Authentication required.",
    )
  }

  return req.user
}