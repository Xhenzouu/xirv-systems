import type {
  NextFunction,
  Request,
  Response,
} from "express"

import { ApiError } from "../errors/ApiError.js"

export function notFound(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(
    new ApiError(
      404,
      `Route '${req.originalUrl}' not found.`,
    ),
  )
}