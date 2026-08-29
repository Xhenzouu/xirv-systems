import { prisma } from "../lib/prisma.js"
import { ApiError } from "../errors/ApiError.js"
import bcrypt from "bcrypt"
import { security } from "../config/security.js"

import {
  findUserById,
  findUserByEmail,
  updateUser,
  updatePassword,
  deleteUserRefreshTokens,
  deleteUser
} from "../repositories/index.js"

export async function getUserById(
  id: string,
) {
  const user = await findUserById(id)

  if (!user) {
    throw new ApiError(
      404,
      "User not found.",
    )
  }

  return user
}

export async function updateProfile(
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  avatar?: string | null,
  bio?: string | null,
  phone?: string | null,
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
      email,
      ...(avatar !== undefined && { avatar }),
      ...(bio !== undefined && { bio }),
      ...(phone !== undefined && { phone }),
      updatedAt: new Date(),
    },
  })
}

export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string,
) {
  const user =
    await getUserById(id)

  const matches =
    await bcrypt.compare(
      currentPassword,
      user.password,
    )

  if (!matches) {
    throw new ApiError(
      401,
      "Current password is incorrect.",
    )
  }

  const samePassword =
    await bcrypt.compare(
      newPassword,
      user.password,
    )

  if (samePassword) {
    throw new ApiError(
      400,
      "New password must be different from the current password.",
    )
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      security.bcryptRounds,
    )

  await updatePassword(
    id,
    hashedPassword,
  )

  await deleteUserRefreshTokens(
    id,
  )
}

export async function deleteAccount(
  id: string,
  password: string,
) {
  const user =
    await getUserById(id)

  const matches =
    await bcrypt.compare(
      password,
      user.password,
    )

  if (!matches) {
    throw new ApiError(
      401,
      "Incorrect password.",
    )
  }

  await deleteUserRefreshTokens(
    id,
  )

  await deleteUser(
    id,
  )
}