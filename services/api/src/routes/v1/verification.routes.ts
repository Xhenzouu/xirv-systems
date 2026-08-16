import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import {
  verifyEmail,
  resendVerification,
  checkVerificationStatus,
} from '../../controllers/verification.controller.js'

const router = Router()

// Public routes
router.get('/verify', verifyEmail)           // GET /api/v1/auth/verify?token=xxx
router.post('/resend', resendVerification)   // POST /api/v1/auth/resend

// Protected routes
router.get('/verification-status', authenticate, checkVerificationStatus)  // GET /api/v1/auth/verification-status

export default router