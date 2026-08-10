import { prisma } from "../lib/prisma.js"

export async function createCategory(name: string, description?: string) {
  return prisma.category.create({
    data: {
      name,
      description,
    },
  })
}

export async function findCategoryById(id: string) {
  return prisma.category.findUnique({
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

export async function findAllCategories() {
  return prisma.category.findMany({
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

export async function updateCategory(id: string, name: string, description?: string) {
  return prisma.category.update({
    where: { id },
    data: {
      name,
      description,
    },
  })
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  })
}

export async function findCategoryByName(name: string) {
  return prisma.category.findUnique({
    where: { name },
  })
}