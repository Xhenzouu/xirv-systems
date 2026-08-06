import { Router } from "express"

import {
  users,
  user,
  updateRole,
} from "../../controllers/admin.controller.js"

import {
  authenticate,
} from "../../middleware/auth.middleware.js"

import {
  authorize,
} from "../../middleware/authorize.middleware.js"

import {
  updateUserRoleSchema,
} from "../../validation/admin.schema.js"

import { validate } from "../../middleware/validate.js"

const router = Router()

router.use(
  authenticate,
  authorize(
    "ADMIN",
    "SUPER_ADMIN",
  ),
)


router.get(
  "/users",
  users,
)


router.get(
  "/users/:id",
  user,
)


router.patch(
  "/users/:id/role",
  validate(updateUserRoleSchema),
  updateRole,
)

export default router