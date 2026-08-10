import type { Request, Response, NextFunction } from "express"

import { requireUser } from "../../utils/require-user.js"
import { ok, created } from "../../utils/response.js"
import { ApiError } from "../../errors/ApiError.js"
import { WorkflowService, TaskService } from "../../services/workflow/index.js"

// Helper function to get string from query params
function getStringFromQuery(value: any): string | undefined {
  if (typeof value === "string") return value
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") return value[0]
  return undefined
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { instanceId } = req.params
    const { title, description, assignedTo, dueDate, priority, metadata } = req.body

    if (!title) {
      throw new ApiError(400, "Task title is required")
    }

    // Ensure instanceId is a string
    const instanceIdStr = typeof instanceId === "string" ? instanceId : instanceId[0]

    const task = await TaskService.createTask(instanceIdStr, {
      title,
      description,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      metadata,
    })

    return created(res, task, "Task created successfully")
  } catch (error) {
    next(error)
  }
}

export async function getTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    // Ensure id is a string
    const taskId = typeof id === "string" ? id : id[0]

    const task = await TaskService.getTask(taskId)

    const workflow = await WorkflowService.getWorkflow(task.instance.workflowId)
    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    return ok(res, task, "Task retrieved successfully")
  } catch (error) {
    next(error)
  }
}

export async function listTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)

    const { instanceId, assignedTo, status, limit, offset } = req.query

    const instanceIdStr = getStringFromQuery(instanceId)
    const assignedToStr = getStringFromQuery(assignedTo)

    const result = await TaskService.listTasks({
      instanceId: instanceIdStr,
      assignedTo: assignedToStr,
      status: status as any,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    })

    return ok(res, result, "Tasks retrieved successfully")
  } catch (error) {
    next(error)
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { title, description, assignedTo, dueDate, priority, metadata } = req.body

    // Ensure id is a string
    const taskId = typeof id === "string" ? id : id[0]

    const task = await TaskService.getTask(taskId)

    const workflow = await WorkflowService.getWorkflow(task.instance.workflowId)
    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    const updated = await TaskService.updateTask(taskId, {
      title,
      description,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      metadata,
    })

    return ok(res, updated, "Task updated successfully")
  } catch (error) {
    next(error)
  }
}

export async function updateTaskStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { status } = req.body

    // Ensure id is a string
    const taskId = typeof id === "string" ? id : id[0]

    const task = await TaskService.getTask(taskId)

    const workflow = await WorkflowService.getWorkflow(task.instance.workflowId)
    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    const updated = await TaskService.updateTaskStatus(taskId, status)

    return ok(res, updated, "Task status updated successfully")
  } catch (error) {
    next(error)
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    // Ensure id is a string
    const taskId = typeof id === "string" ? id : id[0]

    const task = await TaskService.getTask(taskId)

    const workflow = await WorkflowService.getWorkflow(task.instance.workflowId)
    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    await TaskService.deleteTask(taskId)

    return ok(res, null, "Task deleted successfully")
  } catch (error) {
    next(error)
  }
}