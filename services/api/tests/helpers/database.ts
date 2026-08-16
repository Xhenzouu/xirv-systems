import { prisma } from "../../src/lib/prisma.js"

export async function clearDatabase() {
  // Delete in correct order to avoid foreign key constraints
  await prisma.$transaction([
    prisma.approval.deleteMany(),
    prisma.task.deleteMany(),
    prisma.workflowInstance.deleteMany(),
    prisma.workflow.deleteMany(),
    prisma.documentChunk.deleteMany(),
    prisma.documentVersion.deleteMany(),
    prisma.document.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.category.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.organizationInvitation.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.team.deleteMany(),
    prisma.organizationMember.deleteMany(),
    prisma.organizationSettings.deleteMany(),
    prisma.organization.deleteMany(),
    prisma.user.deleteMany(),
  ])
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
}