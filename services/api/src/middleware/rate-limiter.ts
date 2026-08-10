import rateLimit from "express-rate-limit"

// Check if we're in test environment
const isTest = process.env.NODE_ENV === "test"

// Global rate limiter — applies to all requests
export const globalLimiter = isTest
  ? null
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many requests. Please try again later.",
      },
      keyGenerator: (req) => {
        return req.requestId || req.ip || "unknown"
      },
    })

// Stricter limiter for login endpoints
export const loginLimiter = isTest
  ? null
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true,
      message: {
        success: false,
        message: "Too many login attempts. Please try again later.",
      },
      keyGenerator: (req) => {
        const email = req.body?.email
        return email || req.requestId || req.ip || "unknown"
      },
    })

// Stricter limiter for registration endpoints
export const registerLimiter = isTest
  ? null
  : rateLimit({
      windowMs: 60 * 60 * 1000,
      limit: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many registration attempts. Please try again later.",
      },
      keyGenerator: (req) => {
        return req.requestId || req.ip || "unknown"
      },
    })