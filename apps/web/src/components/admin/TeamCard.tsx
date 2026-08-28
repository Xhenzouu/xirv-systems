import { useState } from 'react'
import { Users, Trash2, ChevronDown, ChevronRight, UserPlus } from 'lucide-react'
import type { Team } from '../../types/organization'
import { TeamMemberList } from './TeamMemberList'
import './AdminComponents.css'

interface TeamCardProps {
  team: Team
  onDelete: (teamId: string) => Promise<boolean>
  onAddMemberClick: (team: Team) => void
  onRemoveMember: (teamId: string, memberId: string) => Promise<boolean>
  onUpdateMemberRole: (teamId: string, memberId: string, role: string) => Promise<boolean>
  isDeleting?: boolean
  isUpdating?: boolean
}

export function TeamCard({
  team,
  onDelete,
  onAddMemberClick,
  onRemoveMember,
  onUpdateMemberRole,
  isDeleting,
  isUpdating,
}: TeamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const memberCount = team.members?.length || 0
  const leaderCount = team.members?.filter((m: any) => m.role === 'LEADER').length || 0

  return (
    <div className="xirv-team-card">
      <div 
        className="xirv-team-card-title"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3>{team.name}</h3>
          {team.description && <p>{team.description}</p>}
        </div>
        <button className="xirv-team-card-expand">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="xirv-team-card-body">
          <TeamMemberList
            team={team}
            members={team.members || []}
            onRemoveMember={onRemoveMember}
            onUpdateRole={onUpdateMemberRole}
            isUpdating={!!isUpdating}
            onAddMember={() => onAddMemberClick(team)}
          />
        </div>
      )}

      <div className="xirv-team-card-footer">
        <span className="xirv-team-card-badge">
          <Users size={14} />
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
          {leaderCount > 0 && ` · ${leaderCount} leader${leaderCount > 1 ? 's' : ''}`}
        </span>
        <div className="xirv-team-card-actions">
          <button
            onClick={() => onAddMemberClick(team)}
            className="xirv-btn-secondary xirv-btn-sm"
            title="Add member"
          >
            <UserPlus size={14} />
          </button>
          <button
            onClick={() => onDelete(team.id)}
            disabled={isDeleting}
            className="xirv-btn-danger-small"
            title="Delete team"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}