import type {
  NextFunction,
  Request,
  Response,
} from "express"

import { ApiError } from "../errors/ApiError.js"
import { logger } from "../lib/logger.js"

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  logger.error({
    err,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  })

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  })
}