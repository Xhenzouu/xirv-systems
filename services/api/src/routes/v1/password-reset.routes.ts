import { Router } from 'express'
import { PasswordResetController } from '../../controllers/password-reset.controller.js'

const router = Router()

router.post('/forgot-password', PasswordResetController.forgotPassword)
router.get('/validate/:token', PasswordResetController.validateToken)
router.post('/reset-password/:token', PasswordResetController.resetPassword)

export default router