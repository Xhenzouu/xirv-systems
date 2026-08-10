import type {
  NextFunction,
  Request,
  Response,
} from "express"

import { v4 as uuid } from "uuid"

import { requestContext } from "../lib/requestContext.js"

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

  // Run the rest of the request in the request context
  requestContext.run(
    { requestId: id },
    () => {
      next()
    },
  )
}