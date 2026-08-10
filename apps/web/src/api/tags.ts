import api from './client'

export interface Tag {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export const tagApi = {
  list: async (): Promise<Tag[]> => {
    const response = await api.get('/tags')
    return response.data.data
  },

  create: async (data: { name: string }): Promise<Tag> => {
    const response = await api.post('/tags', data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`)
  },
}