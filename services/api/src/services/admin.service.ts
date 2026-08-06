import {
  findAllUsers,
  findUserById,
  updateUserRole,
} from "../repositories/index.js"

import { ApiError } from "../errors/ApiError.js"

import type { Role } from "@prisma/client"

export async function getAllUsers() {
  return findAllUsers()
}

export async function getUser(
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

export async function changeUserRole(
  actorId: string,
  actorRole: Role,
  id: string,
  role: Role,
) {
  const user = await findUserById(id)

  if (!user) {
    throw new ApiError(
      404,
      "User not found.",
    )
  }

  if (actorId === user.id) {
    throw new ApiError(
      403,
      "You cannot change your own role.",
    )
  }

  if (
    actorRole === "ADMIN" &&
    user.role === "SUPER_ADMIN"
  ) {
    throw new ApiError(
      403,
      "You cannot modify a SUPER_ADMIN account.",
    )
  }

  if (
    actorRole === "ADMIN" &&
    role === "SUPER_ADMIN"
  ) {
    throw new ApiError(
      403,
      "Only SUPER_ADMIN can assign SUPER_ADMIN.",
    )
  }

  return updateUserRole(
    id,
    role,
  )
}