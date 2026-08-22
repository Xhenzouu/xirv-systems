import type { Invitation } from '../../api/invitations'  // Type-only import
import { Mail, X, RotateCcw, Clock } from 'lucide-react'

interface InvitationCardProps {
  invitation: Invitation
  onCancel: () => void
  onResend: () => void
  isProcessing: boolean
}

export function InvitationCard({
  invitation,
  onCancel,
  onResend,
  isProcessing
}: InvitationCardProps) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'xirv-role-admin'
      case 'VIEWER': return 'xirv-role-viewer'
      default: return 'xirv-role-member'
    }
  }

  return (
    <div className="xirv-invitation-card">
      <div className="xirv-invitation-card-header">
        <div className="xirv-invitation-card-email">
          <Mail size={16} className="xirv-invitation-card-icon" />
          <span>{invitation.email}</span>
        </div>
        <span className={`xirv-role-badge ${getRoleColor(invitation.role)}`}>
          {invitation.role}
        </span>
      </div>

      <div className="xirv-invitation-card-body">
        <div className="xirv-invitation-card-meta">
          <span className="xirv-invitation-card-time">
            <Clock size={14} />
            Sent {timeAgo(invitation.createdAt)}
          </span>
          <span className="xirv-invitation-card-expiry">
            Expires {new Date(invitation.expiresAt).toLocaleDateString()}
          </span>
        </div>
        {invitation.inviter && (
          <span className="xirv-invitation-card-inviter">
            Invited by {invitation.inviter.firstName} {invitation.inviter.lastName}
          </span>
        )}
      </div>

      <div className="xirv-invitation-card-actions">
        <button
          onClick={onResend}
          disabled={isProcessing}
          className="xirv-btn-secondary xirv-btn-sm"
          title="Resend invitation"
        >
          <RotateCcw size={14} />
          {isProcessing ? 'Processing...' : 'Resend'}
        </button>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="xirv-btn-danger xirv-btn-sm"
          title="Cancel invitation"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </div>
  )
}