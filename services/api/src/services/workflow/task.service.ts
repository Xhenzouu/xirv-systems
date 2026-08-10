import { prisma } from "../../lib/prisma.js"
import { ApiError } from "../../errors/ApiError.js"
import type { TaskStatus } from "@prisma/client"
import { InstanceService } from "./instance.service.js"

export interface CreateTaskData {
  title: string
  description?: string
  assignedTo?: string
  dueDate?: Date
  priority?: number
  metadata?: any
}

export class TaskService {
  static async createTask(instanceId: string, data: CreateTaskData) {
    const instance = await InstanceService.getInstance(instanceId)

    return prisma.task.create({
      data: {
        instanceId,
        workflowId: instance.workflowId,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
        priority: data.priority || 1,
        metadata: data.metadata || {},
      },
    })
  }

  static async getTask(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        instance: {
          include: {
            workflow: true,
          },
        },
        approvals: {
          include: {
            approver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!task) {
      throw new ApiError(404, "Task not found")
    }

    return task
  }

  static async listTasks(
    options?: {
      instanceId?: string
      assignedTo?: string
      status?: TaskStatus
      limit?: number
      offset?: number
    },
  ) {
    const { instanceId, assignedTo, status, limit = 20, offset = 0 } = options || {}

    const where: any = {
      ...(instanceId && { instanceId }),
      ...(assignedTo && { assignedTo }),
      ...(status && { status }),
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          approvals: {
            include: {
              approver: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { dueDate: "asc" },
        skip: offset,
        take: limit,
      }),
      prisma.task.count({ where }),
    ])

    return { tasks, total, limit, offset }
  }

  static async updateTaskStatus(id: string, status: TaskStatus) {
    const data: any = { status }
    if (status === "COMPLETED") {
      data.completedAt = new Date()
    }
    return prisma.task.update({
      where: { id },
      data,
    })
  }

  static async updateTask(id: string, data: Partial<CreateTaskData>) {
    return prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
        priority: data.priority,
        metadata: data.metadata,
      },
    })
  }

  static async deleteTask(id: string) {
    return prisma.task.delete({
      where: { id },
    })
  }
}