import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'
import { ok } from '../utils/response.js'
import { ApiError } from '../errors/ApiError.js'
import { logger } from '../lib/logger.js'

function getStringId(id: any): string {
  if (typeof id === 'string') return id
  if (Array.isArray(id) && id.length > 0) return id[0]
  throw new ApiError(400, 'Invalid ID parameter')
}

export async function getSystemStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const status = {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
    return ok(res, status, 'System status retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            documents: true,
            refreshTokens: true,
            auditLogs: true,
            createdWorkflows: true,
            assignedTasks: true,
            approvals: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return ok(res, { users, total: users.length }, 'Users retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = getStringId(req.params.id)
    const { role } = req.body

    const validRoles = ['USER', 'ADMIN', 'SUPER_ADMIN']
    if (!validRoles.includes(role)) {
      throw new ApiError(400, 'Invalid role. Must be USER, ADMIN, or SUPER_ADMIN')
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    const requestingUser = req.user as any
    if (!requestingUser) {
      throw new ApiError(401, 'Unauthorized')
    }

    if (user.id === requestingUser.id) {
      throw new ApiError(403, 'Cannot modify your own role')
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    })

    // 🔥 ADD AUDIT LOG DIRECTLY
    await prisma.auditLog.create({
      data: {
        userId: requestingUser.id,
        action: 'ROLE_CHANGE',
        details: {
          targetUserId: user.id,
          targetEmail: user.email,
          oldRole: user.role,
          newRole: role,
        },
        ip: req.ip,
        userAgent: req.headers['user-agent'] as string,
      }
    })

    logger.info(`User role updated: ${user.email} → ${role} by ${requestingUser.email}`)

    return ok(res, updated, 'User role updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function getAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0

    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.auditLog.count()

    return ok(res, { logs, total, limit, offset }, 'Audit logs retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export async function clearCache(req: Request, res: Response, next: NextFunction) {
  try {
    const { getRedisClient } = await import('../services/redis.service.js')
    const client = getRedisClient()
    if (client) {
      await client.flushall()
      logger.info('Redis cache cleared by SUPER_ADMIN')
      return ok(res, { cleared: true }, 'Cache cleared successfully')
    }
    return ok(res, { cleared: false }, 'Redis not available')
  } catch (error) {
    next(error)
  }
}