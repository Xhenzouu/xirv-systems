import { prisma } from '../lib/prisma.js'
import { ApiError } from '../errors/ApiError.js'
import type { OrganizationRole } from '@prisma/client'

export class OrganizationService {
  static async createOrganization(
    userId: string,
    data: {
      name: string
      slug: string
      description?: string
      logo?: string
      website?: string
    }
  ) {
    // Check if slug is unique
    const existing = await prisma.organization.findUnique({
      where: { slug: data.slug }
    })

    if (existing) {
      throw new ApiError(409, 'Organization with this slug already exists')
    }

    // Create organization with the user as OWNER
    return prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo: data.logo,
        website: data.website,
        members: {
          create: {
            userId,
            role: 'OWNER',
          }
        },
        settings: {
          create: {
            allowPublicSignup: false,
            requireEmailVerification: true,
            defaultRole: 'MEMBER',
          }
        }
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
        },
        settings: true,
      }
    })
  }

  static async getOrganization(id: string) {
    const organization = await prisma.organization.findUnique({
      where: { id },
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
        },
        teams: {
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
        },
        invitations: {
          where: { acceptedAt: null }
        },
        settings: true,
      }
    })

    if (!organization) {
      throw new ApiError(404, 'Organization not found')
    }

    return organization
  }

  static async listUserOrganizations(userId: string) {
    const memberships = await prisma.organizationMember.findMany({
      where: { userId },
      include: {
        organization: {
          include: {
            members: {
              take: 5,
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
            },
            _count: {
              select: {
                members: true,
                teams: true,
              }
            }
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    })

    return memberships.map(m => ({
      ...m.organization,
      role: m.role,
      joinedAt: m.joinedAt,
      memberCount: m.organization._count.members,
      teamCount: m.organization._count.teams,
    }))
  }

  static async updateOrganization(
    id: string,
    userId: string,
    data: {
      name?: string
      description?: string
      logo?: string
      website?: string
    }
  ) {
    // Check if user has access
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!member) {
      throw new ApiError(403, 'Access denied. Requires OWNER or ADMIN role.')
    }

    return prisma.organization.update({
      where: { id },
      data,
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
        },
        settings: true,
      }
    })
  }

  static async deleteOrganization(id: string, userId: string) {
    // Only OWNER or SUPER_ADMIN can delete
    const member = await prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId,
        role: 'OWNER'
      }
    })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!member && user?.role !== 'SUPER_ADMIN') {
      throw new ApiError(403, 'Access denied. Requires OWNER or SUPER_ADMIN.')
    }

    return prisma.organization.delete({
      where: { id }
    })
  }

  static async addMember(
    organizationId: string,
    userId: string,
    email: string,
    role: OrganizationRole
  ) {
    // Check if user exists
    const userToAdd = await prisma.user.findUnique({
      where: { email }
    })

    if (!userToAdd) {
      throw new ApiError(404, 'User not found')
    }

    // Check if already a member
    const existing = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: userToAdd.id
        }
      }
    })

    if (existing) {
      throw new ApiError(409, 'User is already a member of this organization')
    }

    // Check if current user has permission
    const currentUser = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!currentUser) {
      throw new ApiError(403, 'Access denied. Requires ADMIN or OWNER role.')
    }

    return prisma.organizationMember.create({
      data: {
        organizationId,
        userId: userToAdd.id,
        role,
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
  }

  static async removeMember(
    organizationId: string,
    userId: string,
    memberId: string
  ) {
    // Check if current user has permission
    const currentUser = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!currentUser) {
      throw new ApiError(403, 'Access denied. Requires ADMIN or OWNER role.')
    }

    // Prevent removing OWNER
    const memberToRemove = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: memberId
      }
    })

    if (memberToRemove?.role === 'OWNER') {
      throw new ApiError(403, 'Cannot remove the OWNER of the organization')
    }

    return prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId: memberId
        }
      }
    })
  }

  static async updateMemberRole(
    organizationId: string,
    userId: string,
    memberId: string,
    role: OrganizationRole
  ) {
    // Check if current user has permission
    const currentUser = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!currentUser) {
      throw new ApiError(403, 'Access denied. Requires ADMIN or OWNER role.')
    }

    const memberToUpdate = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        userId: memberId
      }
    })

    if (!memberToUpdate) {
      throw new ApiError(404, 'Member not found')
    }

    // Only OWNER can change OWNER role
    if (role === 'OWNER' && currentUser.role !== 'OWNER') {
      throw new ApiError(403, 'Only the OWNER can assign OWNER role')
    }

    // Prevent changing OWNER role
    if (memberToUpdate.role === 'OWNER' && currentUser.role !== 'OWNER') {
      throw new ApiError(403, 'Cannot modify the OWNER role')
    }

    return prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId: memberId
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
  }
}