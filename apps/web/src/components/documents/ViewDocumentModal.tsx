import { useState, useEffect } from 'react'
import { documentApi, type Document } from '../../api'
import './Modal.css'

interface ViewDocumentModalProps {
  isOpen: boolean
  documentId: string | null
  onClose: () => void
}

export default function ViewDocumentModal({
  isOpen,
  documentId,
  onClose,
}: ViewDocumentModalProps) {
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && documentId) {
      fetchDocument()
    }
  }, [isOpen, documentId])

  const fetchDocument = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await documentApi.get(documentId!)
      setDocument(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch document')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'status-badge status-badge-published'
      case 'ARCHIVED': return 'status-badge status-badge-archived'
      default: return 'status-badge status-badge-draft'
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-container-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Document Details</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          {isLoading ? (
            <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
          ) : document ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</label>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', margin: 'var(--space-xs) 0 0 0' }}>
                  {document.title}
                </p>
              </div>

              {/* Description */}
              {document.description && (
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                  <p style={{ color: 'var(--text-primary)', margin: 'var(--space-xs) 0 0 0' }}>
                    {document.description}
                  </p>
                </div>
              )}

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</label>
                  <div style={{ marginTop: 'var(--space-xs)' }}>
                    <span className={getStatusBadgeClass(document.status)}>
                      {document.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>File Name</label>
                  <p style={{ color: 'var(--text-primary)', margin: 'var(--space-xs) 0 0 0' }}>
                    {document.fileName}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>File Size</label>
                  <p style={{ color: 'var(--text-primary)', margin: 'var(--space-xs) 0 0 0' }}>
                    {(document.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Created</label>
                  <p style={{ color: 'var(--text-primary)', margin: 'var(--space-xs) 0 0 0' }}>
                    {new Date(document.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Category */}
              {document.category && (
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
                  <p style={{ color: 'var(--text-primary)', margin: 'var(--space-xs) 0 0 0' }}>
                    {document.category.name}
                  </p>
                </div>
              )}

              {/* Tags */}
              {document.tags.length > 0 && (
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Tags</label>
                  <div className="tag-list" style={{ marginTop: 'var(--space-xs)' }}>
                    {document.tags.map((tag) => (
                      <span key={tag.id} className="tag-item">{tag.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>Document not found</div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}