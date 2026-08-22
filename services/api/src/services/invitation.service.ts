import { PrismaClient, OrganizationRole } from '@prisma/client';
import crypto from 'crypto';
import { addHours } from 'date-fns';

const prisma = new PrismaClient();

export class InvitationService {
async createInvitation(
  email: string,
  organizationId: string,
  inviterId: string,
  role: OrganizationRole = 'MEMBER'
) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        userId: existingUser.id,
        organizationId
      }
    });

    if (existingMember) {
      throw new Error('User is already a member of this organization');
    }
  }

  const existingInvitation = await prisma.organizationInvitation.findFirst({
    where: {
      email,
      organizationId,
      expiresAt: {
        gt: new Date()
      },
      acceptedAt: {
        equals: null
      }
    }
  });

  if (existingInvitation) {
    throw new Error('An invitation has already been sent to this email');
  }

  const token = crypto.randomBytes(32).toString('hex');

  const invitation = await prisma.organizationInvitation.create({
    data: {
      email,
      role,
      token,
      expiresAt: addHours(new Date(), 72),
      organizationId,
      inviterId
    },
    include: {
      organization: true,
      inviter: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  // ADD THESE LOGS:
  console.log(`🔐 Verification link for ${email}: http://localhost:5173/verify-email?token=${token}`);
  console.log(`📧 Invitation sent to ${email} with token: ${token}`);

  return invitation;
}

async getPendingInvitations(organizationId: string) {
  return prisma.organizationInvitation.findMany({
    where: {
      organizationId,
      expiresAt: {
        gt: new Date()
      },
      acceptedAt: {
        equals: null  // Only get invitations that haven't been accepted
      }
    },
    include: {
      inviter: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

  async getInvitationByToken(token: string) {
    return prisma.organizationInvitation.findUnique({
      where: { token },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        inviter: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }

async acceptInvitation(token: string, userId: string) {
  const invitation = await prisma.organizationInvitation.findUnique({
    where: { token }
  });

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error('Invitation has expired');
  }

  // Check if user already belongs to organization
  const existingMember = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId: invitation.organizationId
    }
  });

  // Start transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update invitation - mark as accepted (delete it or mark as accepted)
    const updatedInvitation = await tx.organizationInvitation.update({
      where: { id: invitation.id },
      data: {
        acceptedAt: new Date(),
        expiresAt: new Date() // Expire it so it won't show in pending
      }
    });

    if (existingMember) {
      return { invitation: updatedInvitation, member: existingMember, alreadyMember: true };
    }

    // Add user to organization
    const member = await tx.organizationMember.create({
      data: {
        userId,
        organizationId: invitation.organizationId,
        role: invitation.role
      }
    });

    // Also update the user's organizationId if not set
    await tx.user.update({
      where: { id: userId },
      data: {
        organizationId: invitation.organizationId
      }
    });

    return { invitation: updatedInvitation, member, alreadyMember: false };
  });

  return result;
}

  async rejectInvitation(token: string) {
    const invitation = await prisma.organizationInvitation.findUnique({
      where: { token }
    });

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    return prisma.organizationInvitation.update({
      where: { id: invitation.id },
      data: {
        expiresAt: new Date()
      }
    });
  }

  async cancelInvitation(invitationId: string, organizationId: string) {
    const invitation = await prisma.organizationInvitation.findFirst({
      where: {
        id: invitationId,
        organizationId
      }
    });

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    return prisma.organizationInvitation.delete({
      where: { id: invitationId }
    });
  }

async resendInvitation(invitationId: string) {
  const invitation = await prisma.organizationInvitation.findUnique({
    where: { id: invitationId },
    include: {
      organization: true,
      inviter: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  if (invitation.acceptedAt) {
    throw new Error('Invitation has already been accepted');
  }

  const newToken = crypto.randomBytes(32).toString('hex');
  const newExpiresAt = addHours(new Date(), 72);

  const updatedInvitation = await prisma.organizationInvitation.update({
    where: { id: invitationId },
    data: {
      token: newToken,
      expiresAt: newExpiresAt
    },
    include: {
      organization: true,
      inviter: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  // Log the verification link (like the original invitation)
  console.log(`🔐 Verification link for ${invitation.email}: http://localhost:5173/verify-email?token=${newToken}`);
  console.log(`📧 Invitation resent to ${invitation.email} with new token: ${newToken}`);

  return updatedInvitation;
}
}

export const invitationService = new InvitationService();