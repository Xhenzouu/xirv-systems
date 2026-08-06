import { prisma } from "../lib/prisma.js"

export async function createRefreshToken(
  token: string,
  userId: string,
  expiresAt: Date,
) {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })
}

export async function findRefreshTokensByUser(
  userId: string,
) {
  return prisma.refreshToken.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function deleteRefreshToken(
  id: string,
) {
  return prisma.refreshToken.delete({
    where: {
      id,
    },
  })
}

export async function deleteUserRefreshTokens(
  userId: string,
) {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  })
}