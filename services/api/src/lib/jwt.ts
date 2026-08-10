import jwt, {
  type JwtPayload,
} from "jsonwebtoken"

import type { Role } from "@prisma/client"

function getEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not defined.`)
  }

  return value
}

// Use JWT_ACCESS_SECRET instead of JWT_SECRET
const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET")
const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET")

const JWT_ACCESS_EXPIRES_IN =
  process.env.JWT_ACCESS_EXPIRES_IN || "15m"

const JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || "30d"

export interface AccessTokenPayload
  extends JwtPayload {
  sub: string
  email: string
  role: Role
}

export interface RefreshTokenPayload
  extends JwtPayload {
  sub: string
}

export function generateAccessToken(
  id: string,
  email: string,
  role: Role,
) {
  return jwt.sign(
    {
      sub: id,
      email,
      role,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn:
        JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  )
}

export function generateRefreshToken(
  id: string,
) {
  return jwt.sign(
    {
      sub: id,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn:
        JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  )
}

export function verifyAccessToken(
  token: string,
): AccessTokenPayload {
  return jwt.verify(
    token,
    JWT_ACCESS_SECRET,
  ) as AccessTokenPayload
}

export function verifyRefreshToken(
  token: string,
): RefreshTokenPayload {
  return jwt.verify(
    token,
    JWT_REFRESH_SECRET,
  ) as RefreshTokenPayload
}