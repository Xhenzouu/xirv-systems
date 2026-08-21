import { User, Mail, Save, RefreshCw } from 'lucide-react'
import { VerificationBadge } from '../ui/VerificationBadge'
import '../../pages/Settings.css'

interface ProfileSectionProps {
  firstName: string
  lastName: string
  email: string
  setFirstName: (value: string) => void
  setLastName: (value: string) => void
  setEmail: (value: string) => void
  isProfileLoading: boolean
  handleProfileUpdate: (e: React.FormEvent<HTMLFormElement>) => void
  verificationStatus: boolean | null
  verificationLoading: boolean
  resending: boolean
  verifyMessage: string | null
  handleResendVerification: () => void
}

export function ProfileSection({
  firstName,
  lastName,
  email,
  setFirstName,
  setLastName,
  setEmail,
  isProfileLoading,
  handleProfileUpdate,
  verificationStatus,
  verificationLoading,
  resending,
  verifyMessage,
  handleResendVerification,
}: ProfileSectionProps) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-title">
          <User size={20} />
          <h2>Profile</h2>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="settings-form">
        <div className="settings-form-group">
          <label>First Name</label>
          <div className="settings-input-with-icon">
            <User size={18} />
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
            />
          </div>
        </div>

        <div className="settings-form-group">
          <label>Last Name</label>
          <div className="settings-input-with-icon">
            <User size={18} />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div className="settings-form-group">
          <label>Email</label>
          <div className="settings-input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
            />
          </div>
        </div>

        {!verificationLoading && verificationStatus !== null && (
          <div className="settings-form-group">
            <label>Email Verification</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <VerificationBadge isVerified={verificationStatus} />
              {!verificationStatus && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="settings-btn settings-btn-secondary"
                  style={{ padding: 'var(--space-xs) var(--space-md)', fontSize: 'var(--text-sm)' }}
                >
                  <RefreshCw size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {resending ? 'Sending...' : 'Resend'}
                </button>
              )}
            </div>
            {verifyMessage && (
              <div style={{ marginTop: 'var(--space-xs)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {verifyMessage}
              </div>
            )}
            {!verificationStatus && (
              <div style={{ marginTop: 'var(--space-xs)', fontSize: 'var(--text-sm)', color: 'var(--status-warning)' }}>
                ⚠️ Please verify your email to access all features.
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="settings-btn settings-btn-primary"
          disabled={isProfileLoading}
        >
          <Save size={16} />
          {isProfileLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}