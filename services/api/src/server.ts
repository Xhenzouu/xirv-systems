import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
const envPath = path.resolve(__dirname, "..", envFile)

dotenv.config({
  path: envPath,
})

console.log("Loaded .env file from:", envPath)
console.log("Environment:", process.env.NODE_ENV || 'development')
console.log("JWT_ACCESS_SECRET exists:", !!process.env.JWT_ACCESS_SECRET)

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