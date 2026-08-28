import { useState, useEffect } from 'react'
import { X, UserPlus, Users } from 'lucide-react'
import { useAdmin } from '../../hooks/useAdmin'
import type { Team } from '../../types/organization'
import './AdminComponents.css'

interface AddTeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  team: Team | null
  onAddMember: (teamId: string, userId: string, role: string) => Promise<boolean>
}

export function AddTeamMemberModal({
  isOpen,
  onClose,
  team,
  onAddMember,
}: AddTeamMemberModalProps) {
  const { members } = useAdmin()
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState('MEMBER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Get members not already in the team
  const teamMemberIds = team?.members?.map((m: any) => m.userId) || []
  const availableMembers = members.filter((m: any) => !teamMemberIds.includes(m.userId))

  useEffect(() => {
    if (isOpen) {
      setSelectedUserId('')
      setSelectedRole('MEMBER')
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!team || !selectedUserId) return

    setLoading(true)
    setError(null)

    try {
      const result = await onAddMember(team.id, selectedUserId, selectedRole)
      if (result) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setError('Failed to add member to team')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="xirv-modal-overlay" onClick={onClose}>
      <div className="xirv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="xirv-modal-header">
          <h2>
            <UserPlus size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Add Member to {team?.name}
          </h2>
          <button onClick={onClose} className="xirv-modal-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="xirv-modal-body">
          {success ? (
            <div className="xirv-success-message">
              ✅ Member added successfully!
            </div>
          ) : (
            <>
              {error && (
                <div className="xirv-error-message">
                  ❌ {error}
                </div>
              )}

              <div className="xirv-form-group">
                <label htmlFor="member-select">
                  <Users size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Select Member
                </label>
                {availableMembers.length === 0 ? (
                  <p className="xirv-text-muted">
                    All organization members are already in this team.
                  </p>
                ) : (
                  <select
                    id="member-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="xirv-form-select"
                    required
                  >
                    <option value="">Select a member...</option>
                    {availableMembers.map((member: any) => (
                      <option key={member.id} value={member.userId}>
                        {member.user.firstName} {member.user.lastName} ({member.user.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="xirv-form-group">
                <label htmlFor="role-select">Role</label>
                <select
                  id="role-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="xirv-form-select"
                >
                  <option value="MEMBER">Member</option>
                  <option value="LEADER">Leader</option>
                </select>
              </div>

              <div className="xirv-modal-footer">
                <button
                  type="button"
                  onClick={onClose}
                  className="xirv-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedUserId || availableMembers.length === 0}
                  className="xirv-btn-primary"
                >
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}