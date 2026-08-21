import { useState } from 'react'
import { Search, RefreshCw, User, Mail, Calendar } from 'lucide-react'  // ← Removed Shield
import type { OrganizationMember } from '../../types/organization'
import './AdminComponents.css'

interface MemberTableProps {
  members: OrganizationMember[]
  updating: string | null
  onRoleUpdate: (memberId: string, role: string) => void
  onRemoveMember: (memberId: string) => void
  onRefresh: () => void
}

export function MemberTable({
  members,
  updating,
  onRoleUpdate,
  onRemoveMember,
  onRefresh,
}: MemberTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMembers = members.filter((member) =>
    member.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'OWNER': return 'xirv-role-owner'
      case 'ADMIN': return 'xirv-role-admin'
      case 'MEMBER': return 'xirv-role-member'
      default: return 'xirv-role-viewer'
    }
  }

  return (
    <div className="xirv-user-table-container">
      <div className="xirv-user-table-header">
        <div className="xirv-user-table-search">
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onRefresh} className="xirv-btn-secondary">
            <RefreshCw size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Refresh
          </button>
        </div>
        <span className="xirv-user-count">
          <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
          {members.length} members
        </span>
      </div>

      <div className="xirv-user-table-wrapper">
        <table className="xirv-user-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="xirv-empty-state">
                  <p>No members found</p>
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="xirv-user-name">
                      <User size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--text-secondary)' }} />
                      {member.user.firstName} {member.user.lastName}
                      {member.role === 'OWNER' && (
                        <span className="xirv-owner-badge">Owner</span>
                      )}
                    </div>
                    <div className="xirv-user-date">
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <Mail size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--text-secondary)' }} />
                    {member.user.email}
                  </td>
                  <td>
                    <span className={`xirv-role-badge ${getRoleBadgeClass(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                  <td>
                    {member.role !== 'OWNER' && (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => onRoleUpdate(member.id, e.target.value)}
                          disabled={updating === member.id}
                          className="xirv-role-select"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MEMBER">MEMBER</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                        <button
                          onClick={() => onRemoveMember(member.id)}
                          disabled={updating === member.id}
                          className="xirv-btn-danger-small"
                        >
                          Remove
                        </button>
                      </>
                    )}
                    {updating === member.id && <span className="xirv-spinner">⏳</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}