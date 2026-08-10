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

export async function profile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser =
      requireUser(req)

    const user =
      await getUserById(
        authUser.id,
      )

    return ok(
      res,
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
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
  const user =
    requireUser(req)

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
  const user =
    requireUser(req)

  const {
    firstName,
    lastName,
    email,
  } = req.body

  const updated =
    await updateProfile(
      user.id,
      firstName,
      lastName,
      email,
    )

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
  const user =
    requireUser(req)

  const {
    currentPassword,
    newPassword,
  } = req.body

  await changePassword(
    user.id,
    currentPassword,
    newPassword,
  )

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
  const user =
    requireUser(req)

  const {
    password,
  } = req.body

  await deleteAccount(
    user.id,
    password,
  )

  return ok(
    res,
    null,
    "Account deleted successfully.",
  )
}