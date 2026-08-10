import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"

import routes from "./routes/index.js"

import {
  errorHandler,
  notFound,
  httpLogger,
  requestId,
  globalLimiter,
  auditLog,
} from "./middleware/index.js"

import { corsOptions } from "./config/cors.js"

const app = express()

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: "no-referrer",
  },
})

app.use(helmetConfig)

// Security middleware
app.use(helmet())
app.use(compression())
app.use(requestId)
app.use(cors(corsOptions))  // 👈 Use the configured CORS
app.use(express.json())
app.use(httpLogger)

// Apply global rate limiting
if (globalLimiter) {
  app.use(globalLimiter)
}

// Routes
app.use("/", routes)

// Audit logging
app.use(auditLog)

// Error handling
app.use(notFound)
app.use(errorHandler)

export default app