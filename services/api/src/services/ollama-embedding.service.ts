// Ollama embedding API
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434"
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text"

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Truncate text if too long (nomic-embed-text has a 512 token limit)
    const truncatedText = text.length > 2000 ? text.substring(0, 2000) : text

    const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_EMBED_MODEL,
        prompt: truncatedText,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Ollama embedding error:", response.status, errorText)
      return new Array(768).fill(0)
    }

    const data = await response.json()
    console.log("Embedding generated successfully, length:", data.embedding?.length)

    if (!data.embedding || data.embedding.length === 0) {
      return new Array(768).fill(0)
    }

    return data.embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    return new Array(768).fill(0)
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings = await Promise.all(texts.map(t => generateEmbedding(t)))
    return embeddings
  } catch (error) {
    console.error("Error generating embeddings:", error)
    return texts.map(() => new Array(768).fill(0))
  }
}