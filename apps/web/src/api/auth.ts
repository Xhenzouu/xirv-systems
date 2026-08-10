import api from './client'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
}

export interface User {
  id: string
  fullName: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
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
}