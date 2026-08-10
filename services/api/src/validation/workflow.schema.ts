import { z } from "zod"

export const createWorkflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().optional(),
  triggerType: z.enum(["MANUAL", "SCHEDULED", "EVENT", "WEBHOOK"]).default("MANUAL"),
  triggerConfig: z.any().optional(),
  definition: z.any(),
  isTemplate: z.boolean().default(false),
})

export const updateWorkflowSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  triggerType: z.enum(["MANUAL", "SCHEDULED", "EVENT", "WEBHOOK"]).optional(),
  triggerConfig: z.any().optional(),
  definition: z.any().optional(),
})

export const updateWorkflowStatusSchema = z.object({
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ARCHIVED"]),
})

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.number().int().min(1).max(5).default(1),
  metadata: z.any().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.number().int().min(1).max(5).optional(),
  metadata: z.any().optional(),
})

export const updateTaskStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "BLOCKED"]),
})

export const updateApprovalSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]),
  comment: z.string().optional(),
})