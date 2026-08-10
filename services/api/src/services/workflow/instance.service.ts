import { prisma } from "../../lib/prisma.js"
import { ApiError } from "../../errors/ApiError.js"
import type { WorkflowStatus } from "@prisma/client"
import { WorkflowService } from "./workflow.service.js"

export class InstanceService {
  static async executeWorkflow(workflowId: string, userId: string, context?: any) {
    const workflow = await WorkflowService.getWorkflow(workflowId)

    if (workflow.status !== "ACTIVE") {
      throw new ApiError(400, "Workflow is not active")
    }

    return prisma.workflowInstance.create({
      data: {
        workflowId,
        createdBy: userId,
        context: context || {},
      },
    })
  }

  static async getInstance(id: string) {
    const instance = await prisma.workflowInstance.findUnique({
      where: { id },
      include: {
        workflow: true,
        tasks: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!instance) {
      throw new ApiError(404, "Workflow instance not found")
    }

    return instance
  }

  static async listInstances(
    workflowId?: string,
    options?: {
      status?: WorkflowStatus
      limit?: number
      offset?: number
    },
  ) {
    const { status, limit = 20, offset = 0 } = options || {}

    const where: any = {
      ...(workflowId && { workflowId }),
      ...(status && { status }),
    }

    const [instances, total] = await Promise.all([
      prisma.workflowInstance.findMany({
        where,
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { startedAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.workflowInstance.count({ where }),
    ])

    return { instances, total, limit, offset }
  }
}