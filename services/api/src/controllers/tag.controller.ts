import type { Request, Response, NextFunction } from "express"

import { requireUser,
    ok,
    created
} from "../utils/index.js"
import { ApiError } from "../errors/ApiError.js"
import {
  createTag,
  findTagById,
  findAllTags,
  updateTag,
  deleteTag,
  findTagByName,
} from "../repositories/tag.repository.js"

export async function createTagController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    const { name } = req.body

    if (!name) {
      throw new ApiError(400, "Tag name is required.")
    }

    const existing = await findTagByName(name)
    if (existing) {
      throw new ApiError(409, "Tag already exists.")
    }

    const tag = await createTag(name)

    return created(
      res,
      tag,
      "Tag created successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function getTag(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params

    // Ensure id is a string
    const tagId = typeof id === "string" ? id : id[0]

    const tag = await findTagById(tagId)

    if (!tag) {
      throw new ApiError(404, "Tag not found.")
    }

    return ok(
      res,
      tag,
      "Tag retrieved successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function listTags(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tags = await findAllTags()

    return ok(
      res,
      tags,
      "Tags retrieved successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function updateTagController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    const { id } = req.params
    const { name } = req.body

    // Ensure id is a string
    const tagId = typeof id === "string" ? id : id[0]

    const existing = await findTagById(tagId)

    if (!existing) {
      throw new ApiError(404, "Tag not found.")
    }

    const updated = await updateTag(tagId, name)

    return ok(
      res,
      updated,
      "Tag updated successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function deleteTagController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    const { id } = req.params

    // Ensure id is a string
    const tagId = typeof id === "string" ? id : id[0]

    const existing = await findTagById(tagId)

    if (!existing) {
      throw new ApiError(404, "Tag not found.")
    }

    await deleteTag(tagId)

    return ok(
      res,
      null,
      "Tag deleted successfully.",
    )
  } catch (error) {
    next(error)
  }
}