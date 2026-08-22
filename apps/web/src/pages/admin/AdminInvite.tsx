import { Users, Mail, Clock } from 'lucide-react'
import { InviteForm } from '../../components/admin/InviteForm'
import { InvitationList } from '../../components/admin/InvitationList'
import { useInvitations } from '../../hooks/useInvitations'
import './AdminPages.css'

export default function AdminInvite() {
  const {
    invitations,
    loading,
    error,
    sending,
    cancelling,
    sendInvitation,
    cancelInvitation,
    resendInvitation
  } = useInvitations()

  return (
    <div className="xirv-admin-page">
      <div className="xirv-page-header">
        <h1>
          <Users size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          Invite Members
        </h1>
        <p>Invite new members to join your organization</p>
      </div>

      <div className="xirv-invite-page-grid">
        {/* Invite Form Column */}
        <div className="xirv-invite-page-form">
          <div className="xirv-settings-card">
            <div className="xirv-settings-card-header">
              <Mail size={20} className="xirv-settings-card-icon" />
              <div>
                <h2>Send Invitation</h2>
                <p>Enter the email address of the person you want to invite</p>
              </div>
            </div>
            <InviteForm
              onInvite={sendInvitation}
              isLoading={sending}
            />
          </div>
        </div>

        {/* Pending Invitations Column */}
        <div className="xirv-invite-page-list">
          <div className="xirv-settings-card">
            <div className="xirv-settings-card-header">
              <Clock size={20} className="xirv-settings-card-icon" />
              <div>
                <h2>Pending Invitations</h2>
                <p>Track and manage your sent invitations</p>
              </div>
            </div>
            {loading ? (
              <div className="xirv-loading">Loading invitations...</div>
            ) : error ? (
              <div className="xirv-error-message">
                ❌ {error}
                <button
                  onClick={() => window.location.reload()}
                  className="xirv-btn-secondary xirv-btn-sm"
                  style={{ marginLeft: 'var(--space-sm)' }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <InvitationList
                invitations={invitations}
                onCancel={cancelInvitation}
                onResend={resendInvitation}
                isProcessing={!!cancelling}
                processingId={cancelling}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}