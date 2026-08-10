import { useState, useRef, useEffect } from 'react'
import { documentApi, categoryApi, tagApi, type Category } from '../../api'
import toast from 'react-hot-toast'
import './Modal.css'

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadDocumentModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.list()
      setCategories(data || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!file) {
      setError('Please select a file')
      return
    }

    setIsLoading(true)
    setError('')
    const toastId = toast.loading('Uploading document...')

    try {
      await documentApi.upload(
        file,
        title.trim(),
        description.trim() || undefined,
        categoryId || undefined
      )

      if (tags.trim()) {
        const tagList = tags.split(',').map(t => t.trim()).filter(t => t)
        for (const tagName of tagList) {
          try {
            await tagApi.create({ name: tagName })
          } catch (err) {
            console.error(`Failed to add tag "${tagName}":`, err)
          }
        }
      }

      toast.success('Document uploaded successfully!', { id: toastId })
      onSuccess()
      onClose()
      resetForm()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload document', { id: toastId })
      setError(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setFile(null)
    setCategoryId('')
    setTags('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Upload Document</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="modal-form-group">
              <label>Title <span className="required">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="modal-input"
                placeholder="Document title"
                required
              />
            </div>

            {/* Description */}
            <div className="modal-form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="modal-textarea"
                rows={3}
                placeholder="Brief description of the document"
              />
            </div>

            {/* File Upload */}
            <div className="modal-form-group">
              <label>File <span className="required">*</span></label>
              <div className="modal-file-input-wrapper">
                <div className="modal-file-input">
                  <span className="file-placeholder">
                    <span className="icon">📄</span>
                    Click to browse files
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                {file && (
                  <div className="modal-file-selected">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="modal-form-group">
              <label>Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="modal-select"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="modal-form-group">
              <label>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="modal-input"
                placeholder="tag1, tag2, tag3 (comma separated)"
              />
              <div className="helper-text">Separate tags with commas</div>
            </div>

            {/* Footer */}
            <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 'var(--space-lg)' }}>
              <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="modal-btn modal-btn-primary" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}