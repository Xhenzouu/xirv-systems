import { logger } from "../lib/logger.js"

// Required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
]

// Optional environment variables with defaults
const optionalEnvVars = [
  "PORT",
  "LOG_LEVEL",
  "NODE_ENV",
  "TRUST_PROXY",
  "ALLOWED_ORIGINS",
  "RATE_LIMIT_WINDOW_MS",
  "RATE_LIMIT_MAX_REQUESTS",
  "LOGIN_RATE_LIMIT_MAX",
  "REGISTER_RATE_LIMIT_MAX",
]

export function validateEnv(): void {
  const missing: string[] = []

  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    const error = new Error(
      `Missing required environment variables:\n${missing.map(k => `  - ${k}`).join("\n")}`
    )
    logger.error(error.message)
    throw error
  }

  // Validate JWT secrets are long enough
  const accessSecret = process.env.JWT_ACCESS_SECRET!
  const refreshSecret = process.env.JWT_REFRESH_SECRET!

  if (accessSecret.length < 32) {
    logger.warn("JWT_ACCESS_SECRET is too short. Use at least 32 characters.")
  }

  if (refreshSecret.length < 32) {
    logger.warn("JWT_REFRESH_SECRET is too short. Use at least 32 characters.")
  }

  // Validate NODE_ENV
  const nodeEnv = process.env.NODE_ENV || "development"
  if (!["development", "test", "production"].includes(nodeEnv)) {
    logger.warn(`Unknown NODE_ENV: ${nodeEnv}. Expected: development, test, or production.`)
  }

  // Log the environment (safely - without secrets)
  logger.info(`Environment: ${nodeEnv}`)
  logger.info(`Port: ${process.env.PORT || 3000}`)

  // Log optional env vars that are set (for debugging)
  for (const key of optionalEnvVars) {
    if (process.env[key]) {
      // Don't log secrets or sensitive values
      if (key.includes("SECRET") || key.includes("PASSWORD") || key.includes("KEY")) {
        continue
      }
      logger.debug(`${key}: ${process.env[key]}`)
    }
  }

  // Warn if in production with default secrets
  if (nodeEnv === "production") {
    const defaultSecret = "7e36f277f510409ff146f18c6b8bda9ffaf4f7e5785c6204c1e317f6d4bb60a0"
    if (accessSecret === defaultSecret || refreshSecret === defaultSecret) {
      logger.warn("⚠️  Using default secrets in production. This is UNSAFE! Please change them.")
    }
  }
}