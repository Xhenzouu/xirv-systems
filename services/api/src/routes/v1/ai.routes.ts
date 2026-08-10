import { Router } from "express"

import { chatCompletion, chatCompletionStream } from "../../controllers/ai.controller.js"
import { authenticate } from "../../middleware/index.js"

const router = Router()

// All AI routes require authentication
router.use(authenticate)

router.post("/chat", chatCompletion)
router.post("/chat/stream", chatCompletionStream)

export default router