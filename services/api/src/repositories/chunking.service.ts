export interface Chunk {
  content: string
  index: number
  metadata?: Record<string, any>
}

export interface ChunkingOptions {
  chunkSize?: number
  overlap?: number
  minChunkSize?: number
}

export function chunkDocument(
  text: string,
  options: ChunkingOptions = {},
): Chunk[] {
  const {
    chunkSize = 500,
    overlap = 50,
    minChunkSize = 100,
  } = options

  // Split into paragraphs first
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)

  const chunks: Chunk[] = []
  let currentChunk = ""
  let index = 0

  for (const paragraph of paragraphs) {
    // If paragraph is too long, split it further
    if (paragraph.length > chunkSize) {
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph]

      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > minChunkSize) {
          chunks.push({
            content: currentChunk.trim(),
            index: index++,
          })
          // Keep overlap
          const words = currentChunk.split(" ")
          const overlapWords = words.slice(-Math.floor(overlap / 5))
          currentChunk = overlapWords.join(" ") + " "
        }
        currentChunk += sentence + " "
      }
    } else {
      if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > minChunkSize) {
        chunks.push({
          content: currentChunk.trim(),
          index: index++,
        })
        // Keep overlap
        const words = currentChunk.split(" ")
        const overlapWords = words.slice(-Math.floor(overlap / 5))
        currentChunk = overlapWords.join(" ") + " "
      }
      currentChunk += paragraph + "\n\n"
    }
  }

  // Add remaining content
  if (currentChunk.trim().length > minChunkSize) {
    chunks.push({
      content: currentChunk.trim(),
      index: index++,
    })
  }

  return chunks
}

export function chunkDocumentWithMetadata(
  text: string,
  metadata: Record<string, any>,
  options: ChunkingOptions = {},
): Chunk[] {
  const chunks = chunkDocument(text, options)
  return chunks.map((chunk) => ({
    ...chunk,
    metadata: {
      ...metadata,
      chunkIndex: chunk.index,
    },
  }))
}