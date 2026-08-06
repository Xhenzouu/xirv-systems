import bcrypt from "bcrypt"

import { security } from "../config/security.js"
import { ApiError } from "../errors/ApiError.js"

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  type RefreshTokenPayload,
} from "../lib/jwt.js"

import {
  createRefreshToken,
  deleteRefreshToken,
  findRefreshTokensByUser,
} from "../repositories/refresh-token.repository.js"

import {
  findUserById,
} from "../repositories/user.repository.js"

export async function refreshLogin(
  refreshToken: string,
) {
  let payload: RefreshTokenPayload

  try {
    payload = verifyRefreshToken(
      refreshToken,
    )
  } catch {
    throw new ApiError(
      401,
      "Invalid refresh token.",
    )
  }

  console.log("\n========== REFRESH REQUEST ==========")
  console.log("User ID:", payload.sub)

  const user = await findUserById(
    payload.sub,
  )

  if (!user) {
    throw new ApiError(
      401,
      "Invalid refresh token.",
    )
  }

  const storedTokens =
    await findRefreshTokensByUser(
      user.id,
    )

  console.log(
    "Stored refresh tokens:",
    storedTokens.length,
  )

  let matchedToken:
    | (typeof storedTokens)[number]
    | null = null

  for (const storedToken of storedTokens) {
    const matches = await bcrypt.compare(
      refreshToken,
      storedToken.token,
    )

    console.log(
      `Checking ${storedToken.id}:`,
      matches,
    )

    if (matches) {
      matchedToken = storedToken
      break
    }
  }

  if (!matchedToken) {
    console.log("No matching refresh token found.")

    throw new ApiError(
      401,
      "Invalid refresh token.",
    )
  }

  console.log({
    incomingToken: refreshToken,
    matchedId: matchedToken.id,
  })

  await deleteRefreshToken(
    matchedToken.id,
  )

  console.log(
    "Deleted token:",
    matchedToken.id,
  )

  const accessToken =
    generateAccessToken(
        user.id,
        user.email,
        user.role,
    )

  const newRefreshToken =
    generateRefreshToken(
      user.id,
    )

  const hashedRefreshToken =
    await bcrypt.hash(
      newRefreshToken,
      security.bcryptRounds,
    )

  const expiresAt = new Date()

  expiresAt.setDate(
    expiresAt.getDate() +
      security.refreshTokenDays,
  )

  const created =
    await createRefreshToken(
      hashedRefreshToken,
      user.id,
      expiresAt,
    )

  console.log({
    newRefreshToken,
    createdId: created.id,
  })

  console.log("========== END REFRESH ==========\n")

  return {
    accessToken,
    refreshToken: newRefreshToken,
  }
}