import { useState } from 'react'
import { X } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import './AdminComponents.css'

interface CreateOrgModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: { name: string; description?: string }) => Promise<void>
  isLoading?: boolean
}

export function CreateOrgModal({ isOpen, onClose, onCreate, isLoading }: CreateOrgModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    const toastId = toast.loading('Creating organization...')

    try {
      await onCreate({ name: name.trim(), description: description.trim() || undefined })
      toast.success(`Organization "${name.trim()}" created successfully!`, { id: toastId })
      setName('')
      setDescription('')
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create organization', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="xirv-modal-overlay" onClick={onClose}>
      <div className="xirv-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="xirv-modal-header">
          <h2>Create Organization</h2>
          <button className="xirv-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xirv-form-group">
            <label htmlFor="orgName">Organization Name *</label>
            <input
              id="orgName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
              required
              className="xirv-form-input"
            />
          </div>

          <div className="xirv-form-group">
            <label htmlFor="orgDesc">Description</label>
            <textarea
              id="orgDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description (optional)"
              rows={3}
              className="xirv-form-textarea"
            />
          </div>

          <div className="xirv-modal-footer">
            <button type="button" className="xirv-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="xirv-btn-primary" disabled={loading || isLoading}>
              {loading || isLoading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}