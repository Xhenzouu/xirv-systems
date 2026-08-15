import { useState, useEffect, useCallback } from 'react'
import { superAdminApi } from '../api/super-admin'
import type { User, AuditLog, SystemStatus } from '../types/super-admin'

export function useSuperAdmin() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalLogs, setTotalLogs] = useState(0)
  const [updating, setUpdating] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)

      const [statusRes, usersRes, logsRes] = await Promise.all([
        superAdminApi.getSystemStatus(),
        superAdminApi.getAllUsers(),
        superAdminApi.getAuditLogs(20, 0),
      ])

      setSystemStatus(statusRes)
      setUsers(usersRes.users)
      setTotalUsers(usersRes.total)
      setAuditLogs(logsRes.logs)
      setTotalLogs(logsRes.total)
    } catch (error) {
      console.error('Failed to load SUPER_ADMIN data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUserRole = useCallback(async (userId: string, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN') => {
    try {
      setUpdating(userId)
      await superAdminApi.updateUserRole(userId, role)
      await loadData()
    } catch (error) {
      console.error('Failed to update role:', error)
    } finally {
      setUpdating(null)
    }
  }, [loadData])

  const clearCache = useCallback(async () => {
    try {
      await superAdminApi.clearCache()
      return true
    } catch (error) {
      console.error('Failed to clear cache:', error)
      return false
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    loading,
    users,
    auditLogs,
    systemStatus,
    totalUsers,
    totalLogs,
    updating,
    loadData,
    updateUserRole,
    clearCache,
  }
}