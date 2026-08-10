import { BaseAdapter } from "./base.adapter.js"
import type { AIRequest, AIResponse } from "../types/index.js"

export class AnthropicAdapter extends BaseAdapter {
  id = "anthropic"
  name = "Anthropic"
  models = ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"]

  // Placeholder - will be implemented when needed
  async generate(_request: AIRequest): Promise<AIResponse> {
    throw new Error("Anthropic adapter not yet implemented")
  }
}