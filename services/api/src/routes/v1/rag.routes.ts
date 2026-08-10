import { Router } from "express"

import { ragChat, ragChatStream, processDocument } from "../../controllers/rag.controller.js"
import { authenticate } from "../../middleware/index.js"

const router = Router()

// All RAG routes require authentication
router.use(authenticate)

router.post("/process/:documentId", processDocument)
router.post("/query", ragChat)
router.post("/query/stream", ragChatStream)

export default router