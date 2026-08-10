import { prisma } from "../../lib/prisma.js"
import { ApiError } from "../../errors/ApiError.js"
import type { WorkflowStatus, WorkflowTriggerType } from "@prisma/client"

export interface CreateWorkflowData {
  name: string
  description?: string
  triggerType: WorkflowTriggerType
  triggerConfig?: any
  definition: any
  isTemplate?: boolean
}

export class WorkflowService {
  static async createWorkflow(userId: string, data: CreateWorkflowData) {
    return prisma.workflow.create({
      data: {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig || {},
        definition: data.definition,
        isTemplate: data.isTemplate || false,
        createdBy: userId,
      },
    })
  }

  static async getWorkflow(id: string) {
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        instances: {
          orderBy: { startedAt: "desc" },
          take: 10,
        },
        tasks: {
          where: { status: { not: "COMPLETED" } },
        },
      },
    })

    if (!workflow) {
      throw new ApiError(404, "Workflow not found")
    }

    return workflow
  }

  static async listWorkflows(
    userId: string,
    options?: {
      status?: WorkflowStatus
      search?: string
      limit?: number
      offset?: number
    },
  ) {
    const { status, search, limit = 20, offset = 0 } = options || {}

    const where: any = {
      createdBy: userId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where,
        include: {
          instances: {
            orderBy: { startedAt: "desc" },
            take: 1,
          },
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.workflow.count({ where }),
    ])

    return { workflows, total, limit, offset }
  }

  static async updateWorkflow(id: string, data: Partial<CreateWorkflowData>) {
    return prisma.workflow.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig,
        definition: data.definition,
      },
    })
  }

  static async updateWorkflowStatus(id: string, status: WorkflowStatus) {
    return prisma.workflow.update({
      where: { id },
      data: { status },
    })
  }

  static async deleteWorkflow(id: string) {
    return prisma.workflow.delete({
      where: { id },
    })
  }
}