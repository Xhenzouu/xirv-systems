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

export async function users(
  _req: Request,
  res: Response,
) {
  const result =
    await getAllUsers()

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
  const result =
    await getUser(
      String(req.params.id),
    )

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
  const actor =
    requireUser(req)

  const {
    role,
  } = req.body

  const result =
    await changeUserRole(
      actor.id,
      actor.role,
      String(req.params.id),
      role,
    )

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