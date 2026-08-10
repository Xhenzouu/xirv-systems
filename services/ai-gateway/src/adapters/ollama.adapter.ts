import { BaseAdapter } from "./base.adapter.js"
import type { AIRequest, AIResponse } from "../types/index.js"

interface OllamaResponse {
  response: string
  model: string
  prompt_eval_count: number
  eval_count: number
  done: boolean
}

interface OllamaStreamResponse {
  response: string
  done: boolean
}

export class OllamaAdapter extends BaseAdapter {
  id = "ollama"
  name = "Ollama"
  models = ["llama3.2", "llama3", "mistral", "phi3", "gemma2"]

  private baseURL: string

  constructor(baseURL: string = "http://localhost:11434") {
    super()
    this.baseURL = baseURL
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    this.validateRequest(request)

    const model = request.model || "llama3.2"
    const temperature = request.temperature || 0.7
    const maxTokens = request.maxTokens || 1000

    // Get the last user message
    const lastUserMessage = request.messages
      .filter((m) => m.role === "user")
      .pop()

    if (!lastUserMessage) {
      throw new Error("No user message found")
    }

    const response = await fetch(`${this.baseURL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: lastUserMessage.content,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ollama API error: ${response.status} ${errorText}`)
    }

    const data = (await response.json()) as OllamaResponse

    return {
      content: data.response || "",
      model: data.model || model,
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
    }
  }

  async generateStream(request: AIRequest): Promise<AsyncIterable<string>> {
    this.validateRequest(request)

    const model = request.model || "llama3.2"
    const temperature = request.temperature || 0.7
    const maxTokens = request.maxTokens || 1000

    const lastUserMessage = request.messages
      .filter((m) => m.role === "user")
      .pop()

    if (!lastUserMessage) {
      throw new Error("No user message found")
    }

    const response = await fetch(`${this.baseURL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: lastUserMessage.content,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ollama API error: ${response.status} ${errorText}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    return {
      async *[Symbol.asyncIterator]() {
        if (!reader) {
          throw new Error("No response body")
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n").filter((line) => line.trim())

          for (const line of lines) {
            try {
              const data = JSON.parse(line) as OllamaStreamResponse
              if (data.response) {
                yield data.response
              }
              if (data.done) {
                break
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      },
    } as AsyncIterable<string>
  }
}