import { useState } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { TeamCard } from '../../components/admin/TeamCard'
import { Users, Plus } from 'lucide-react'
import './AdminPages.css'

export default function AdminTeams() {
  const { teams, loading, createTeam, deleteTeam } = useAdmin()
  const [showCreate, setShowCreate] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return

    setCreating(true)
    const success = await createTeam(teamName, teamDescription || undefined)
    setCreating(false)

    if (success) {
      setTeamName('')
      setTeamDescription('')
      setShowCreate(false)
    }
  }

  if (loading) {
    return <div className="xirv-loading">Loading teams...</div>
  }

  return (
    <div className="xirv-admin-page">
      <div className="xirv-page-header">
        <h1>
          <Users size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          Team Management
        </h1>
        <p>Create and manage teams within your organization</p>
      </div>

      <button onClick={() => setShowCreate(!showCreate)} className="xirv-btn-primary">
        <Plus size={16} style={{ display: 'inline', marginRight: '4px' }} />
        {showCreate ? 'Cancel' : 'Create Team'}
      </button>

      {showCreate && (
        <form onSubmit={handleCreateTeam} className="xirv-team-form">
          <div className="xirv-form-group">
            <label htmlFor="teamName">Team Name *</label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Engineering, Marketing, Sales"
              required
              className="xirv-form-input"
            />
          </div>

          <div className="xirv-form-group">
            <label htmlFor="teamDescription">Description</label>
            <input
              id="teamDescription"
              type="text"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="What does this team do?"
              className="xirv-form-input"
            />
          </div>

          <button type="submit" disabled={creating} className="xirv-btn-primary">
            {creating ? 'Creating...' : 'Create Team'}
          </button>
        </form>
      )}

      {teams.length === 0 ? (
        <div className="xirv-empty-state">
          <p>No teams yet. Create your first team!</p>
        </div>
      ) : (
        <div className="xirv-team-grid">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDelete={deleteTeam}
            />
          ))}
        </div>
      )}
    </div>
  )
}