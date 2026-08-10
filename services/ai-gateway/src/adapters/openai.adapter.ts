import OpenAI from "openai"

import { BaseAdapter } from "./base.adapter.js"
import type { AIRequest, AIResponse } from "../types/index.js"

export class OpenAIAdapter extends BaseAdapter {
  id = "openai"
  name = "OpenAI"
  models = ["gpt-4o", "gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]

  private client: OpenAI

  constructor(apiKey: string, baseURL?: string) {
    super()
    this.client = new OpenAI({
      apiKey,
      baseURL: baseURL || "https://api.openai.com/v1",
    })
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    this.validateRequest(request)

    const model = request.model || "gpt-3.5-turbo"
    const temperature = request.temperature || 0.7
    const maxTokens = request.maxTokens || 1000

    const messages = this.formatMessages(request.messages)

    const response = await this.client.chat.completions.create({
      model,
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      temperature,
      max_tokens: maxTokens,
    })

    const choice = response.choices[0]

    return {
      content: choice.message.content || "",
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    }
  }

  async generateStream(request: AIRequest): Promise<AsyncIterable<string>> {
    this.validateRequest(request)

    const model = request.model || "gpt-3.5-turbo"
    const temperature = request.temperature || 0.7
    const maxTokens = request.maxTokens || 1000

    const messages = this.formatMessages(request.messages)

    const stream = await this.client.chat.completions.create({
      model,
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    })

    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ""
          if (content) {
            yield content
          }
        }
      },
    } as AsyncIterable<string>
  }
}