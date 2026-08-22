import api from './client'

export interface Invitation {
  id: string
  email: string
  role: string
  token: string
  expiresAt: string
  createdAt: string
  organizationId: string
  inviterId: string
  inviter?: {
    firstName: string
    lastName: string
    email: string
  }
  organization?: {
    id: string
    name: string
    slug: string
  }
}

export interface CreateInvitationRequest {
  email: string
  role?: 'ADMIN' | 'MEMBER' | 'VIEWER'
}

export const invitationsApi = {
  createInvitation: async (data: CreateInvitationRequest) => {
    const response = await api.post('/invitations', data)
    return response.data
  },

  getPendingInvitations: async () => {
    const response = await api.get('/invitations/pending')
    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || 'Failed to load invitations')
    }
    if (response.data && response.data.data) {
      return response.data
    }
    return response.data
  },

  getInvitationByToken: async (token: string) => {
    const response = await api.get(`/invitations/token/${token}`)
    return response.data
  },

  acceptInvitation: async (token: string) => {
    const response = await api.post(`/invitations/${token}/accept`)
    return response.data
  },

  rejectInvitation: async (token: string) => {
    const response = await api.post(`/invitations/${token}/reject`)
    return response.data
  },

  cancelInvitation: async (invitationId: string) => {
    const response = await api.delete(`/invitations/${invitationId}`)
    return response.data
  },

  resendInvitation: async (invitationId: string) => {
    const response = await api.post(`/invitations/${invitationId}/resend`)
    return response.data
  }
}