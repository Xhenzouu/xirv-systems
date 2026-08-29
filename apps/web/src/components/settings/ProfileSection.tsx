import { User, Mail, Save, RefreshCw, Phone, FileText } from 'lucide-react'
import { VerificationBadge } from '../ui/VerificationBadge'
import { ProfilePreview } from './ProfilePreview'
import '../../pages/Settings.css'

interface ProfileSectionProps {
  firstName: string
  lastName: string
  email: string
  bio: string
  phone: string
  memberSince: string
  role?: string
  setFirstName: (value: string) => void
  setLastName: (value: string) => void
  setEmail: (value: string) => void
  setBio: (value: string) => void
  setPhone: (value: string) => void
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
  bio,
  phone,
  memberSince,
  role,
  setFirstName,
  setLastName,
  setEmail,
  setBio,
  setPhone,
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

      {/* Profile Preview */}
      <ProfilePreview
        firstName={firstName}
        lastName={lastName}
        email={email}
        role={role}
        bio={bio}
        phone={phone}
        memberSince={memberSince}
      />

      <form onSubmit={handleProfileUpdate} className="settings-form">
        <div className="settings-form-row">
          <div className="settings-form-group settings-form-group-half">
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

          <div className="settings-form-group settings-form-group-half">
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

        <div className="settings-form-group">
          <label>Phone Number</label>
          <div className="settings-input-with-icon">
            <Phone size={18} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 912 345 6789"
            />
          </div>
        </div>

        <div className="settings-form-group">
          <label>Bio</label>
          <div className="settings-input-with-icon">
            <FileText size={18} />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={500}
              className="settings-textarea"
            />
          </div>
          <span className="settings-char-count">{bio?.length || 0}/500</span>
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