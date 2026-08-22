import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import './AdminComponents.css'

interface InviteFormProps {
  onInvite: (email: string, role: string) => Promise<{ success: boolean; error?: string }> // Changed return type
  isLoading?: boolean
}

export function InviteForm({ onInvite, isLoading }: InviteFormProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('MEMBER')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await onInvite(email, role)
      if (result && result.success) {  // Check result.success
        setSuccess(`Invitation sent to ${email}`)
        setEmail('')
        setRole('MEMBER')
      } else if (result && result.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="xirv-invite-form">
      {success && (
        <div className="xirv-success-message">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="xirv-error-message">
          ❌ {error}
        </div>
      )}

      <div className="xirv-form-group">
        <label htmlFor="invite-email">
          <Mail size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Email Address
        </label>
        <input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@company.com"
          required
          className="xirv-form-input"
        />
      </div>

      <div className="xirv-form-group">
        <label htmlFor="invite-role">Role</label>
        <select
          id="invite-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="xirv-form-select"
        >
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
          <option value="VIEWER">Viewer</option>
        </select>
      </div>

      <button type="submit" disabled={loading || isLoading} className="xirv-btn-primary">
        <Send size={16} style={{ display: 'inline', marginRight: '6px' }} />
        {loading || isLoading ? 'Sending...' : 'Send Invitation'}
      </button>
    </form>
  )
}