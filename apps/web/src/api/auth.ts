import api from './client'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isEmailVerified?: boolean
}

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data.data
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    return response.data.data
  },

  logout: async (refreshToken: string) => {
    await api.post('/auth/logout', { refreshToken })
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile')
    return response.data.data
  },

  // Email Verification
  verifyEmail: async (token: string): Promise<{ userId: string; email: string }> => {
    const response = await api.get(`/auth/verify?token=${token}`)
    return response.data.data
  },

  getVerificationStatus: async (): Promise<{ isVerified: boolean }> => {
    const response = await api.get('/auth/verification-status')
    return response.data.data
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/resend', { email })
    return response.data.data
  },
}