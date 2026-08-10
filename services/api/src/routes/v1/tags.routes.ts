import { Router } from "express"

import {
  createTagController,
  getTag,
  listTags,
  updateTagController,
  deleteTagController,
} from "../../controllers/tag.controller.js"
import { authenticate, authorize } from "../../middleware/index.js"

const router = Router()

// All tag routes require authentication
router.use(authenticate)

router.post("/", createTagController)
router.get("/", listTags)
router.get("/:id", getTag)
router.patch("/:id", updateTagController)
router.delete("/:id", deleteTagController)

export default router