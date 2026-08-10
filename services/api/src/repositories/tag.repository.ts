import { prisma } from "../lib/prisma.js"

export async function createTag(name: string) {
  return prisma.tag.create({
    data: { name },
  })
}

export async function findTagById(id: string) {
  return prisma.tag.findUnique({
    where: { id },
    include: {
      documents: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      },
    },
  })
}

export async function findAllTags() {
  return prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { documents: true },
      },
    },
  })
}

export async function findTagByName(name: string) {
  return prisma.tag.findUnique({
    where: { name },
  })
}

export async function updateTag(id: string, name: string) {
  return prisma.tag.update({
    where: { id },
    data: { name },
  })
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({
    where: { id },
  })
}

export async function findOrCreateTag(name: string) {
  const existing = await findTagByName(name)

  if (existing) {
    return existing
  }

  return createTag(name)
}