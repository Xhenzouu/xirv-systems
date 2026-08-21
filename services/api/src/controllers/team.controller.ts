import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireUser } from '../utils/require-user.js'
import { ok, created } from '../utils/response.js'
import { ApiError } from '../errors/ApiError.js'

export async function listTeams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    const organizationId = typeof id === 'string' ? id : id[0]

    // Check if user has access
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: user.id
      }
    })

    if (!member && user.role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Access denied')
    }

    const teams = await prisma.team.findMany({
      where: { organizationId },
      include: {
        members: {
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
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return ok(res, teams, 'Teams retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export async function createTeam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { name, description } = req.body

    const organizationId = typeof id === 'string' ? id : id[0]

    if (!name) {
      throw new ApiError(400, 'Team name is required')
    }

    // Check if user has permission
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

    const team = await prisma.team.create({
      data: {
        name,
        description,
        organizationId,
      },
      include: {
        members: {
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
        }
      }
    })

    return created(res, team, 'Team created successfully')
  } catch (error) {
    next(error)
  }
}

export async function deleteTeam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id, teamId } = req.params

    const organizationId = typeof id === 'string' ? id : id[0]
    const teamIdStr = typeof teamId === 'string' ? teamId : teamId[0]

    // Check if user has permission
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

    await prisma.team.delete({
      where: { id: teamIdStr }
    })

    return ok(res, null, 'Team deleted successfully')
  } catch (error) {
    next(error)
  }
}