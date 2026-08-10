export interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

export interface AIRequest {
  messages: Message[]
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface AIResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface AIProvider {
  id: string
  name: string
  models: string[]
  generate(request: AIRequest): Promise<AIResponse>
  generateStream?(request: AIRequest): Promise<AsyncIterable<string>>
}

export interface Conversation {
  id: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}