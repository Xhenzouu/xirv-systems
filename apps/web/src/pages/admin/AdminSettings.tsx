import { useState, useEffect } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { adminApi } from '../../api/admin'
import { authApi } from '../../api'
import { Settings, Save, RefreshCw, Mail, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { VerificationBadge } from '../../components/ui/VerificationBadge'
import './AdminPages.css'

export default function AdminSettings() {
  const { user } = useAuth()
  const { organization, loading, loadData } = useAdmin()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // Email Verification
  const [verificationStatus, setVerificationStatus] = useState<boolean | null>(null)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null)

  useEffect(() => {
    if (organization) {
      setName(organization.name)
      setDescription(organization.description || '')
    }
    loadVerificationStatus()
  }, [organization])

  const loadVerificationStatus = async () => {
    try {
      setVerificationLoading(true)
      const status = await authApi.getVerificationStatus()
      setVerificationStatus(status.isVerified)
    } catch (error) {
      console.error('Failed to load verification status:', error)
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!user) return

    setResending(true)
    setVerifyMessage(null)

    try {
      await authApi.resendVerification(user.email)
      setVerifyMessage('✅ Verification email sent! Please check your inbox.')
    } catch (error: any) {
      setVerifyMessage(`❌ ${error.response?.data?.message || 'Failed to resend verification email'}`)
    } finally {
      setResending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)

    try {
      await adminApi.updateOrganization({ name, description })
      setSuccess('Organization settings updated successfully!')
      await loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="xirv-loading">Loading settings...</div>
  }

  return (
    <div className="xirv-admin-page">
      <div className="xirv-page-header">
        <h1>
          <Settings size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          Settings
        </h1>
        <p>Manage your account and organization settings</p>
      </div>

      {/* Organization Settings Card */}
      <div className="xirv-settings-card">
        <div className="xirv-settings-card-header">
          <Building2 size={20} className="xirv-settings-card-icon" />
          <div>
            <h2>Organization Settings</h2>
            <p>Update your organization information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {success && (
            <div className="xirv-success-message">
              ✅ {success}
            </div>
          )}

          <div className="xirv-form-group">
            <label htmlFor="orgName">Organization Name *</label>
            <input
              id="orgName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization name"
              required
              className="xirv-form-input"
            />
          </div>

          <div className="xirv-form-group">
            <label htmlFor="orgDescription">Description</label>
            <textarea
              id="orgDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your organization"
              rows={4}
              className="xirv-form-textarea"
            />
          </div>

          <button type="submit" disabled={saving} className="xirv-btn-primary">
            <Save size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Email Verification Card - Separate Card like User Settings */}
      <div className="xirv-settings-card">
        <div className="xirv-settings-card-header">
          <Mail size={20} className="xirv-settings-card-icon" />
          <div>
            <h2>Email Verification</h2>
            <p>Verify your email address to access all features</p>
          </div>
        </div>

        {!verificationLoading && verificationStatus !== null && (
          <div className="xirv-verification-content">
            <VerificationBadge isVerified={verificationStatus} size="lg" />
            
            {!verificationStatus && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resending}
                className="xirv-btn-resend"
              >
                <RefreshCw size={16} className={resending ? 'xirv-spin' : ''} />
                {resending ? 'Sending...' : 'Resend Verification'}
              </button>
            )}
          </div>
        )}

        {verifyMessage && (
          <div className="xirv-verification-message">
            {verifyMessage}
          </div>
        )}

        {!verificationLoading && verificationStatus === false && (
          <div className="xirv-verification-warning">
            ⚠️ Please verify your email to access all features.
          </div>
        )}

        {!verificationLoading && verificationStatus === true && (
          <div className="xirv-verification-success">
            ✅ Your email is verified. You have full access to all features.
          </div>
        )}
      </div>
    </div>
  )
}