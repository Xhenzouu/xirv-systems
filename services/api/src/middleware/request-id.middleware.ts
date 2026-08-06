import type {
  NextFunction,
  Request,
  Response,
} from "express"

import { v4 as uuid } from "uuid"

export function requestId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = uuid()

  req.requestId = id

  res.setHeader(
    "X-Request-Id",
    id,
  )

  next()
}