import pino from "pino"

import { getRequestId } from "./requestContext.js"

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  // Add requestId to every log entry automatically
  mixin() {
    const requestId = getRequestId()

    if (requestId) {
      return { requestId }
    }

    return {}
  },

  transport: {
    target: "pino-pretty",

    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
})