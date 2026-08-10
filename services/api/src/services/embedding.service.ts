// Using Ollama's built-in embedding API (no extra dependencies needed!)
import { generateEmbedding as ollamaEmbed, generateEmbeddings as ollamaEmbedBatch } from "./ollama-embedding.service.js"

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Use Ollama's embedding API
    const embedding = await ollamaEmbed(text)
    return embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    // Return a fallback zero vector if embedding fails
    return new Array(384).fill(0)
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings = await ollamaEmbedBatch(texts)
    return embeddings
  } catch (error) {
    console.error("Error generating embeddings:", error)
    return texts.map(() => new Array(384).fill(0))
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}