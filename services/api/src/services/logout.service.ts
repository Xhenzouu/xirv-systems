import bcrypt from "bcrypt"

import {
  ApiError,
} from "../errors/ApiError.js"

import {
  findRefreshTokensByUser,
  deleteRefreshToken,
} from "../repositories/refresh-token.repository.js"

import {
  verifyRefreshToken,
  type RefreshTokenPayload,
} from "../lib/jwt.js"

export async function logoutUser(
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


  const storedTokens =
    await findRefreshTokensByUser(
      payload.sub,
    )


  for (const storedToken of storedTokens) {

    const matches =
      await bcrypt.compare(
        refreshToken,
        storedToken.token,
      )


    if (matches) {

      await deleteRefreshToken(
        storedToken.id,
      )

      return true
    }
  }


  throw new ApiError(
    401,
    "Refresh token not found.",
  )
}