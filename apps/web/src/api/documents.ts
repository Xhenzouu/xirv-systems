import api from './client'

export interface Document {
  id: string
  title: string
  description?: string
  fileName: string
  fileSize: number
  mimeType: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
  category?: { id: string; name: string }
  tags: { id: string; name: string }[]
  userId: string
}

export const documentApi = {
  upload: async (file: File, title: string, description?: string, categoryId?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    if (description) formData.append('description', description)
    if (categoryId) formData.append('categoryId', categoryId)

    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  list: async (params?: { status?: string; categoryId?: string; search?: string }) => {
    const response = await api.get('/documents', { params })
    return response.data.data
  },

  get: async (id: string): Promise<Document> => {
    const response = await api.get(`/documents/${id}`)
    return response.data.data
  },

  update: async (id: string, data: { title?: string; description?: string; categoryId?: string }) => {
    const response = await api.patch(`/documents/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    await api.delete(`/documents/${id}`)
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/documents/${id}/status`, { status })
    return response.data.data
  },
}