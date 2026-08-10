import type { Request, Response, NextFunction } from "express"

import { requireUser,
    ok,
    created,
} from "../utils/index.js"
import { ApiError } from "../errors/ApiError.js"

import {
  createDocumentService,
  getDocumentService,
  getDocumentsService,
  updateDocumentService,
  deleteDocumentService,
  updateDocumentStatusService,
} from "../services/documents/index.js"
import { saveFile, 
    deleteFile,
    addTagToDocumentService,
    removeTagFromDocumentService,
 } from "../services/documents/index.js"

 import fs from "fs/promises"

export async function uploadDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const file = (req as any).file

    if (!file) {
      throw new ApiError(400, "No file uploaded.")
    }

    const { title, description, categoryId, tags } = req.body

    if (!title) {
      throw new ApiError(400, "Title is required.")
    }

    // Save file to disk
    const fileData = await saveFile({
      originalname: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
    })

    // Extract text content from the file
    let content: string | undefined = undefined
      try {
        if (file.mimetype === "text/plain" || file.originalname.endsWith(".txt")) {
          content = file.buffer.toString("utf-8")
        }
      } catch (error) {
        console.error("Error extracting text content:", error)
      }

    // Create document
    const document = await createDocumentService(
      user.id,
      {
        title,
        description,
        fileName: fileData.fileName,
        filePath: fileData.filePath,
        fileSize: fileData.fileSize,
        mimeType: fileData.mimeType,
        content,  // Pass the extracted content
        categoryId,
      },
    )

    if (!document) {
      throw new ApiError(500, "Failed to create document.")
    }

    // Add tags if provided
    if (tags) {
      const tagList = typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()) : tags
      for (const tagName of tagList) {
        if (tagName) {
          await addTagToDocumentService(document.id, tagName)
        }
      }
    }

    return created(
      res,
      document,
      "Document uploaded successfully.",
    )
  } catch (error) {
    console.error("[DEBUG] uploadDocument error:", error)
    next(error)
  }
}

export async function getDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    // Ensure id is a string
    const documentId = typeof id === "string" ? id : id[0]

    const document = await getDocumentService(documentId)

    if (!document) {
      throw new ApiError(404, "Document not found.")
    }

    // Check ownership
    if (document.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    return ok(
      res,
      document,
      "Document retrieved successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function listDocuments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const {
      status,
      categoryId,
      tagId,
      search,
      limit,
      offset,
    } = req.query

    const result = await getDocumentsService(
      user.id,
      {
        status: status as any,
        categoryId: categoryId as string,
        tagId: tagId as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      },
    )

    return ok(
      res,
      result,
      "Documents retrieved successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function updateDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { title, description, categoryId } = req.body

    // Ensure id is a string
    const documentId = typeof id === "string" ? id : id[0]

    const document = await getDocumentService(documentId)

    if (!document) {
      throw new ApiError(404, "Document not found.")
    }

    if (document.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    const updated = await updateDocumentService(documentId, {
      title,
      description,
      categoryId,
    })

    return ok(
      res,
      updated,
      "Document updated successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function deleteDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    // Ensure id is a string
    const documentId = typeof id === "string" ? id : id[0]

    const document = await getDocumentService(documentId)

    if (!document) {
      throw new ApiError(404, "Document not found.")
    }

    if (document.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    // Delete file from disk
    await deleteFile(document.filePath)

    await deleteDocumentService(documentId)

    return ok(
      res,
      null,
      "Document deleted successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function updateDocumentStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { status } = req.body

    console.log("updateDocumentStatus called with:", { id, status, userId: user.id })

    // Ensure id is a string
    const documentId = typeof id === "string" ? id : id[0]

    // Get the document first
    const document = await getDocumentService(documentId)

    console.log("Document found:", document)

    if (!document) {
      throw new ApiError(404, "Document not found.")
    }

    // Check ownership
    if (document.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    // Update the status
    const updated = await updateDocumentStatusService(documentId, status)

    console.log("Document updated:", updated)

    return ok(
      res,
      updated,
      "Document status updated successfully.",
    )
  } catch (error) {
    console.error("Error in updateDocumentStatus:", error)
    next(error)
  }
}

export async function addTag(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { tag } = req.body

    if (!tag) {
      throw new ApiError(400, "Tag name is required.")
    }

    // Ensure id is a string
    const documentId = typeof id === "string" ? id : id[0]

    const document = await getDocumentService(documentId)

    if (!document) {
      throw new ApiError(404, "Document not found.")
    }

    if (document.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    const updated = await addTagToDocumentService(documentId, tag)

    return ok(
      res,
      updated,
      "Tag added successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function removeTag(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id, tagId } = req.params

    // Ensure ids are strings
    const documentId = typeof id === "string" ? id : id[0]
    const tagIdStr = typeof tagId === "string" ? tagId : tagId[0]

    const document = await getDocumentService(documentId)

    if (!document) {
      throw new ApiError(404, "Document not found.")
    }

    if (document.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    const updated = await removeTagFromDocumentService(documentId, tagIdStr)

    return ok(
      res,
      updated,
      "Tag removed successfully.",
    )
  } catch (error) {
    next(error)
  }
}