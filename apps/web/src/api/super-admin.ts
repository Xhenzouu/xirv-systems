import api from './client'
import type { User, AuditLog, SystemStatus } from '../types/super-admin'

export const superAdminApi = {
  // System Status
  getSystemStatus: (): Promise<SystemStatus> => {
    return api.get('/admin/super/system/status').then(res => res.data.data)
  },

  // Users
  getAllUsers: (): Promise<{ users: User[]; total: number }> => {
    return api.get('/admin/super/users').then(res => res.data.data)
  },

  updateUserRole: (userId: string, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'): Promise<User> => {
    return api.patch(`/admin/super/users/${userId}/role`, { role }).then(res => res.data.data)
  },

  // Audit Logs
  getAuditLogs: (limit?: number, offset?: number): Promise<{ logs: AuditLog[]; total: number }> => {
    return api.get('/admin/super/audit-logs', { params: { limit, offset } }).then(res => res.data.data)
  },

  // Cache
  clearCache: (): Promise<{ cleared: boolean }> => {
    return api.post('/admin/super/cache/clear').then(res => res.data.data)
  },
}