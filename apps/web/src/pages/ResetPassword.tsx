import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { authApi } from '../api/auth'
import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import ResetPasswordForm from "../components/auth/ResetPasswordForm"
import './ResetPassword.css'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [validating, setValidating] = useState(true)
  const [validToken, setValidToken] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No reset token provided')
        setValidating(false)
        return
      }

      try {
        await authApi.validateResetToken(token)
        setValidToken(true)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Invalid or expired token')
        setValidToken(false)
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  if (validating) {
    return (
      <div className="reset-password-page">
        <AuthCard>
          <div className="auth-loading">
            <div className="auth-spinner"></div>
            <p>Validating reset link...</p>
          </div>
        </AuthCard>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="reset-password-page">
        <AuthCard>
          <AuthHeader
            title="Invalid Reset Link"
            subtitle="The password reset link is invalid or has expired."
          />
          <div className="auth-error-box">
            <AlertCircle size={24} />
            <p>{error || 'Please request a new reset link.'}</p>
          </div>
          <Link to="/forgot-password" className="auth-btn-primary auth-btn-full">
            Request New Link
          </Link>
          <Link to="/login" className="auth-back-link">
            Back to Sign In
          </Link>
        </AuthCard>
      </div>
    )
  }

  return (
    <div className="reset-password-page">
      <AuthCard>
        <AuthHeader
          title="Create New Password"
          subtitle="Enter your new password below."
        />
        <ResetPasswordForm token={token || ''} />
      </AuthCard>
    </div>
  )
}