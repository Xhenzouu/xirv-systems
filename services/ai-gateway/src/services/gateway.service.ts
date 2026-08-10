import type { AIProvider, AIRequest, AIResponse } from "../types/index.js"

export class GatewayService {
  private providers: Map<string, AIProvider> = new Map()
  private defaultProviderId: string | null = null

  registerProvider(provider: AIProvider): void {
    this.providers.set(provider.id, provider)

    if (!this.defaultProviderId) {
      this.defaultProviderId = provider.id
    }
  }

  getProvider(id: string): AIProvider | undefined {
    return this.providers.get(id)
  }

  getProviders(): AIProvider[] {
    return Array.from(this.providers.values())
  }

  setDefaultProvider(id: string): void {
    if (!this.providers.has(id)) {
      throw new Error(`Provider "${id}" not found`)
    }
    this.defaultProviderId = id
  }

  async generate(
    providerId: string,
    request: AIRequest,
  ): Promise<AIResponse> {
    const provider = this.getProvider(providerId)

    if (!provider) {
      throw new Error(`Provider "${providerId}" not found`)
    }

    return provider.generate(request)
  }

  async generateWithDefault(request: AIRequest): Promise<AIResponse> {
    if (!this.defaultProviderId) {
      throw new Error("No default provider set")
    }

    return this.generate(this.defaultProviderId, request)
  }

  async generateWithFallback(
    providerIds: string[],
    request: AIRequest,
  ): Promise<AIResponse> {
    let lastError: Error | null = null

    for (const id of providerIds) {
      try {
        return await this.generate(id, request)
      } catch (error) {
        lastError = error as Error
        // Continue to next provider
      }
    }

    throw new Error(`All providers failed. Last error: ${lastError?.message}`)
  }

  async generateStream(
    providerId: string,
    request: AIRequest,
  ): Promise<AsyncIterable<string>> {
    const provider = this.getProvider(providerId)

    if (!provider) {
      throw new Error(`Provider "${providerId}" not found`)
    }

    if (!provider.generateStream) {
      throw new Error(`Provider "${providerId}" does not support streaming`)
    }

    return provider.generateStream(request)
  }
}