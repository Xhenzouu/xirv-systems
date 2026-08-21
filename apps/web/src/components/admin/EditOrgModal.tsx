import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import type { Organization } from '../../types/super-admin'
import './AdminComponents.css'

interface EditOrgModalProps {
  isOpen: boolean
  onClose: () => void
  organization: Organization | null
  onUpdate: (id: string, data: { name?: string; description?: string }) => Promise<void>
  isLoading?: boolean
}

export function EditOrgModal({ isOpen, onClose, organization, onUpdate, isLoading }: EditOrgModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (organization) {
      setName(organization.name)
      setDescription(organization.description || '')
    }
  }, [organization])

  if (!isOpen || !organization) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    const toastId = toast.loading('Updating organization...')

    try {
      await onUpdate(organization.id, { name: name.trim(), description: description.trim() || undefined })
      toast.success(`Organization updated successfully!`, { id: toastId })
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update organization', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="xirv-modal-overlay" onClick={onClose}>
      <div className="xirv-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="xirv-modal-header">
          <h2>Edit Organization</h2>
          <button className="xirv-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xirv-form-group">
            <label htmlFor="editOrgName">Organization Name *</label>
            <input
              id="editOrgName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
              required
              className="xirv-form-input"
            />
          </div>

          <div className="xirv-form-group">
            <label htmlFor="editOrgDesc">Description</label>
            <textarea
              id="editOrgDesc"
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
              {loading || isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}