import { Router } from "express"

import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller.js"

import {
  loginLimiter,
  registerLimiter,
  validate,
} from "../middleware/index.js"

import {
  loginSchema,
  registerSchema,
} from "../validation/auth.schema.js"

const router = Router()

router.post(
  "/register",
  // Only apply registerLimiter if it exists (not in test)
  ...(registerLimiter ? [registerLimiter] : []),
  validate(registerSchema),
  register,
)

router.post(
  "/login",
  // Only apply loginLimiter if it exists (not in test)
  ...(loginLimiter ? [loginLimiter] : []),
  validate(loginSchema),
  login,
)

router.post(
  "/refresh",
  refresh,
)

router.post(
  "/logout",
  logout,
)

export default router