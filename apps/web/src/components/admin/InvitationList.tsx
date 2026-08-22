import type { Invitation } from '../../api/invitations'
import { InvitationCard } from './InvitationCard'

interface InvitationListProps {
  invitations: Invitation[]
  onCancel: (id: string) => Promise<void>
  onResend: (id: string) => Promise<void>
  isProcessing: boolean
  processingId: string | null
}

export function InvitationList({
  invitations = [],
  onCancel,
  onResend,
  isProcessing,
  processingId
}: InvitationListProps) {
  // Safety check
  if (!invitations || !Array.isArray(invitations) || invitations.length === 0) {
    return (
      <div className="xirv-empty-state">
        <div className="xirv-empty-icon">📭</div>
        <h3>No pending invitations</h3>
        <p>Invitations you send will appear here</p>
      </div>
    )
  }

  return (
    <div className="xirv-invitation-list">
      <div className="xirv-invitation-list-header">
        <h4>Pending Invitations ({invitations.length})</h4>
      </div>
      <div className="xirv-invitation-list-grid">
        {invitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onCancel={() => onCancel(invitation.id)}
            onResend={() => onResend(invitation.id)}
            isProcessing={isProcessing && processingId === invitation.id}
          />
        ))}
      </div>
    </div>
  )
}