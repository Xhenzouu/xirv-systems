import type {
  NextFunction,
  Request,
  Response,
} from "express"

import {
  getUserById,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../services/index.js"

import {
  ok,
} from "../utils/index.js"

import {
  requireUser,
} from "../utils/require-user.js"

import { getRedisValue, setRedisValue, deleteRedisValue } from "../services/redis.service.js"

export async function profile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = requireUser(req)

    const cacheKey = `user:profile:${authUser.id}`

    const cachedData = await getRedisValue(cacheKey)
    if (cachedData) {
      return ok(res, cachedData, "Profile retrieved successfully (cached)")
    }

    const user = await getUserById(authUser.id)

    const profileData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }

    await setRedisValue(cacheKey, profileData, 3600)

    return ok(
      res,
      profileData,
      "Profile retrieved successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export function adminTest(
  req: Request,
  res: Response,
) {
  const user = requireUser(req)

  return ok(
    res,
    {
      user: user.email,
      role: user.role,
    },
    "Admin access granted.",
  )
}

export async function update(
  req: Request,
  res: Response,
) {
  const user = requireUser(req)

  const {
    firstName,
    lastName,
    email,
  } = req.body

  const updated = await updateProfile(
    user.id,
    firstName,
    lastName,
    email,
  )

  await deleteRedisValue(`user:profile:${user.id}`)

  return ok(
    res,
    {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      role: updated.role,
    },
    "Profile updated successfully.",
  )
}

export async function updatePassword(
  req: Request,
  res: Response,
) {
  const user = requireUser(req)

  const {
    currentPassword,
    newPassword,
  } = req.body

  await changePassword(
    user.id,
    currentPassword,
    newPassword,
  )

  await deleteRedisValue(`user:profile:${user.id}`)

  return ok(
    res,
    null,
    "Password updated successfully.",
  )
}

export async function removeAccount(
  req: Request,
  res: Response,
) {
  const user = requireUser(req)

  const {
    password,
  } = req.body

  await deleteAccount(
    user.id,
    password,
  )

  await deleteRedisValue(`user:profile:${user.id}`)

  return ok(
    res,
    null,
    "Account deleted successfully.",
  )
}