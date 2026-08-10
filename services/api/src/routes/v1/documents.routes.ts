import { Router } from "express"
import multer from "multer"

import {
  uploadDocument,
  getDocument,
  listDocuments,
  updateDocument,
  deleteDocument,
  updateDocumentStatus,
  addTag,
  removeTag,
} from "../../controllers/document.controller.js"
import { authenticate, authorize, validate } from "../../middleware/index.js"

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// All document routes require authentication
router.use(authenticate)

// Document CRUD
router.post(
  "/upload",
  upload.single("file"),
  uploadDocument,
)
router.get("/", listDocuments)
router.get("/:id", getDocument)
router.patch("/:id", updateDocument)
router.delete("/:id", deleteDocument)
router.patch("/:id/status", updateDocumentStatus)

// Tag management
router.post("/:id/tags", addTag)
router.delete("/:id/tags/:tagId", removeTag)

export default router