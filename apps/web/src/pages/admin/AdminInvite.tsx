import { useAdmin } from '../../hooks/useAdmin'
import { InviteForm } from '../../components/admin/InviteForm'
import { UserPlus } from 'lucide-react'
import './AdminPages.css'

export default function AdminInvite() {
  const { addMember } = useAdmin()

  return (
    <div className="xirv-admin-page">
      <div className="xirv-page-header">
        <h1>
          <UserPlus size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          Invite Members
        </h1>
        <p>Invite new members to your organization</p>
      </div>

      <div className="xirv-invite-container">
        <InviteForm onInvite={addMember} />

        <div className="xirv-invite-info">
          <h3>What happens next?</h3>
          <ol>
            <li>An email invitation will be sent to the user</li>
            <li>They accept the invitation</li>
            <li>They are added to your organization</li>
          </ol>
          <p style={{ marginTop: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Note: Email sending is currently in development. For now, users will be added directly.
          </p>
        </div>
      </div>
    </div>
  )
}