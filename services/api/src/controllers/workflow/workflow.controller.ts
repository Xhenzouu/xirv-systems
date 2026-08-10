import type { Request, Response, NextFunction } from "express"

import { requireUser } from "../../utils/require-user.js"
import { ok, created } from "../../utils/response.js"
import { ApiError } from "../../errors/ApiError.js"
import { WorkflowService } from "../../services/workflow/index.js"

// Helper function to get string from query params
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

    // Ensure id is a string
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

    const result = await WorkflowService.listWorkflows(
      user.id,
      {
        status: status as any,
        search: searchStr,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      },
    )

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

    // Ensure id is a string
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

    // Ensure id is a string
    const workflowId = typeof id === "string" ? id : id[0]

    const workflow = await WorkflowService.getWorkflow(workflowId)

    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    const updated = await WorkflowService.updateWorkflowStatus(workflowId, status)

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

    // Ensure id is a string
    const workflowId = typeof id === "string" ? id : id[0]

    const workflow = await WorkflowService.getWorkflow(workflowId)

    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    await WorkflowService.deleteWorkflow(workflowId)

    return ok(res, null, "Workflow deleted successfully")
  } catch (error) {
    next(error)
  }
}