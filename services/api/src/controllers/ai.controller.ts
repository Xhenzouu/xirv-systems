import type { Request, Response, NextFunction } from "express"

import { requireUser } from "../utils/require-user.js"
import { ok } from "../utils/response.js"
import { ApiError } from "../errors/ApiError.js"
import { chat, chatStream } from "../services/ai.service.js"
import { getRedisValue, setRedisValue } from "../services/redis.service.js"

export async function chatCompletion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const { messages, model, temperature, maxTokens } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new ApiError(400, "Messages array is required")
    }

    const cacheKey = `ai:chat:${user.id}:${JSON.stringify(messages)}:${model || 'default'}:${temperature || 0.7}`

    const cachedData = await getRedisValue(cacheKey)
    if (cachedData) {
      return ok(res, cachedData, "AI response generated successfully (cached)")
    }

    const result = await chat({
      messages,
      model,
      temperature,
      maxTokens,
    })

    await setRedisValue(cacheKey, result, 3600)

    return ok(res, result, "AI response generated successfully.")
  } catch (error) {
    next(error)
  }
}

export async function chatCompletionStream(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const { messages, model, temperature, maxTokens } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new ApiError(400, "Messages array is required")
    }

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Request-Id", req.requestId || "")

    const stream = await chatStream({
      messages,
      model,
      temperature,
      maxTokens,
    })

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
    }

    res.write("data: [DONE]\n\n")
    res.end()
  } catch (error) {
    next(error)
  }
}