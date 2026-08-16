import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import './VerifyEmail.css'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasVerified = useRef(false)

  useEffect(() => {
    // Only verify if we have a token and haven't already verified
    if (token && !hasVerified.current) {
      hasVerified.current = true
      verifyEmail()
    } else if (!token) {
      setLoading(false)
      setError('No verification token provided')
    }
  }, [token])

  const verifyEmail = async () => {
    try {
      setLoading(true)
      setError(null)
      await authApi.verifyEmail(token!)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify email')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="verify-email-page">
        <div className="verify-email-container">
          <div className="verify-email-loading">⏳ Verifying your email...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="verify-email-page">
        <div className="verify-email-container">
          <div className="verify-email-error">❌ {error}</div>
          <p>
            <Link to="/resend-verification">Request a new verification email</Link>
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="verify-email-page">
        <div className="verify-email-container">
          <div className="verify-email-success">✅ Email Verified!</div>
          <p>Your email has been successfully verified.</p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="verify-email-btn">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="verify-email-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    )
  }

  return null
}