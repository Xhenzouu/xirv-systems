import { ApiError } from "../../errors/ApiError.js"
import {
  findDocumentById,
  updateDocument,
  createDocumentVersion,
  getDocumentVersions,
} from "../../repositories/document.repository.js"

export async function getDocumentVersionsService(documentId: string) {
  const document = await findDocumentById(documentId)
  if (!document) {
    throw new ApiError(404, "Document not found.")
  }

  return getDocumentVersions(documentId)
}

export async function createDocumentVersionService(
  documentId: string,
  data: {
    title: string
    description?: string
    fileName: string
    filePath: string
    fileSize: number
    mimeType: string
    content?: string
  },
) {
  const document = await findDocumentById(documentId)
  if (!document) {
    throw new ApiError(404, "Document not found.")
  }

  const nextVersion = document.version + 1

  // Save current version as snapshot
  await createDocumentVersion(
    documentId,
    nextVersion,
    {
      title: document.title,
      description: document.description || undefined,
      fileName: document.fileName,
      filePath: document.filePath,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      content: document.content || undefined,
    },
  )

  // Update document to new version
  const updated = await updateDocument(documentId, {
    title: data.title,
    description: data.description,
    fileName: data.fileName,
    filePath: data.filePath,
    fileSize: data.fileSize,
    mimeType: data.mimeType,
    content: data.content,
    version: nextVersion,
  })

  return updated
}