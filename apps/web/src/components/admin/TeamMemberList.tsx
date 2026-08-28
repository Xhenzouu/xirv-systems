import { useState } from 'react'
import { User, Crown, X } from 'lucide-react'
import type { Team, TeamMember } from '../../types/organization'
import './AdminComponents.css'

interface TeamMemberListProps {
  team: Team
  members: TeamMember[]
  onRemoveMember: (teamId: string, memberId: string) => Promise<boolean>
  onUpdateRole: (teamId: string, memberId: string, role: string) => Promise<boolean>
  isUpdating: boolean
  onAddMember: () => void
}

export function TeamMemberList({
  team,
  members,
  onRemoveMember,
  onUpdateRole,
  isUpdating,
  onAddMember,
}: TeamMemberListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleRoleChange = async (memberId: string, role: string) => {
    setUpdatingId(memberId)
    await onUpdateRole(team.id, memberId, role)
    setUpdatingId(null)
  }

  const handleRemove = async (memberId: string) => {
    if (!confirm('Remove this member from the team?')) return
    setUpdatingId(memberId)
    await onRemoveMember(team.id, memberId)
    setUpdatingId(null)
  }

  if (members.length === 0) {
    return (
      <div className="xirv-team-members-empty">
        <p>No members in this team yet.</p>
        <button onClick={onAddMember} className="xirv-btn-secondary xirv-btn-sm">
          + Add Member
        </button>
      </div>
    )
  }

  return (
    <div className="xirv-team-members-list">
      <div className="xirv-team-members-header">
        <span className="xirv-team-members-count">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
        <button onClick={onAddMember} className="xirv-btn-secondary xirv-btn-sm">
          + Add Member
        </button>
      </div>

      <div className="xirv-team-members-grid">
        {members.map((member) => (
          <div key={member.id} className="xirv-team-member-item">
            <div className="xirv-team-member-info">
              <div className="xirv-team-member-avatar">
                <User size={16} />
              </div>
              <div className="xirv-team-member-details">
                <span className="xirv-team-member-name">
                  {member.user.firstName} {member.user.lastName}
                </span>
                <span className="xirv-team-member-email">{member.user.email}</span>
              </div>
            </div>

            <div className="xirv-team-member-actions">
              {member.role === 'LEADER' && (
                <span className="xirv-team-member-role-badge leader">
                  <Crown size={12} />
                  Leader
                </span>
              )}

              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                disabled={isUpdating || updatingId === member.userId}
                className="xirv-role-select xirv-role-select-sm"
              >
                <option value="MEMBER">Member</option>
                <option value="LEADER">Leader</option>
              </select>

              <button
                onClick={() => handleRemove(member.userId)}
                disabled={isUpdating || updatingId === member.userId || members.length <= 1}
                className="xirv-btn-danger-small xirv-btn-icon"
                title={members.length <= 1 ? 'Cannot remove last member' : 'Remove member'}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}