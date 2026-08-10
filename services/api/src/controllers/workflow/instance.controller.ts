import type { Request, Response, NextFunction } from "express"

import { requireUser } from "../../utils/require-user.js"
import { ok, created } from "../../utils/response.js"
import { ApiError } from "../../errors/ApiError.js"
import { WorkflowService, InstanceService } from "../../services/workflow/index.js"

// Helper function to get string from query params
function getStringFromQuery(value: any): string | undefined {
  if (typeof value === "string") return value
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") return value[0]
  return undefined
}

export async function executeWorkflow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { context } = req.body

    // Ensure id is a string
    const workflowId = typeof id === "string" ? id : id[0]

    const workflow = await WorkflowService.getWorkflow(workflowId)

    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    const instance = await InstanceService.executeWorkflow(workflowId, user.id, context)

    return created(res, instance, "Workflow executed successfully")
  } catch (error) {
    next(error)
  }
}

export async function getInstance(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    // Ensure id is a string
    const instanceId = typeof id === "string" ? id : id[0]

    const instance = await InstanceService.getInstance(instanceId)

    const workflow = await WorkflowService.getWorkflow(instance.workflowId)

    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    return ok(res, instance, "Instance retrieved successfully")
  } catch (error) {
    next(error)
  }
}

export async function listInstances(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const { workflowId, status, limit, offset } = req.query

    const workflowIdStr = getStringFromQuery(workflowId)

    const result = await InstanceService.listInstances(
      workflowIdStr,
      {
        status: status as any,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      },
    )

    return ok(res, result, "Instances retrieved successfully")
  } catch (error) {
    next(error)
  }
}