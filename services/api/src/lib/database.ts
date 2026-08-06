import { prisma } from "./prisma.js"

export async function disconnectDatabase() {
  await prisma.$disconnect()
}

export async function isDatabaseConnected() {
  try {
    await prisma.$queryRaw`SELECT 1`

    return true
  } catch {
    return false
  }
}