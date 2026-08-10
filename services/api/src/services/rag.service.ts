import { chat } from "./ai.service.js"
import { searchDocumentChunks } from "./documents/document.service.js"
import type { Message } from "@xirv/ai-gateway"

export interface RAGRequest {
  question: string
  documentId?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export async function ragQuery(request: RAGRequest) {
  const { question, documentId, model, temperature, maxTokens } = request

  // Search for relevant chunks
  const chunks = await searchDocumentChunks(question, {
    documentId,
    limit: 5,
  })

  // Build context from chunks
  let context = ""

  if (chunks.length === 0) {
    context = "No relevant documents found."
  } else {
    context = chunks
      .map((chunk, i) => {
        const cleanContent = chunk.content
          .replace(/^@"/, '')
          .replace(/"$/g, '')
          .replace(/\r\n/g, '\n')
          .replace(/\n\n\n/g, '\n\n')
          .trim()
        return cleanContent
      })
      .join("\n\n")
  }

  // Build a direct prompt that forces the AI to use the context
  const systemPrompt = `You are a document retrieval assistant. Your job is to answer questions using ONLY the provided context.

RULES:
- If the answer is in the context, quote it directly and be concise
- If the answer is NOT in the context, say "I don't have enough information to answer that question."
- Do NOT use any outside knowledge
- Do NOT make up information
- Be direct and factual`

  const userPrompt = `CONTEXT:
${context}

QUESTION:
${question}

Based ONLY on the context above, what is the answer to the question?`

  const messages: Message[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]

  const response = await chat({
    messages,
    model: model || "llama3.2",
    temperature: temperature !== undefined ? temperature : 0.0,
    maxTokens: maxTokens || 300,
  })

  return {
    answer: response.content,
    sources: chunks.map((chunk) => ({
      documentId: chunk.documentId,
      title: chunk.document?.title || "Unknown source",
      content: chunk.content,
      similarity: chunk.similarity || 0,
    })),
    usage: response.usage,
    totalChunks: chunks.length,
  }
}