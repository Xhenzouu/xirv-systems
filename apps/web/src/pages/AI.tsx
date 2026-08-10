import { useState, useEffect, useRef } from 'react'
import { documentApi, ragApi, type Document } from '../api'
import toast from 'react-hot-toast'
import './AI.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: { documentId: string; title: string; content: string; similarity: number }[]
}

function AI() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. Ask me anything about your documents.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingRAG, setIsProcessingRAG] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load documents
  useEffect(() => {
    fetchDocuments()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchDocuments = async () => {
    try {
      const result = await documentApi.list()
      setDocuments(result.documents || [])
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      toast.error('Failed to load documents')
    }
  }

  const processDocumentForRAG = async (documentId: string) => {
    const toastId = toast.loading('Processing document for RAG...')
    setIsProcessingRAG(true)
    try {
      await ragApi.process(documentId)
      toast.success('Document processed for RAG successfully!', { id: toastId })
    } catch (error) {
      console.error('Failed to process document:', error)
      toast.error('Failed to process document. Please try again.', { id: toastId })
    } finally {
      setIsProcessingRAG(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const toastId = toast.loading('Getting AI response...')

    try {
      // Get AI response with RAG
      const response = await ragApi.query(
        userMessage.content,
        selectedDocumentId || undefined
      )

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      }
      setMessages(prev => [...prev, assistantMessage])
      toast.success('Response received!', { id: toastId })
    } catch (error) {
      console.error('Failed to get AI response:', error)
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to get AI response', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="ai-page">
      <div className="ai-header">
        <div>
          <h1>AI Intelligence</h1>
          <p>Ask questions about your documents using AI.</p>
        </div>
        <div className="ai-actions">
          <select
            value={selectedDocumentId}
            onChange={(e) => setSelectedDocumentId(e.target.value)}
            className="ai-document-select"
          >
            <option value="">All Documents</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>
          {selectedDocumentId && (
            <button
              onClick={() => processDocumentForRAG(selectedDocumentId)}
              disabled={isProcessingRAG}
              className="ai-process-btn"
            >
              {isProcessingRAG ? 'Processing...' : 'Process for RAG'}
            </button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="ai-chat-container">
        <div className="ai-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ai-message ${message.role === 'user' ? 'ai-message-user' : 'ai-message-assistant'}`}
            >
              <div className="ai-message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="ai-message-content">
                <div className="ai-message-text">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className="ai-sources">
                    <details>
                      <summary>📚 Sources ({message.sources.length})</summary>
                      {message.sources.map((source, index) => (
                        <div key={index} className="ai-source-item">
                          <div className="ai-source-title">{source.title}</div>
                          <div className="ai-source-content">{source.content}</div>
                          <div className="ai-source-similarity">
                            Relevance: {(source.similarity * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message ai-message-assistant">
              <div className="ai-message-avatar">🤖</div>
              <div className="ai-message-content">
                <div className="ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="ai-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedDocumentId ? 'Ask about this document...' : 'Ask a question...'}
            className="ai-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ai-send-btn"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AI