import api from './client'

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export const categoryApi = {
  list: async (): Promise<Category[]> => {
    const response = await api.get('/categories')
    return response.data.data
  },

  create: async (data: { name: string; description?: string }): Promise<Category> => {
    const response = await api.post('/categories', data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`)
  },
}