import { prisma } from "../../src/lib/prisma.js"

export async function clearDatabase() {
  // Delete in correct order to avoid foreign key constraints
  await prisma.refreshToken.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.user.deleteMany()
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
}