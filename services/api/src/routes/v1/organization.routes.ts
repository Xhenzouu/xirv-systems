import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import {
  createOrganization,
  getOrganization,
  listOrganizations,
  updateOrganization,
  deleteOrganization,
  addMember,
  removeMember,
  updateMemberRole,
  listMembers,
} from '../../controllers/organization.controller.js'

const router = Router()

// All organization routes require authentication
router.use(authenticate)

// Organization CRUD
router.post('/', createOrganization)
router.get('/', listOrganizations)
router.get('/:id', getOrganization)
router.patch('/:id', updateOrganization)
router.delete('/:id', deleteOrganization)

// Member management
router.post('/:id/members', addMember)
router.get('/:id/members', listMembers)
router.delete('/:id/members/:memberId', removeMember)
router.patch('/:id/members/:memberId/role', updateMemberRole)

export default router