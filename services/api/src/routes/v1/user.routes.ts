import { Router } from "express"

import {
  update,
  profile,
  adminTest,
  updatePassword,
  removeAccount,
} from "../../controllers/index.js"

import {
  authenticate,
  authorize,
  validate,
} from "../../middleware/index.js"

import {
  updateProfileSchema,
  updatePasswordSchema,
  deleteAccountSchema,
} from "../../validation/index.js"

const router = Router()

router.get(
  "/profile",
  authenticate,
  profile,
)

router.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  update,
)

router.get(
  "/admin-test",
  authenticate,
  authorize(
    "ADMIN",
    "SUPER_ADMIN",
  ),
  adminTest,
)

router.patch(
  "/password",
  authenticate,
  validate(updatePasswordSchema),
  updatePassword,
)

router.delete(
  "/account",
  authenticate,
  validate(deleteAccountSchema),
  removeAccount,
)

export default router