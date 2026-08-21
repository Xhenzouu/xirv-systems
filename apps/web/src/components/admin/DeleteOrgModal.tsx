import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import type { Organization } from '../../types/super-admin'
import './AdminComponents.css'

interface DeleteOrgModalProps {
  isOpen: boolean
  onClose: () => void
  organization: Organization | null
  onDelete: (id: string) => Promise<void>
  isLoading?: boolean
}

export function DeleteOrgModal({ isOpen, onClose, organization, onDelete, isLoading }: DeleteOrgModalProps) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  if (!isOpen || !organization) return null

  const handleDelete = async () => {
    setLoading(true)
    const toastId = toast.loading(`Deleting "${organization.name}"...`)

    try {
      await onDelete(organization.id)
      toast.success(`Organization "${organization.name}" deleted successfully!`, { id: toastId })
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete organization', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="xirv-modal-overlay" onClick={onClose}>
      <div className="xirv-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="xirv-modal-header">
          <h2>Delete Organization</h2>
          <button className="xirv-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="xirv-modal-body">
          <div className="xirv-confirm-icon">
            <Trash2 size={48} />
          </div>
          <p className="xirv-confirm-text">
            Are you sure you want to delete <strong>"{organization.name}"</strong>?
          </p>
          <p className="xirv-confirm-hint">
            This action cannot be undone. All members and teams will be removed.
          </p>
        </div>

        <div className="xirv-modal-footer">
          <button type="button" className="xirv-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="xirv-btn-danger" onClick={handleDelete} disabled={loading || isLoading}>
            {loading || isLoading ? 'Deleting...' : 'Delete Organization'}
          </button>
        </div>
      </div>
    </div>
  )
}