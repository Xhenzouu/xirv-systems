import { prisma } from "../../lib/prisma.js"
import { ApiError } from "../../errors/ApiError.js"
import type { ApprovalStatus } from "@prisma/client"

export class ApprovalService {
  static async createApproval(taskId: string, approverId: string, comment?: string) {
    // Check if approval already exists
    const existing = await prisma.approval.findFirst({
      where: {
        taskId,
        approverId,
        status: "PENDING",
      },
    })

    if (existing) {
      throw new ApiError(409, "Approval already pending for this user")
    }

    return prisma.approval.create({
      data: {
        taskId,
        approverId,
        comment,
      },
    })
  }

  static async updateApproval(id: string, status: ApprovalStatus, comment?: string) {
    const approval = await prisma.approval.findUnique({
      where: { id },
    })

    if (!approval) {
      throw new ApiError(404, "Approval not found")
    }

    if (approval.status !== "PENDING") {
      throw new ApiError(400, "Approval has already been processed")
    }

    return prisma.approval.update({
      where: { id },
      data: {
        status,
        comment,
        respondedAt: new Date(),
      },
    })
  }

  static async listApprovals(taskId: string) {
    return prisma.approval.findMany({
      where: { taskId },
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
      orderBy: { requestedAt: "asc" },
    })
  }

  static async listApprovalsByUser(userId: string) {
    return prisma.approval.findMany({
      where: {
        approverId: userId,
        status: "PENDING",
      },
      include: {
        task: {
          include: {
            instance: {
              include: {
                workflow: true,
              },
            },
          },
        },
      },
      orderBy: { requestedAt: "asc" },
    })
  }
}