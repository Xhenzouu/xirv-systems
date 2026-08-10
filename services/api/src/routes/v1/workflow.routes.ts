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
import { authenticate } from "../../middleware/index.js"

const router = Router()

// All workflow routes require authentication
router.use(authenticate)

// ============ Workflow Routes ============
router.post("/", createWorkflow)
router.get("/", listWorkflows)
router.get("/:id", getWorkflow)
router.patch("/:id", updateWorkflow)
router.patch("/:id/status", updateWorkflowStatus)
router.delete("/:id", deleteWorkflow)

// Workflow execution
router.post("/:id/execute", executeWorkflow)

// ============ Instance Routes ============
router.get("/instances", listInstances)
router.get("/instances/:id", getInstance)

// ============ Task Routes ============
router.post("/instances/:instanceId/tasks", createTask)
router.get("/tasks", listTasks)
router.get("/tasks/:id", getTask)
router.patch("/tasks/:id", updateTask)
router.patch("/tasks/:id/status", updateTaskStatus)
router.delete("/tasks/:id", deleteTask)

// ============ Approval Routes ============
router.post("/tasks/:taskId/approvals", createApproval)
router.get("/tasks/:taskId/approvals", listApprovals)
router.patch("/approvals/:id", updateApproval)

export default router