import { Router } from 'express';
import { invitationController } from '../../controllers/invitation.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Public routes - no auth required
router.get('/token/:token', invitationController.getInvitationByToken.bind(invitationController));
router.post('/:token/reject', invitationController.rejectInvitation.bind(invitationController));

// All routes below require authentication
router.use(authenticate);

// Create invitation
router.post('/', invitationController.createInvitation.bind(invitationController));

// Get pending invitations
router.get('/pending', invitationController.getPendingInvitations.bind(invitationController));

// Accept invitation
router.post('/:token/accept', invitationController.acceptInvitation.bind(invitationController));

// Resend invitation
router.post('/:id/resend', invitationController.resendInvitation.bind(invitationController));

// Cancel invitation
router.delete('/:id', invitationController.cancelInvitation.bind(invitationController));

export default router;