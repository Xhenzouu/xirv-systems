import { useAdmin } from '../../hooks/useAdmin'
import { MemberTable } from '../../components/admin/MemberTable'
import { Users, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import './AdminPages.css'

export default function AdminMembers() {
  const { members, loading, updating, removeMember, updateMemberRole, loadData } = useAdmin()

  if (loading) {
    return <div className="xirv-loading">Loading members...</div>
  }

  return (
    <div className="xirv-admin-page">
      <div className="xirv-page-header">
        <h1>
          <Users size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          Member Management
        </h1>
        <p>Manage your organization members and their roles</p>
      </div>

      <div className="xirv-member-controls">
        <Link to="/admin/invite" className="xirv-btn-primary">
          <UserPlus size={16} style={{ display: 'inline', marginRight: '4px' }} />
          Invite Member
        </Link>
      </div>

      <MemberTable
        members={members}
        updating={updating}
        onRoleUpdate={updateMemberRole}
        onRemoveMember={removeMember}
        onRefresh={loadData}
      />
    </div>
  )
}