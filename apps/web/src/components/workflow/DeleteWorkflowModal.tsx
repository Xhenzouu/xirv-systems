import { Trash2, X } from 'lucide-react'  // ← ADD THIS
import './DeleteWorkflowModal.css'

interface DeleteWorkflowModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  workflowName: string
  isDeleting?: boolean
}

export default function DeleteWorkflowModal({
  isOpen,
  onClose,
  onConfirm,
  workflowName,
  isDeleting = false,
}: DeleteWorkflowModalProps) {
  if (!isOpen) return null

  return (
    <div className="xirv-modal-overlay" onClick={onClose}>
      <div className="xirv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="xirv-modal-header">
          <h2>Delete Workflow</h2>
          <button className="xirv-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="xirv-modal-body">
          <div className="xirv-modal-icon">
            <Trash2 size={48} strokeWidth={1.5} />
          </div>
          <p>
            Are you sure you want to delete <strong>"{workflowName}"</strong>?
          </p>
          <p className="xirv-modal-hint">
            This action cannot be undone. All workflow data, executions, and tasks will be permanently removed.
          </p>
        </div>

        <div className="xirv-modal-footer">
          <button
            className="xirv-modal-btn xirv-modal-btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="xirv-modal-btn xirv-modal-btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}