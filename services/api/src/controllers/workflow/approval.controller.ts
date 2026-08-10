import type { Request, Response, NextFunction } from "express"

import { requireUser } from "../../utils/require-user.js"
import { ok, created } from "../../utils/response.js"
import { ApiError } from "../../errors/ApiError.js"
import { WorkflowService, TaskService, ApprovalService } from "../../services/workflow/index.js"

export async function createApproval(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { taskId } = req.params

    // Ensure taskId is a string
    const taskIdStr = typeof taskId === "string" ? taskId : taskId[0]
    const { comment } = req.body

    const task = await TaskService.getTask(taskIdStr)

    const workflow = await WorkflowService.getWorkflow(task.instance.workflowId)
    if (workflow.createdBy !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Access denied")
    }

    const approval = await ApprovalService.createApproval(taskIdStr, user.id, comment)

    return created(res, approval, "Approval requested successfully")
  } catch (error) {
    next(error)
  }
}

export async function updateApproval(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { status, comment } = req.body

    // Ensure id is a string
    const approvalId = typeof id === "string" ? id : id[0]

    const approval = await ApprovalService.updateApproval(approvalId, status, comment)

    return ok(res, approval, "Approval updated successfully")
  } catch (error) {
    next(error)
  }
}

export async function listApprovals(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { taskId } = req.params

    // Ensure taskId is a string
    const taskIdStr = typeof taskId === "string" ? taskId : taskId[0]

    const approvals = await ApprovalService.listApprovals(taskIdStr)

    return ok(res, approvals, "Approvals retrieved successfully")
  } catch (error) {
    next(error)
  }
}