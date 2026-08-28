import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireUser } from '../utils/require-user.js'
import { ok, created } from '../utils/response.js'
import { ApiError } from '../errors/ApiError.js'

export async function addTeamMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id, teamId } = req.params
    const { userId, role } = req.body

    const organizationId = typeof id === 'string' ? id : id[0]
    const teamIdStr = typeof teamId === 'string' ? teamId : teamId[0]

    if (!userId) {
      throw new ApiError(400, 'User ID is required')
    }

    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: user.id,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!member) {
      throw new ApiError(403, 'Access denied. Requires ADMIN or OWNER role.')
    }

    const team = await prisma.team.findFirst({
      where: {
        id: teamIdStr,
        organizationId
      }
    })

    if (!team) {
      throw new ApiError(404, 'Team not found')
    }

    const userToAdd = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: userId
      }
    })

    if (!userToAdd) {
      throw new ApiError(404, 'User is not a member of this organization')
    }

    const existing = await prisma.teamMember.findFirst({
      where: {
        teamId: teamIdStr,
        userId: userId
      }
    })

    if (existing) {
      throw new ApiError(409, 'User is already a member of this team')
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: teamIdStr,
        userId: userId,
        role: role || 'MEMBER'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return created(res, teamMember, 'Team member added successfully')
  } catch (error) {
    next(error)
  }
}

export async function removeTeamMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id, teamId, memberId } = req.params

    const organizationId = typeof id === 'string' ? id : id[0]
    const teamIdStr = typeof teamId === 'string' ? teamId : teamId[0]
    const memberIdStr = typeof memberId === 'string' ? memberId : memberId[0]

    const admin = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: user.id,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!admin) {
      throw new ApiError(403, 'Access denied. Requires ADMIN or OWNER role.')
    }

    const team = await prisma.team.findFirst({
      where: {
        id: teamIdStr,
        organizationId
      }
    })

    if (!team) {
      throw new ApiError(404, 'Team not found')
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamIdStr,
        userId: memberIdStr
      }
    })

    if (!teamMember) {
      throw new ApiError(404, 'Team member not found')
    }

    const count = await prisma.teamMember.count({
      where: { teamId: teamIdStr }
    })

    if (count <= 1) {
      throw new ApiError(400, 'Cannot remove the last member of a team')
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: teamIdStr,
          userId: memberIdStr
        }
      }
    })

    return ok(res, null, 'Team member removed successfully')
  } catch (error) {
    next(error)
  }
}

export async function updateTeamMemberRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id, teamId, memberId } = req.params
    const { role } = req.body

    const organizationId = typeof id === 'string' ? id : id[0]
    const teamIdStr = typeof teamId === 'string' ? teamId : teamId[0]
    const memberIdStr = typeof memberId === 'string' ? memberId : memberId[0]

    if (!role) {
      throw new ApiError(400, 'Role is required')
    }

    if (!['LEADER', 'MEMBER'].includes(role)) {
      throw new ApiError(400, 'Invalid role. Must be LEADER or MEMBER')
    }

    const admin = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: user.id,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!admin) {
      throw new ApiError(403, 'Access denied. Requires ADMIN or OWNER role.')
    }

    const team = await prisma.team.findFirst({
      where: {
        id: teamIdStr,
        organizationId
      }
    })

    if (!team) {
      throw new ApiError(404, 'Team not found')
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamIdStr,
        userId: memberIdStr
      }
    })

    if (!teamMember) {
      throw new ApiError(404, 'Team member not found')
    }

    const updated = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId: teamIdStr,
          userId: memberIdStr
        }
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return ok(res, updated, 'Team member role updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function listTeamMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id, teamId } = req.params

    const organizationId = typeof id === 'string' ? id : id[0]
    const teamIdStr = typeof teamId === 'string' ? teamId : teamId[0]

    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: user.id
      }
    })

    if (!member && user.role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Access denied')
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        teamId: teamIdStr,
        team: {
          organizationId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: [
        { role: 'desc' },
        { joinedAt: 'asc' }
      ]
    })

    return ok(res, teamMembers, 'Team members retrieved successfully')
  } catch (error) {
    next(error)
  }
}