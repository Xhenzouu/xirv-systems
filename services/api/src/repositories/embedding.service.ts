import { pipeline } from "@xenova/transformers"

let embeddingPipeline: any = null

export async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    )
  }
  return embeddingPipeline
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const pipe = await getEmbeddingPipeline()
  const result = await pipe(text, { pooling: "mean", normalize: true })
  return Array.from(result.data)
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const pipe = await getEmbeddingPipeline()
  const results = await pipe(texts, { pooling: "mean", normalize: true })
  return results.map((result: any) => Array.from(result.data))
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