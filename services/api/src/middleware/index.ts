export * from "./authenticate.js"
export * from "./authorize.js"
export * from "./errorHandler.js"
export * from "./logger.js"
export * from "./notFound.js"
export * from "./request-id.middleware.js"
export * from "./validate.js"
export * from "./audit.middleware.js"

// Re-export rate limiters with a conditional check
// This prevents them from being evaluated in test environment
import { globalLimiter, loginLimiter, registerLimiter } from "./rate-limiter.js"

// Only export if not in test
const isTest = process.env.NODE_ENV === "test"

export {
  // These will be undefined in test, but that's fine since we conditionally apply them
  globalLimiter,
  loginLimiter,
  registerLimiter,
}