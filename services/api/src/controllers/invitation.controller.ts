import { Request, Response } from 'express';
import { invitationService } from '../services/invitation.service.js';
import { prisma } from '../lib/prisma.js';
import { requireUser } from '../utils/require-user.js';
import { ok, created } from '../utils/response.js';
import { ApiError } from '../errors/ApiError.js';

export class InvitationController {
  async createInvitation(req: Request, res: Response) {
    try {
      const user = requireUser(req);
      const { email, role } = req.body;

      if (!email) {
        throw new ApiError(400, 'Email is required');
      }

      const member = await prisma.organizationMember.findFirst({
        where: { userId: user.id },
        select: { organizationId: true }
      });

      if (!member) {
        throw new ApiError(400, 'User is not associated with an organization');
      }

      const invitation = await invitationService.createInvitation(
        email,
        member.organizationId,
        user.id,
        role || 'MEMBER'
      );

      return created(res, invitation, `Invitation sent to ${email}`);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create invitation'
      });
    }
  }

  async getPendingInvitations(req: Request, res: Response) {
    try {
      const user = requireUser(req);

      const member = await prisma.organizationMember.findFirst({
        where: { userId: user.id },
        select: { organizationId: true }
      });

      if (!member) {
        throw new ApiError(400, 'User is not associated with an organization');
      }

      const invitations = await invitationService.getPendingInvitations(member.organizationId);

      return ok(res, invitations, 'Pending invitations retrieved successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get pending invitations'
      });
    }
  }

  async getInvitationByToken(req: Request, res: Response) {
    try {
      const { token } = req.params;

      if (!token || typeof token !== 'string') {
        throw new ApiError(400, 'Token is required');
      }

      const invitation = await invitationService.getInvitationByToken(token);

      if (!invitation) {
        throw new ApiError(404, 'Invitation not found');
      }

      return ok(res, {
        email: invitation.email,
        organizationName: invitation.organization.name,
        inviterName: `${invitation.inviter.firstName} ${invitation.inviter.lastName}`,
        role: invitation.role,
        expiresAt: invitation.expiresAt
      }, 'Invitation retrieved successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get invitation'
      });
    }
  }

  async acceptInvitation(req: Request, res: Response) {
    try {
      const user = requireUser(req);
      const { token } = req.params;

      if (!token || typeof token !== 'string') {
        throw new ApiError(400, 'Token is required');
      }

      const result = await invitationService.acceptInvitation(token, user.id);

      const message = result.alreadyMember 
        ? 'You are already a member of this organization' 
        : 'Invitation accepted successfully';

      return ok(res, result, message);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to accept invitation'
      });
    }
  }

  async rejectInvitation(req: Request, res: Response) {
    try {
      const { token } = req.params;

      if (!token || typeof token !== 'string') {
        throw new ApiError(400, 'Token is required');
      }

      await invitationService.rejectInvitation(token);

      return ok(res, null, 'Invitation rejected successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reject invitation'
      });
    }
  }

  async cancelInvitation(req: Request, res: Response) {
    try {
      const user = requireUser(req);
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        throw new ApiError(400, 'Invitation ID is required');
      }

      const member = await prisma.organizationMember.findFirst({
        where: { userId: user.id },
        select: { organizationId: true }
      });

      if (!member) {
        throw new ApiError(400, 'User is not associated with an organization');
      }

      await invitationService.cancelInvitation(id, member.organizationId);

      return ok(res, null, 'Invitation cancelled successfully');
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel invitation'
      });
    }
  }

async resendInvitation(req: Request, res: Response) {
  try {
    const user = requireUser(req);
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invitation ID is required');
    }

    const member = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
      select: { organizationId: true }
    });

    if (!member) {
      throw new ApiError(400, 'User is not associated with an organization');
    }

    const invitation = await invitationService.resendInvitation(id);

    console.log(`✅ Invitation resent for: ${invitation.email}`);
    console.log(`🔗 New verification link: http://localhost:5173/verify-email?token=${invitation.token}`);

    return ok(res, invitation, 'Invitation resent successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to resend invitation'
    });
  }
}
}

export const invitationController = new InvitationController();