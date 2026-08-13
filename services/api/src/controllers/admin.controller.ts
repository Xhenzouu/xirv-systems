import type {
  Request,
  Response,
} from "express"

import {
  ok,
} from "../utils/response.js"

import {
  requireUser,
} from "../utils/require-user.js"

import {
  getAllUsers,
  getUser,
  changeUserRole,
} from "../services/admin.service.js"

import { getRedisValue, setRedisValue, deleteRedisPattern, deleteRedisValue } from "../services/redis.service.js"

export async function users(
  _req: Request,
  res: Response,
) {
  const cacheKey = `admin:users:all`

  const cachedData = await getRedisValue(cacheKey)
  if (cachedData) {
    return ok(res, cachedData, "Users retrieved successfully (cached)")
  }

  const result = await getAllUsers()

  await setRedisValue(cacheKey, result, 300)

  return ok(
    res,
    result,
    "Users retrieved successfully.",
  )
}

export async function user(
  req: Request,
  res: Response,
) {
  const userId = String(req.params.id)

  const cacheKey = `admin:user:${userId}`

  const cachedData = await getRedisValue(cacheKey)
  if (cachedData) {
    return ok(res, cachedData, "User retrieved successfully (cached)")
  }

  const result = await getUser(userId)

  await setRedisValue(cacheKey, result, 300)

  return ok(
    res,
    result,
    "User retrieved successfully.",
  )
}

export async function updateRole(
  req: Request,
  res: Response,
) {
  const actor = requireUser(req)

  const {
    role,
  } = req.body

  const userId = String(req.params.id)

  const result = await changeUserRole(
    actor.id,
    actor.role,
    userId,
    role,
  )

  await deleteRedisPattern(`admin:users:*`)
  await deleteRedisValue(`admin:user:${userId}`)

  return ok(
    res,
    {
      id: result.id,
      email: result.email,
      role: result.role,
    },
    "User role updated successfully.",
  )
}