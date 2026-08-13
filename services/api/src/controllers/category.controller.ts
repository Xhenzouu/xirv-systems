import type { Request, Response, NextFunction } from "express"

import { requireUser,
    ok,
    created
} from "../utils/index.js"
import { ApiError } from "../errors/ApiError.js"
import {
  createCategory,
  findCategoryById,
  findAllCategories,
  updateCategory,
  deleteCategory,
  findCategoryByName,
} from "../repositories/category.repository.js"

import { getRedisValue, setRedisValue, deleteRedisPattern } from "../services/redis.service.js"

export async function createCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied.")
    }

    const { name, description } = req.body

    if (!name) {
      throw new ApiError(400, "Category name is required.")
    }

    const existing = await findCategoryByName(name)
    if (existing) {
      throw new ApiError(409, "Category already exists.")
    }

    const category = await createCategory(name, description)

    await deleteRedisPattern(`categories:list:*`)

    return created(
      res,
      category,
      "Category created successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function getCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params

    const categoryId = typeof id === "string" ? id : id[0]

    const category = await findCategoryById(categoryId)

    if (!category) {
      throw new ApiError(404, "Category not found.")
    }

    return ok(
      res,
      category,
      "Category retrieved successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function listCategories(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cacheKey = `categories:list:all`

    const cachedData = await getRedisValue(cacheKey)
    if (cachedData) {
      return ok(res, cachedData, "Categories retrieved successfully (cached)")
    }

    const categories = await findAllCategories()

    await setRedisValue(cacheKey, categories, 300)

    return ok(
      res,
      categories,
      "Categories retrieved successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function updateCategoryController(
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
    const { name, description } = req.body

    const categoryId = typeof id === "string" ? id : id[0]

    const existing = await findCategoryById(categoryId)

    if (!existing) {
      throw new ApiError(404, "Category not found.")
    }

    const updated = await updateCategory(categoryId, name, description)

    await deleteRedisPattern(`categories:list:*`)

    return ok(
      res,
      updated,
      "Category updated successfully.",
    )
  } catch (error) {
    next(error)
  }
}

export async function deleteCategoryController(
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

    const categoryId = typeof id === "string" ? id : id[0]

    const existing = await findCategoryById(categoryId)

    if (!existing) {
      throw new ApiError(404, "Category not found.")
    }

    await deleteCategory(categoryId)

    await deleteRedisPattern(`categories:list:*`)

    return ok(
      res,
      null,
      "Category deleted successfully.",
    )
  } catch (error) {
    next(error)
  }
}