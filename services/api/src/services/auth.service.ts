import bcrypt from "bcrypt"

import { security } from "../config/security.js"
import { ApiError } from "../errors/ApiError.js"

import {
  generateAccessToken,
  generateRefreshToken,
} from "../lib/jwt.js"

import {
  createRefreshToken,
} from "../repositories/refresh-token.repository.js"

import {
  createUser,
  findUserByEmail,
} from "../repositories/user.repository.js"

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  const existing = await findUserByEmail(email)

  if (existing) {
    throw new ApiError(
      409,
      "An account with this email already exists.",
    )
  }

  const hashedPassword = await bcrypt.hash(
    password,
    security.bcryptRounds,
  )

  return createUser(
    firstName,
    lastName,
    email,
    hashedPassword,
  )
}

export async function loginUser(
  email: string,
  password: string,
) {
  const user = await findUserByEmail(email)

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password.",
    )
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password,
  )

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password.",
    )
  }

  const accessToken =
  generateAccessToken(
    user.id,
    user.email,
    user.role,
  )

  const refreshToken = generateRefreshToken(
    user.id,
  )

  const hashedRefreshToken = await bcrypt.hash(
    refreshToken,
    security.bcryptRounds,
  )

  const expiresAt = new Date()

  expiresAt.setDate(
    expiresAt.getDate() + 30,
  )

  await createRefreshToken(
    hashedRefreshToken,
    user.id,
    expiresAt,
  )

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  }
}