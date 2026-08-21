import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '../api/admin'
import type { Organization, OrganizationMember, Team } from '../types/organization'

export function useAdmin() {
  const [loading, setLoading] = useState(true)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [totalMembers, setTotalMembers] = useState(0)
  const [totalTeams, setTotalTeams] = useState(0)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

const loadData = useCallback(async () => {
  try {
    setLoading(true)
    setError(null)
    
    console.log('🔄 Loading admin data...')
    
    const org = await adminApi.getOrganization()
    console.log('📦 Organization loaded:', org)
    setOrganization(org)
    
    // Get members and teams (teams will return empty array if 404)
    const [membersData, teamsData] = await Promise.all([
      adminApi.getMembers(),
      adminApi.getTeams().catch(() => []), // Fallback to empty array
    ])
    
    console.log('👥 Members loaded:', membersData?.length || 0)
    console.log('🏷️ Teams loaded:', teamsData?.length || 0)
    
    setMembers(membersData || [])
    setTeams(teamsData || [])
    setTotalMembers(membersData?.length || 0)
    setTotalTeams(teamsData?.length || 0)
  } catch (error: any) {
    console.error('❌ Failed to load admin data:', error)
    setError(error.message || 'Failed to load admin data')
  } finally {
    setLoading(false)
  }
}, [])

  const addMember = useCallback(async (email: string, role: string) => {
    try {
      setUpdating(email)
      await adminApi.addMember(email, role)
      await loadData()
      return true
    } catch (error) {
      console.error('Failed to add member:', error)
      return false
    } finally {
      setUpdating(null)
    }
  }, [loadData])

  const updateMemberRole = useCallback(async (memberId: string, role: string) => {
    try {
      setUpdating(memberId)
      await adminApi.updateMemberRole(memberId, role)
      await loadData()
      return true
    } catch (error) {
      console.error('Failed to update member role:', error)
      return false
    } finally {
      setUpdating(null)
    }
  }, [loadData])

  const removeMember = useCallback(async (memberId: string) => {
    try {
      setUpdating(memberId)
      await adminApi.removeMember(memberId)
      await loadData()
      return true
    } catch (error) {
      console.error('Failed to remove member:', error)
      return false
    } finally {
      setUpdating(null)
    }
  }, [loadData])

  const createTeam = useCallback(async (name: string, description?: string) => {
    try {
      setUpdating('create-team')
      await adminApi.createTeam({ name, description })
      await loadData()
      return true
    } catch (error) {
      console.error('Failed to create team:', error)
      return false
    } finally {
      setUpdating(null)
    }
  }, [loadData])

  const deleteTeam = useCallback(async (teamId: string) => {
    try {
      setUpdating(teamId)
      await adminApi.deleteTeam(teamId)
      await loadData()
      return true
    } catch (error) {
      console.error('Failed to delete team:', error)
      return false
    } finally {
      setUpdating(null)
    }
  }, [loadData])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    loading,
    organization,
    members,
    teams,
    totalMembers,
    totalTeams,
    updating,
    error,
    loadData,
    addMember,
    updateMemberRole,
    removeMember,
    createTeam,
    deleteTeam,
  }
}