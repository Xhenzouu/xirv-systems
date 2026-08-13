import type { Request, Response, NextFunction } from "express"

import { requireUser } from "../../utils/require-user.js"
import { ok, created } from "../../utils/response.js"
import { ApiError } from "../../errors/ApiError.js"
import { WorkflowService } from "../../services/workflow/index.js"

import { getRedisValue, setRedisValue, deleteRedisPattern } from "../../services/redis.service.js"

function getStringFromQuery(value: any): string | undefined {
  if (typeof value === "string") return value
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") return value[0]
  return undefined
}

export async function createWorkflow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const { name, description, triggerType, triggerConfig, definition, isTemplate } = req.body

    if (!name) {
      throw new ApiError(400, "Workflow name is required")
    }

    if (!definition) {
      throw new ApiError(400, "Workflow definition is required")
    }

    const workflow = await WorkflowService.createWorkflow(user.id, {
      name,
      description,
      triggerType: triggerType || "MANUAL",
      triggerConfig,
      definition,
      isTemplate,
    })

    await deleteRedisPattern(`workflows:list:*`)

    return created(res, workflow, "Workflow created successfully")
  } catch (error) {
    next(error)
  }
}

export async function getWorkflow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    const workflowId = typeof id === "string" ? id : id[0]

    const workflow = await WorkflowService.getWorkflow(workflowId)

    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    return ok(res, workflow, "Workflow retrieved successfully")
  } catch (error) {
    next(error)
  }
}

export async function listWorkflows(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const { status, search, limit, offset } = req.query

    const searchStr = getStringFromQuery(search)

    const cacheKey = `workflows:list:${user.id}:${status || 'all'}:${searchStr || 'none'}:${limit || 20}:${offset || 0}`

    const cachedData = await getRedisValue(cacheKey)
    if (cachedData) {
      return ok(res, cachedData, "Workflows retrieved successfully (cached)")
    }

    const result = await WorkflowService.listWorkflows(
      user.id,
      {
        status: status as any,
        search: searchStr,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      },
    )

    await setRedisValue(cacheKey, result, 300)

    return ok(res, result, "Workflows retrieved successfully")
  } catch (error) {
    next(error)
  }
}

export async function updateWorkflow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { name, description, triggerType, triggerConfig, definition } = req.body

    const workflowId = typeof id === "string" ? id : id[0]

    const workflow = await WorkflowService.getWorkflow(workflowId)

    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    const updated = await WorkflowService.updateWorkflow(workflowId, {
      name,
      description,
      triggerType,
      triggerConfig,
      definition,
    })

    await deleteRedisPattern(`workflows:list:*`)

    return ok(res, updated, "Workflow updated successfully")
  } catch (error) {
    next(error)
  }
}

export async function updateWorkflowStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { status } = req.body

    const workflowId = typeof id === "string" ? id : id[0]

    const workflow = await WorkflowService.getWorkflow(workflowId)

    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    const updated = await WorkflowService.updateWorkflowStatus(workflowId, status)

    await deleteRedisPattern(`workflows:list:*`)

    return ok(res, updated, "Workflow status updated successfully")
  } catch (error) {
    next(error)
  }
}

export async function deleteWorkflow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    const workflowId = typeof id === "string" ? id : id[0]

    const workflow = await WorkflowService.getWorkflow(workflowId)

    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    await WorkflowService.deleteWorkflow(workflowId)

    await deleteRedisPattern(`workflows:list:*`)

    return ok(res, null, "Workflow deleted successfully")
  } catch (error) {
    next(error)
  }
}