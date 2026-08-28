import api from './client'
import type { Organization, OrganizationMember, Team } from '../types/organization'

export const adminApi = {
  
  getOrganizations: async (): Promise<Organization[]> => {
    const response = await api.get('/organizations')
    return response.data.data
  },

  getOrganization: async (): Promise<Organization> => {
    const orgs = await adminApi.getOrganizations()
    if (orgs && orgs.length > 0) {
      const response = await api.get(`/organizations/${orgs[0].id}`)
      return response.data.data
    }
    throw new Error('No organization found')
  },

  updateOrganization: async (data: { name?: string; description?: string }): Promise<Organization> => {
    const org = await adminApi.getOrganization()
    const response = await api.patch(`/organizations/${org.id}`, data)
    return response.data.data
  },

  getMembers: async (): Promise<OrganizationMember[]> => {
    const org = await adminApi.getOrganization()
    const response = await api.get(`/organizations/${org.id}/members`)
    return response.data.data
  },

  addMember: async (email: string, role: string): Promise<OrganizationMember> => {
    const org = await adminApi.getOrganization()
    const response = await api.post(`/organizations/${org.id}/members`, { email, role })
    return response.data.data
  },

  updateMemberRole: async (memberId: string, role: string): Promise<OrganizationMember> => {
    const org = await adminApi.getOrganization()
    const response = await api.patch(`/organizations/${org.id}/members/${memberId}/role`, { role })
    return response.data.data
  },

  removeMember: async (memberId: string): Promise<void> => {
    const org = await adminApi.getOrganization()
    await api.delete(`/organizations/${org.id}/members/${memberId}`)
  },

  getTeams: async (): Promise<Team[]> => {
    try {
      const org = await adminApi.getOrganization()
      const response = await api.get(`/organizations/${org.id}/teams`)
      return response.data.data || []
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  createTeam: async (data: { name: string; description?: string }): Promise<Team> => {
    const org = await adminApi.getOrganization()
    const response = await api.post(`/organizations/${org.id}/teams`, data)
    return response.data.data
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    const org = await adminApi.getOrganization()
    await api.delete(`/organizations/${org.id}/teams/${teamId}`)
  },

  // Team Member Management
  getTeamMembers: async (teamId: string) => {
    const org = await adminApi.getOrganization()  // Fixed: use adminApi.getOrganization()
    const response = await api.get(`/organizations/${org.id}/teams/${teamId}/members`)
    return response.data.data
  },

  addTeamMember: async (teamId: string, userId: string, role: string = 'MEMBER') => {
    const org = await adminApi.getOrganization()  // Fixed: use adminApi.getOrganization()
    const response = await api.post(`/organizations/${org.id}/teams/${teamId}/members`, { userId, role })
    return response.data.data
  },

  removeTeamMember: async (teamId: string, memberId: string) => {
    const org = await adminApi.getOrganization()  // Fixed: use adminApi.getOrganization()
    await api.delete(`/organizations/${org.id}/teams/${teamId}/members/${memberId}`)
  },

  updateTeamMemberRole: async (teamId: string, memberId: string, role: string) => {
    const org = await adminApi.getOrganization()  // Fixed: use adminApi.getOrganization()
    const response = await api.patch(`/organizations/${org.id}/teams/${teamId}/members/${memberId}/role`, { role })
    return response.data.data
  },
}