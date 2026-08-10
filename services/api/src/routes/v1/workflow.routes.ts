import { Router } from "express"

import {
  createWorkflow,
  getWorkflow,
  listWorkflows,
  updateWorkflow,
  updateWorkflowStatus,
  deleteWorkflow,
  executeWorkflow,
  getInstance,
  listInstances,
  createTask,
  getTask,
  listTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  createApproval,
  updateApproval,
  listApprovals,
} from "../../controllers/workflow/index.js"
import { authenticate, validate } from "../../middleware/index.js"
import {
  createWorkflowSchema,
  updateWorkflowSchema,
  updateWorkflowStatusSchema,
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  updateApprovalSchema,
} from "../../validation/index.js"

const router = Router()

// All workflow routes require authentication
router.use(authenticate)

// ============ Workflow Routes ============
router.post("/", validate(createWorkflowSchema), createWorkflow)
router.get("/", listWorkflows)
router.get("/:id", getWorkflow)
router.patch("/:id", validate(updateWorkflowSchema), updateWorkflow)
router.patch("/:id/status", validate(updateWorkflowStatusSchema), updateWorkflowStatus)
router.delete("/:id", deleteWorkflow)

// Workflow execution
router.post("/:id/execute", executeWorkflow)

// ============ Instance Routes ============
router.get("/instances", listInstances)
router.get("/instances/:id", getInstance)

// ============ Task Routes ============
router.post("/instances/:instanceId/tasks", validate(createTaskSchema), createTask)
router.get("/tasks", listTasks)
router.get("/tasks/:id", getTask)
router.patch("/tasks/:id", validate(updateTaskSchema), updateTask)
router.patch("/tasks/:id/status", validate(updateTaskStatusSchema), updateTaskStatus)
router.delete("/tasks/:id", deleteTask)

// ============ Approval Routes ============
router.post("/tasks/:taskId/approvals", createApproval)
router.get("/tasks/:taskId/approvals", listApprovals)
router.patch("/approvals/:id", validate(updateApprovalSchema), updateApproval)

export default router