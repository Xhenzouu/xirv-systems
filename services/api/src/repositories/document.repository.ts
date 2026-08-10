import { prisma } from "../lib/prisma.js"
import type { DocumentStatus, Prisma } from "@prisma/client"

export async function createDocument(
  data: {
    userId: string
    title: string
    description?: string
    fileName: string
    filePath: string
    fileSize: number
    mimeType: string
    content?: string
    categoryId?: string
  },
) {
  const { userId, categoryId, ...rest } = data

  return prisma.document.create({
    data: {
      ...rest,
      user: {
        connect: { id: userId },
      },
      ...(categoryId && {
        category: {
          connect: { id: categoryId },
        },
      }),
    },
    include: {
      category: true,
      tags: true,
    },
  })
}

export async function findDocumentById(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      category: true,
      tags: true,
      versions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  })
}

export async function findDocumentsByUser(
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
  const { status, categoryId, tagId, search, limit = 20, offset = 0 } = options || {}

  const where: Prisma.DocumentWhereInput = {
    userId,
    ...(status && { status }),
    ...(categoryId && { categoryId }),
    ...(tagId && {
      tags: {
        some: { id: tagId },
      },
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    }),
    prisma.document.count({ where }),
  ])

  return {
    documents,
    total,
    limit,
    offset,
  }
}

export async function updateDocument(
  id: string,
  data: Partial<Prisma.DocumentUpdateInput>,
) {
  return prisma.document.update({
    where: { id },
    data,
    include: {
      category: true,
      tags: true,
    },
  })
}

export async function deleteDocument(id: string) {
  return prisma.document.delete({
    where: { id },
  })
}

export async function updateDocumentStatus(
  id: string,
  status: DocumentStatus,
) {
  return prisma.document.update({
    where: { id },
    data: { status },
    include: {
      category: true,
      tags: true,
    },
  })
}

export async function createDocumentVersion(
  documentId: string,
  version: number,
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
  return prisma.documentVersion.create({
    data: {
      ...data,
      version,
      document: {
        connect: { id: documentId },
      },
    },
  })
}

export async function getDocumentVersions(documentId: string) {
  return prisma.documentVersion.findMany({
    where: { documentId },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function addTagToDocument(documentId: string, tagId: string) {
  return prisma.document.update({
    where: { id: documentId },
    data: {
      tags: {
        connect: { id: tagId },
      },
    },
    include: {
      tags: true,
    },
  })
}

export async function removeTagFromDocument(documentId: string, tagId: string) {
  return prisma.document.update({
    where: { id: documentId },
    data: {
      tags: {
        disconnect: { id: tagId },
      },
    },
    include: {
      tags: true,
    },
  })
}