import { Router } from "express"

import {
  createCategoryController,
  getCategory,
  listCategories,
  updateCategoryController,
  deleteCategoryController,
} from "../../controllers/category.controller.js"
import { authenticate, authorize } from "../../middleware/index.js"

const router = Router()

// All category routes require authentication
router.use(authenticate)

router.post("/", createCategoryController)
router.get("/", listCategories)
router.get("/:id", getCategory)
router.patch("/:id", updateCategoryController)
router.delete("/:id", deleteCategoryController)

export default router