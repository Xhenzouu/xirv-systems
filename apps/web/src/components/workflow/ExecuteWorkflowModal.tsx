import { useState } from 'react'
import { executeWorkflow } from '../../api/workflows'
import toast from 'react-hot-toast'
import { Play, X } from 'lucide-react'  // ← ADD THIS
import './ExecuteWorkflowModal.css'

interface ExecuteWorkflowModalProps {
  isOpen: boolean
  onClose: () => void
  workflowId: string
  workflowName: string
  onSuccess: () => void
}

export default function ExecuteWorkflowModal({
  isOpen,
  onClose,
  workflowId,
  workflowName,
  onSuccess,
}: ExecuteWorkflowModalProps) {
  const [isExecuting, setIsExecuting] = useState(false)

  const handleExecute = async () => {
    setIsExecuting(true)
    const toastId = toast.loading(`Executing "${workflowName}"...`)

    try {
      await executeWorkflow(workflowId)
      toast.success(`Workflow "${workflowName}" executed successfully!`, { id: toastId })
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to execute workflow', { id: toastId })
    } finally {
      setIsExecuting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="xirv-modal-overlay" onClick={onClose}>
      <div className="xirv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="xirv-modal-header">
          <h2>Execute Workflow</h2>
          <button className="xirv-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="xirv-modal-body">
          <div className="xirv-modal-icon">
            <Play size={48} strokeWidth={1.5} />
          </div>
          <p>
            Are you sure you want to execute <strong>"{workflowName}"</strong>?
          </p>
          <p className="xirv-modal-hint">
            This will start the workflow immediately with the current context.
          </p>
        </div>

        <div className="xirv-modal-footer">
          <button
            className="xirv-modal-btn xirv-modal-btn-secondary"
            onClick={onClose}
            disabled={isExecuting}
          >
            Cancel
          </button>
          <button
            className="xirv-modal-btn xirv-modal-btn-primary"
            onClick={handleExecute}
            disabled={isExecuting}
          >
            {isExecuting ? 'Executing...' : 'Execute'}
          </button>
        </div>
      </div>
    </div>
  )
}