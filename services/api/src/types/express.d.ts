import type { Logger } from "pino"
import type { User } from "@prisma/client"

declare global {
  namespace Express {
    interface Request {
      requestId: string
      user: User
      log: Logger
    }
  }
}

export {}