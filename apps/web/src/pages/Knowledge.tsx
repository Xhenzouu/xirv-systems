import { useState, useEffect } from 'react'
import { documentApi, categoryApi, tagApi, type Document, type Category, type Tag } from '../api'
import UploadDocumentModal from '../components/documents/UploadDocumentModal'
import ViewDocumentModal from '../components/documents/ViewDocumentModal'
import { useToast } from '../hooks/useToast'
import './Knowledge.css'

function Knowledge() {
  const toast = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [search, statusFilter])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [docs, cats, tagList] = await Promise.all([
        documentApi.list({ search: search || undefined, status: statusFilter || undefined }),
        categoryApi.list(),
        tagApi.list(),
      ])
      setDocuments(docs.documents || [])
      setCategories(cats || [])
      setTags(tagList || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    
    const toastId = toast.loading('Deleting document...')
    try {
      await documentApi.delete(id)
      toast.success('Document deleted successfully!')
      await fetchData()
    } catch (error) {
      console.error('Failed to delete document:', error)
      toast.error('Failed to delete document')
    } finally {
      toast.dismiss(toastId)
    }
  }

  const handleView = (id: string) => {
    setSelectedDocumentId(id)
    setViewModalOpen(true)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'status-badge status-badge-published'
      case 'ARCHIVED': return 'status-badge status-badge-archived'
      default: return 'status-badge status-badge-draft'
    }
  }

  return (
    <div className="knowledge-page">
      {/* Header */}
      <div className="knowledge-header">
        <div>
          <h1>Knowledge Base</h1>
          <p>Manage your documents and knowledge assets.</p>
        </div>
        <button className="upload-btn" onClick={() => setIsModalOpen(true)}>
          <span>+</span> Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="knowledge-filters">
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="knowledge-search"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="knowledge-filter-select"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button onClick={fetchData} className="knowledge-refresh-btn">
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="knowledge-stats">
        <div className="knowledge-stat-card">
          <div className="knowledge-stat-label">Total Documents</div>
          <div className="knowledge-stat-value">{documents.length}</div>
        </div>
        <div className="knowledge-stat-card">
          <div className="knowledge-stat-label">Categories</div>
          <div className="knowledge-stat-value">{categories.length}</div>
        </div>
        <div className="knowledge-stat-card">
          <div className="knowledge-stat-label">Tags</div>
          <div className="knowledge-stat-value">{tags.length}</div>
        </div>
      </div>

      {/* Document List */}
      <div className="knowledge-table-container">
        {isLoading ? (
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3>No documents yet</h3>
            <p>Upload your first document to get started.</p>
          </div>
        ) : (
          <table className="knowledge-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th className="hide-mobile">Category</th>
                <th className="hide-mobile">Tags</th>
                <th className="hide-mobile">Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{doc.title}</div>
                    {doc.description && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(doc.status)}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="hide-mobile" style={{ color: 'var(--text-secondary)' }}>
                    {doc.category?.name || '-'}
                  </td>
                  <td className="hide-mobile">
                    <div className="tag-list">
                      {doc.tags.length > 0 ? (
                        doc.tags.map((tag) => (
                          <span key={tag.id} className="tag-item">{tag.name}</span>
                        ))
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>-</span>
                      )}
                    </div>
                  </td>
                  <td className="hide-mobile" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleView(doc.id)}
                        className="action-btn action-btn-view"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="action-btn action-btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}  // Just call fetchData, no toast wrapper
      />

      {/* View Document Modal */}
      <ViewDocumentModal
        isOpen={viewModalOpen}
        documentId={selectedDocumentId}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedDocumentId(null)
        }}
      />
    </div>
  )
}

export default Knowledge