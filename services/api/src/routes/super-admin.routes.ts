import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { requireSuperAdmin } from '../middleware/requireSuperAdmin.js'
import {
  getSystemStatus,
  getAllUsers,
  updateUserRole,
  getAuditLogs,
  clearCache
} from '../controllers/super-admin.controller.js'

const router = Router()

// All routes require authentication and SUPER_ADMIN role
router.use(authenticate)
router.use(requireSuperAdmin)

// System
router.get('/system/status', getSystemStatus)

// Users
router.get('/users', getAllUsers)
router.patch('/users/:id/role', updateUserRole)

// Audit Logs
router.get('/audit-logs', getAuditLogs)

// Cache
router.post('/cache/clear', clearCache)

export default router