import { GatewayService, OllamaAdapter } from "@xirv/ai-gateway"
import type { Message } from "@xirv/ai-gateway"

// Initialize the gateway
const gateway = new GatewayService()

// Register Ollama provider (local, free)
const ollama = new OllamaAdapter()
gateway.registerProvider(ollama)
gateway.setDefaultProvider("ollama")
console.log("✅ Ollama provider registered")

export interface ChatRequest {
  messages: Message[]
  model?: string
  temperature?: number
  maxTokens?: number
}

export async function chat(request: ChatRequest) {
  return gateway.generateWithDefault({
    messages: request.messages,
    model: request.model,
    temperature: request.temperature,
    maxTokens: request.maxTokens,
  })
}

export async function chatStream(request: ChatRequest) {
  return gateway.generateStream("ollama", {
    messages: request.messages,
    model: request.model,
    temperature: request.temperature,
    maxTokens: request.maxTokens,
  })
}

export { gateway }