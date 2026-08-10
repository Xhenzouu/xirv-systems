import { pinoHttp } from "pino-http"

import { logger } from "../lib/logger.js"
import { getRequestId } from "../lib/requestContext.js"

export const httpLogger = pinoHttp({
  logger,

  // Use the request ID from the context for the HTTP log
  customProps: (req) => {
    return {
      requestId: getRequestId(),
    }
  },

  // Custom log message formatter
  customLogLevel: (req, res, err) => {
    if (err) {
      return "error"
    }

    if (res.statusCode >= 500) {
      return "error"
    }

    if (res.statusCode >= 400) {
      return "warn"
    }

    return "info"
  },

  // Format the log message
  customSuccessMessage: (req, res) => {
    return `request completed`
  },

  customErrorMessage: (req, res, err) => {
    return `request failed: ${err.message}`
  },
})