import { useState } from 'react'
import { updateApproval } from '../../api/workflows'
import type { Approval } from '../../types/workflow'
import toast from 'react-hot-toast'
import { Check, X, User, Clock, X as CloseIcon } from 'lucide-react'
import './ApprovalModal.css'

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  taskTitle: string
  approvals: Approval[]
  onSuccess: () => void
}

export default function ApprovalModal({
  isOpen,
  onClose,
  taskTitle,
  approvals,
  onSuccess,
}: ApprovalModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [comment, setComment] = useState('')

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING')

  const handleDecision = async (approvalId: string, status: 'APPROVED' | 'REJECTED') => {
    setLoading(approvalId)
    const toastId = toast.loading(`Processing approval...`)

    try {
      await updateApproval(approvalId, status, comment || undefined)
      toast.success(`Approval ${status.toLowerCase()} successfully!`, { id: toastId })
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to process approval', { id: toastId })
    } finally {
      setLoading(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="xirv-modal-overlay" onClick={onClose}>
      <div className="xirv-modal xirv-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="xirv-modal-header">
          <h2>Review Approvals</h2>
          <button className="xirv-modal-close" onClick={onClose}>
            <CloseIcon size={24} />
          </button>
        </div>

        <div className="xirv-modal-body">
          <p className="xirv-modal-subtitle">
            <strong>{taskTitle}</strong> — {pendingApprovals.length} pending approval{pendingApprovals.length !== 1 ? 's' : ''}
          </p>

          {pendingApprovals.length === 0 ? (
            <div className="xirv-modal-empty">
              <p>No pending approvals for this task.</p>
            </div>
          ) : (
            <div className="xirv-approval-list">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="xirv-approval-item">
                  <div className="xirv-approval-info">
                    <div className="xirv-approval-requester">
                      <User size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      {approval.approver?.firstName || 'Unknown'} {approval.approver?.lastName || ''}
                    </div>
                    <div className="xirv-approval-date">
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Requested: {new Date(approval.requestedAt).toLocaleString()}
                    </div>
                    {approval.comment && (
                      <div className="xirv-approval-comment">
                        "{approval.comment}"
                      </div>
                    )}
                  </div>
                  <div className="xirv-approval-actions">
                    <button
                      onClick={() => handleDecision(approval.id, 'APPROVED')}
                      disabled={loading === approval.id}
                      className="xirv-approval-btn xirv-approval-btn-approve"
                    >
                      <Check size={16} style={{ display: 'inline', marginRight: '4px' }} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(approval.id, 'REJECTED')}
                      disabled={loading === approval.id}
                      className="xirv-approval-btn xirv-approval-btn-reject"
                    >
                      <X size={16} style={{ display: 'inline', marginRight: '4px' }} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="xirv-modal-form-group">
            <label htmlFor="approval-comment">Comment (optional)</label>
            <textarea
              id="approval-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a note about your decision..."
              rows={2}
              className="xirv-modal-textarea"
            />
          </div>
        </div>

        <div className="xirv-modal-footer">
          <button
            className="xirv-modal-btn xirv-modal-btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}