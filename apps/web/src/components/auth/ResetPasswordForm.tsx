import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { authApi } from '../../api/auth'
import './ResetPasswordForm.css'

interface ResetPasswordFormProps {
  token: string
  onSuccess?: () => void
}

export default function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!token) {
      setError('No reset token provided')
      return
    }

    setIsLoading(true)

    try {
      await authApi.resetPassword(token, password)
      setIsSuccess(true)
      onSuccess?.()
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="reset-success">
        <div className="reset-success-icon">
          <CheckCircle size={48} />
        </div>
        <h3>Password Reset!</h3>
        <p>Your password has been successfully reset.</p>
        <p className="reset-success-redirect">You will be redirected to login shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="reset-form">
      {error && (
        <div className="reset-error">
          <span className="reset-error-icon">✕</span>
          {error}
        </div>
      )}

      <div className="reset-form-group">
        <label htmlFor="password">New Password</label>
        <div className="reset-input-wrapper">
          <Lock size={18} className="reset-input-icon" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            required
            autoFocus
          />
          <button
            type="button"
            className="reset-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="reset-form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="reset-input-wrapper">
          <Lock size={18} className="reset-input-icon" />
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>

      <button type="submit" className="reset-btn" disabled={isLoading}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  )
}