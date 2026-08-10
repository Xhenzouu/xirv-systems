import "dotenv/config"

import { validateEnv } from "./config/validate-env.js"

// Validate environment before starting
validateEnv()

import app from "./app.js"
import { logger } from "./lib/logger.js"

const PORT = process.env.PORT || 3000

// Trust proxy headers when behind a reverse proxy
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1)
  logger.info("Proxy trust enabled")
}

app.listen(PORT, () => {
  logger.info(`XIRV API running on http://localhost:${PORT}`)
})