import type { DocumentStatus } from "@prisma/client"
import { prisma } from "../../lib/prisma.js"
import { ApiError } from "../../errors/ApiError.js"
import {
  createDocument,
  findDocumentById,
  findDocumentsByUser,
  updateDocument,
  deleteDocument,
  updateDocumentStatus,
} from "../../repositories/document.repository.js"
import { findCategoryById } from "../../repositories/category.repository.js"

import { chunkDocumentWithMetadata } from "../chunking.service.js"
import { generateEmbedding, cosineSimilarity } from "../embedding.service.js"

export async function createDocumentService(
  userId: string,
  data: {
    title: string
    description?: string
    fileName: string
    filePath: string
    fileSize: number
    mimeType: string
    content?: string  // Remove null, use undefined
    categoryId?: string
  },
) {
  if (data.categoryId) {
    const category = await findCategoryById(data.categoryId)
    if (!category) {
      throw new ApiError(404, "Category not found.")
    }
  }

  const document = await createDocument({
    userId,
    title: data.title,
    description: data.description,
    fileName: data.fileName,
    filePath: data.filePath,
    fileSize: data.fileSize,
    mimeType: data.mimeType,
    content: data.content,  // Just pass through, no null conversion
    categoryId: data.categoryId,
  })

  return findDocumentById(document.id)
}

export async function getDocumentService(id: string) {
  const document = await findDocumentById(id)
  if (!document) {
    throw new ApiError(404, "Document not found.")
  }
  return document
}

export async function getDocumentsService(
  userId: string,
  options?: {
    status?: DocumentStatus
    categoryId?: string
    tagId?: string
    search?: string
    limit?: number
    offset?: number
  },
) {
  return findDocumentsByUser(userId, options)
}

export async function updateDocumentService(
  id: string,
  data: {
    title?: string
    description?: string
    categoryId?: string
  },
) {
  const document = await findDocumentById(id)
  if (!document) {
    throw new ApiError(404, "Document not found.")
  }

  if (data.categoryId) {
    const category = await findCategoryById(data.categoryId)
    if (!category) {
      throw new ApiError(404, "Category not found.")
    }
  }

  return updateDocument(id, data)
}

export async function deleteDocumentService(id: string) {
  const document = await findDocumentById(id)
  if (!document) {
    throw new ApiError(404, "Document not found.")
  }

  return deleteDocument(id)
}

export async function updateDocumentStatusService(
  id: string,
  status: DocumentStatus,
) {
  const document = await findDocumentById(id)
  if (!document) {
    throw new ApiError(404, "Document not found.")
  }
  return updateDocumentStatus(id, status)
}

export async function processDocumentForRAG(documentId: string) {
  const document = await findDocumentById(documentId)

  if (!document) {
    throw new ApiError(404, "Document not found.")
  }

  const text = document.content || ""

  if (!text) {
    throw new ApiError(400, "Document has no content to process.")
  }

  console.log("Processing document for RAG. Content length:", text.length)

  // Chunk the document
  const chunks = chunkDocumentWithMetadata(
    text,
    {
      documentId: document.id,
      documentTitle: document.title,
    },
    {
      chunkSize: 500,
      overlap: 50,
    },
  )

  console.log("Created", chunks.length, "chunks")

  // Delete existing chunks
  await prisma.documentChunk.deleteMany({
    where: { documentId: document.id },
  })

  // Create new chunks with embeddings
  const createdChunks = []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    console.log(`Generating embedding for chunk ${i + 1}/${chunks.length}...`)

    const embedding = await generateEmbedding(chunk.content)
    console.log(`Embedding generated, length: ${embedding.length}`)

    const created = await prisma.documentChunk.create({
      data: {
        documentId: document.id,
        content: chunk.content,
        chunkIndex: chunk.index,
        embedding: embedding,
        metadata: chunk.metadata || {},
      },
    })

    createdChunks.push(created)
  }

  console.log("Successfully created", createdChunks.length, "chunks")

  return {
    documentId: document.id,
    totalChunks: createdChunks.length,
    chunks: createdChunks,
  }
}

export async function searchDocumentChunks(
  query: string,
  options?: {
    documentId?: string
    limit?: number
  },
) {
  const { documentId, limit = 5 } = options || {}

  const queryEmbedding = await generateEmbedding(query)

  const where: any = {}
  if (documentId) {
    where.documentId = documentId
  }

  const chunks = await prisma.documentChunk.findMany({
    where,
    include: {
      document: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,  // Changed from fullName
              lastName: true,   // Added lastName
              email: true,
            },
          },
        },
      },
    },
  })

  const scoredChunks = chunks.map((chunk) => {
    const embedding = chunk.embedding as number[]
    const similarity = cosineSimilarity(queryEmbedding, embedding)
    return {
      ...chunk,
      similarity,
    }
  })

  return scoredChunks
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}