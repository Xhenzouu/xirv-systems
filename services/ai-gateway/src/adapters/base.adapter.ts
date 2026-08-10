import type { AIProvider, AIRequest, AIResponse, Message } from "../types/index.js"

export abstract class BaseAdapter implements AIProvider {
  abstract id: string
  abstract name: string
  abstract models: string[]

  abstract generate(request: AIRequest): Promise<AIResponse>

  protected validateRequest(request: AIRequest): void {
    if (!request.messages || request.messages.length === 0) {
      throw new Error("At least one message is required")
    }

    if (request.temperature !== undefined && (request.temperature < 0 || request.temperature > 2)) {
      throw new Error("Temperature must be between 0 and 2")
    }

    if (request.maxTokens !== undefined && request.maxTokens < 1) {
      throw new Error("maxTokens must be at least 1")
    }
  }

  protected formatMessages(messages: Message[]): any[] {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))
  }
}