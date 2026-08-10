import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Load the correct env file based on NODE_ENV
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envFile = process.env.NODE_ENV === "production" 
  ? ".env.production" 
  : ".env"

dotenv.config({
  path: path.resolve(__dirname, "..", envFile),
})

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