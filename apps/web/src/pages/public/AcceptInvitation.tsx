import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Mail, Building2, User, Clock, AlertCircle } from 'lucide-react'
import { invitationsApi } from '../../api/invitations'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import './AcceptInvitation.css'

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { success, error: toastError } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [invitation, setInvitation] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [rejected, setRejected] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided')
      setLoading(false)
      return
    }
    fetchInvitation()
  }, [token])

  const fetchInvitation = async () => {
    try {
      setLoading(true)
      const response = await invitationsApi.getInvitationByToken(token!)
      setInvitation(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired invitation')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!token) return
    
    if (!isAuthenticated) {
      navigate(`/login?redirect=/invite/accept?token=${token}`)
      return
    }

    try {
      setAccepting(true)
      await invitationsApi.acceptInvitation(token)
      setAccepted(true)
      success('Invitation accepted successfully!')
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to accept invitation'
      toastError(message)
      setError(message)
    } finally {
      setAccepting(false)
    }
  }

  const handleReject = async () => {
    if (!token) return

    if (window.confirm('Are you sure you want to decline this invitation?')) {
      try {
        await invitationsApi.rejectInvitation(token)
        setRejected(true)
        success('Invitation declined')
      } catch (err: any) {
        toastError(err.response?.data?.message || 'Failed to decline invitation')
      }
    }
  }

  if (loading) {
    return (
      <div className="accept-invitation-page">
        <div className="accept-invitation-card">
          <div className="accept-invitation-loading">
            <Loader2 size={48} className="accept-invitation-spinner" />
            <p>Loading invitation...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="accept-invitation-page">
        <div className="accept-invitation-card accept-invitation-error">
          <div className="accept-invitation-icon error">
            <XCircle size={48} />
          </div>
          <h2>Invalid Invitation</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="accept-invitation-btn accept-invitation-btn-primary"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="accept-invitation-page">
        <div className="accept-invitation-card accept-invitation-success">
          <div className="accept-invitation-icon success">
            <CheckCircle size={48} />
          </div>
          <h2>Invitation Accepted!</h2>
          <p>You have successfully joined <strong>{invitation?.organizationName}</strong></p>
          <button
            onClick={() => navigate('/dashboard')}
            className="accept-invitation-btn accept-invitation-btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (rejected) {
    return (
      <div className="accept-invitation-page">
        <div className="accept-invitation-card accept-invitation-rejected">
          <div className="accept-invitation-icon rejected">
            <XCircle size={48} />
          </div>
          <h2>Invitation Declined</h2>
          <p>You have declined the invitation to join <strong>{invitation?.organizationName}</strong></p>
          <button
            onClick={() => navigate('/')}
            className="accept-invitation-btn accept-invitation-btn-secondary"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="accept-invitation-page">
      <div className="accept-invitation-card">
        <div className="accept-invitation-header">
          <div className="accept-invitation-logo">
            <span className="accept-invitation-logo-text">XIRV</span>
            <span className="accept-invitation-logo-sub">Systems</span>
          </div>
          <h1>You've Been Invited!</h1>
          <p>Join your team on XIRV Systems</p>
        </div>

        <div className="accept-invitation-details">
          <div className="accept-invitation-detail-item">
            <Building2 size={18} />
            <div>
              <span className="accept-invitation-detail-label">Organization</span>
              <span className="accept-invitation-detail-value">{invitation?.organizationName}</span>
            </div>
          </div>
          <div className="accept-invitation-detail-item">
            <User size={18} />
            <div>
              <span className="accept-invitation-detail-label">Invited By</span>
              <span className="accept-invitation-detail-value">{invitation?.inviterName}</span>
            </div>
          </div>
          <div className="accept-invitation-detail-item">
            <Mail size={18} />
            <div>
              <span className="accept-invitation-detail-label">Email</span>
              <span className="accept-invitation-detail-value">{invitation?.email}</span>
            </div>
          </div>
          <div className="accept-invitation-detail-item">
            <Clock size={18} />
            <div>
              <span className="accept-invitation-detail-label">Role</span>
              <span className={`accept-invitation-role-badge ${invitation?.role?.toLowerCase()}`}>
                {invitation?.role || 'Member'}
              </span>
            </div>
          </div>
          <div className="accept-invitation-detail-item">
            <AlertCircle size={18} />
            <div>
              <span className="accept-invitation-detail-label">Expires</span>
              <span className="accept-invitation-detail-value">
                {invitation?.expiresAt ? new Date(invitation.expiresAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="accept-invitation-actions">
          {!isAuthenticated ? (
            <div className="accept-invitation-login-notice">
              <p>Please log in to accept this invitation</p>
              <button
                onClick={() => navigate(`/login?redirect=/invite/accept?token=${token}`)}
                className="accept-invitation-btn accept-invitation-btn-primary"
              >
                Log In
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="accept-invitation-btn accept-invitation-btn-primary"
              >
                {accepting ? (
                  <>
                    <Loader2 size={18} className="accept-invitation-spinner" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Accept Invitation
                  </>
                )}
              </button>
              <button
                onClick={handleReject}
                disabled={accepting}
                className="accept-invitation-btn accept-invitation-btn-secondary"
              >
                Decline
              </button>
            </>
          )}
        </div>

        <p className="accept-invitation-footer">
          By accepting, you agree to join this organization on XIRV Systems.
        </p>
      </div>
    </div>
  )
}