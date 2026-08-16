import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"

import routes from "./routes/index.js"
import cacheTestRoutes from "./routes/cache-test.routes.js"
import superAdminRoutes from "./routes/super-admin.routes.js"
import organizationRoutes from "./routes/v1/organization.routes.js"
import verificationRoutes from "./routes/v1/verification.routes.js"

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
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: "no-referrer",
  },
})

app.use(helmetConfig)

app.use(helmet())
app.use(compression())
app.use(requestId)
app.use(cors(corsOptions))
app.use(express.json())
app.use(httpLogger)

if (globalLimiter) {
  app.use(globalLimiter)
}

app.use("/", routes)

app.use("/api/v1/cache-test", cacheTestRoutes)
app.use("/api/v1/admin/super", superAdminRoutes)

app.use("/api/v1/organizations", organizationRoutes)

app.use("/api/v1/auth", verificationRoutes)

app.use(auditLog)

app.use(notFound)
app.use(errorHandler)

export default app