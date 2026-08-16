import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireUser } from '../utils/require-user.js'
import { ok, created } from '../utils/response.js'
import { ApiError } from '../errors/ApiError.js'
import { OrganizationService } from '../services/organization.service.js'
import slugify from 'slugify'

export async function createOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)

    const { name, description, logo, website } = req.body

    if (!name) {
      throw new ApiError(400, 'Organization name is required')
    }

    const slug = slugify(name, { lower: true, strict: true })

    const organization = await OrganizationService.createOrganization(user.id, {
      name,
      slug,
      description,
      logo,
      website,
    })

    return created(res, organization, 'Organization created successfully')
  } catch (error) {
    next(error)
  }
}

export async function getOrganization(
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

    const organization = await OrganizationService.getOrganization(organizationId)

    return ok(res, organization, 'Organization retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export async function listOrganizations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)

    const organizations = await OrganizationService.listUserOrganizations(user.id)

    return ok(res, organizations, 'Organizations retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export async function updateOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    const organizationId = typeof id === 'string' ? id : id[0]
    const { name, description, logo, website } = req.body

    const organization = await OrganizationService.updateOrganization(
      organizationId,
      user.id,
      { name, description, logo, website }
    )

    return ok(res, organization, 'Organization updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function deleteOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id } = req.params

    const organizationId = typeof id === 'string' ? id : id[0]

    await OrganizationService.deleteOrganization(organizationId, user.id)

    return ok(res, null, 'Organization deleted successfully')
  } catch (error) {
    next(error)
  }
}

export async function addMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id } = req.params
    const { email, role } = req.body

    const organizationId = typeof id === 'string' ? id : id[0]

    const member = await OrganizationService.addMember(
      organizationId,
      user.id,
      email,
      role || 'MEMBER'
    )

    return created(res, member, 'Member added successfully')
  } catch (error) {
    next(error)
  }
}

export async function removeMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id, memberId } = req.params

    const organizationId = typeof id === 'string' ? id : id[0]
    const memberUserId = typeof memberId === 'string' ? memberId : memberId[0]

    await OrganizationService.removeMember(
      organizationId,
      user.id,
      memberUserId
    )

    return ok(res, null, 'Member removed successfully')
  } catch (error) {
    next(error)
  }
}

export async function updateMemberRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = requireUser(req)
    const { id, memberId } = req.params
    const { role } = req.body

    const organizationId = typeof id === 'string' ? id : id[0]
    const memberUserId = typeof memberId === 'string' ? memberId : memberId[0]

    if (!role) {
      throw new ApiError(400, 'Role is required')
    }

    const member = await OrganizationService.updateMemberRole(
      organizationId,
      user.id,
      memberUserId,
      role
    )

    return ok(res, member, 'Member role updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function listMembers(
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

    const members = await prisma.organizationMember.findMany({
      where: { organizationId },
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
      orderBy: { joinedAt: 'desc' }
    })

    return ok(res, members, 'Members retrieved successfully')
  } catch (error) {
    next(error)
  }
}