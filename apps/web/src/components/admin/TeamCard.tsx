import { Users, Trash2 } from 'lucide-react'
import type { Team } from '../../types/organization'
import './AdminComponents.css'

interface TeamCardProps {
  team: Team
  onDelete: (teamId: string) => void
  isDeleting?: boolean
}

export function TeamCard({ team, onDelete, isDeleting }: TeamCardProps) {
  return (
    <div className="xirv-team-card">
      <div className="xirv-team-header">
        <h3>{team.name}</h3>
        <button
          onClick={() => onDelete(team.id)}
          disabled={isDeleting}
          className="xirv-btn-danger-small"
          title="Delete team"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {team.description && <p>{team.description}</p>}
      <div className="xirv-team-members">
        <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
        {team.members?.length || 0} members
      </div>
    </div>
  )
}