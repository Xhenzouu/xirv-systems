import { prisma } from "../../src/lib/prisma.js"

export async function clearDatabase() {
  await prisma.refreshToken.deleteMany()

  await prisma.user.deleteMany()
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
}