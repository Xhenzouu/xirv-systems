import { useState, useEffect, useCallback } from 'react'
import { superAdminApi } from '../api/super-admin'
import type { User, AuditLog, SystemStatus, Organization } from '../types/super-admin'

export function useSuperAdmin() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalLogs, setTotalLogs] = useState(0)
  const [totalOrgs, setTotalOrgs] = useState(0)
  const [updating, setUpdating] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)

      const [statusRes, usersRes, logsRes, orgsRes] = await Promise.all([
        superAdminApi.getSystemStatus(),
        superAdminApi.getAllUsers(),
        superAdminApi.getAuditLogs(20, 0),
        superAdminApi.getAllOrganizations(),
      ])

      setSystemStatus(statusRes)
      setUsers(usersRes.users)
      setTotalUsers(usersRes.total)
      setAuditLogs(logsRes.logs)
      setTotalLogs(logsRes.total)
      setOrganizations(orgsRes)
      setTotalOrgs(orgsRes.length)
    } catch (error) {
      console.error('Failed to load SUPER_ADMIN data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // CRUD Operations for Organizations (return void to match modal expectations)
  const createOrganization = useCallback(async (data: { name: string; description?: string }) => {
    try {
      setUpdating('create')
      await superAdminApi.createOrganization(data)
      await loadData()
    } catch (error) {
      console.error('Failed to create organization:', error)
      throw error
    } finally {
      setUpdating(null)
    }
  }, [loadData])

  const updateOrganization = useCallback(async (id: string, data: { name?: string; description?: string }) => {
    try {
      setUpdating(id)
      await superAdminApi.updateOrganization(id, data)
      await loadData()
    } catch (error) {
      console.error('Failed to update organization:', error)
      throw error
    } finally {
      setUpdating(null)
    }
  }, [loadData])

  const deleteOrganization = useCallback(async (id: string) => {
    try {
      setUpdating(id)
      await superAdminApi.deleteOrganization(id)
      await loadData()
    } catch (error) {
      console.error('Failed to delete organization:', error)
      throw error
    } finally {
      setUpdating(null)
    }
  }, [loadData])

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
    organizations,
    totalUsers,
    totalLogs,
    totalOrgs,
    updating,
    loadData,
    updateUserRole,
    clearCache,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  }
}