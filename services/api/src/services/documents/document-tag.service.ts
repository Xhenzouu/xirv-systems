import { ApiError } from "../../errors/ApiError.js"
import {
  findDocumentById,
  addTagToDocument,
  removeTagFromDocument,
} from "../../repositories/document.repository.js"
import { findOrCreateTag } from "../../repositories/tag.repository.js"

export async function addTagToDocumentService(
  documentId: string,
  tagName: string,
) {
  const document = await findDocumentById(documentId)
  if (!document) {
    throw new ApiError(404, "Document not found.")
  }

  const tag = await findOrCreateTag(tagName.trim())
  return addTagToDocument(documentId, tag.id)
}

export async function removeTagFromDocumentService(
  documentId: string,
  tagId: string,
) {
  const document = await findDocumentById(documentId)
  if (!document) {
    throw new ApiError(404, "Document not found.")
  }

  return removeTagFromDocument(documentId, tagId)
}