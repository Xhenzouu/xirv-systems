import type { Request, Response, NextFunction } from "express"

import { requireUser } from "../utils/require-user.js"
import { ok } from "../utils/response.js"
import { ApiError } from "../errors/ApiError.js"
import { ragQuery } from "../services/rag.service.js"
import { getDocumentService, processDocumentForRAG } from "../services/documents/document.service.js"
import { getRedisValue, setRedisValue, deleteRedisPattern } from "../services/redis.service.js"

export async function processDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { documentId } = req.params

    const docId = typeof documentId === "string" ? documentId : documentId[0]

    console.log("[DEBUG] processDocument called with:", { documentId: docId, userId: user.id })

    const document = await getDocumentService(docId)

    if (!document) {
      throw new ApiError(404, "Document not found.")
    }

    if (document.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    const result = await processDocumentForRAG(docId)

    await deleteRedisPattern(`rag:query:*`)

    return ok(res, result, "Document processed for RAG successfully.")
  } catch (error) {
    console.error("[DEBUG] processDocument error:", error)
    next(error)
  }
}

export async function ragChat(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const { question, documentId, model, temperature, maxTokens } = req.body

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      throw new ApiError(400, "Question is required.")
    }

    const docId = documentId ? (typeof documentId === "string" ? documentId : documentId[0]) : undefined

    const cacheKey = `rag:query:${user.id}:${question.trim()}:${docId || 'none'}:${model || 'default'}`

    const cachedData = await getRedisValue(cacheKey)
    if (cachedData) {
      return ok(res, cachedData, "RAG response generated successfully (cached)")
    }

    const result = await ragQuery({
      question: question.trim(),
      documentId: docId,
      model,
      temperature,
      maxTokens,
    })

    await setRedisValue(cacheKey, result, 3600)

    return ok(res, result, "RAG response generated successfully.")
  } catch (error) {
    next(error)
  }
}

export async function ragChatStream(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const { question, documentId, model, temperature, maxTokens } = req.body

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      throw new ApiError(400, "Question is required.")
    }

    const docId = documentId ? (typeof documentId === "string" ? documentId : documentId[0]) : undefined

    const result = await ragQuery({
      question: question.trim(),
      documentId: docId,
      model,
      temperature,
      maxTokens,
    })

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Request-Id", req.requestId || "")

    const answer = result.answer
    const words = answer.split(" ")

    for (const word of words) {
      res.write(`data: ${JSON.stringify({ content: word + " " })}\n\n`)
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    res.write(`data: ${JSON.stringify({ 
      sources: result.sources,
      usage: result.usage,
      done: true 
    })}\n\n`)
    res.write("data: [DONE]\n\n")
    res.end()
  } catch (error) {
    next(error)
  }
}