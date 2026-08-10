import api from './client'

export const ragApi = {
  query: async (question: string, documentId?: string) => {
    const response = await api.post('/rag/query', { question, documentId })
    return response.data.data
  },

  process: async (documentId: string) => {
    const response = await api.post(`/rag/process/${documentId}`)
    return response.data.data
  },

  queryStream: async (question: string, documentId?: string, onChunk?: (chunk: string) => void) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/rag/query/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ question, documentId }),
      }
    )

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader?.read() || { done: true, value: undefined }
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

      for (const line of lines) {
        const data = line.replace('data: ', '')
        if (data === '[DONE]') return
        try {
          const parsed = JSON.parse(data)
          if (parsed.content && onChunk) {
            onChunk(parsed.content)
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  },
}