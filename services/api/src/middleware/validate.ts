import type {
  NextFunction,
  Request,
  Response,
} from "express"

import { ZodError, type ZodType } from "zod"

export function validate(schema: ZodType) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed.",
          errors: error.issues,
        })
      }

      next(error)
    }
  }
}