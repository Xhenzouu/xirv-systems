import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import './ForgotPasswordForm.css'

export default function ForgotPasswordForm() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // For now, simulate a successful request
      // In production, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSent(true)
      toast.success('Reset instructions sent to your email!')
    } catch (error) {
      toast.error('Failed to send reset instructions')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="forgot-form">
      <div className="forgot-form-title">
        <h2>Reset Password</h2>
        <p>We'll send you a link to reset your password</p>
      </div>

      {!isSent ? (
        <>
          <div className="forgot-form-group">
            <label>Email Address</label>
            <div className="forgot-input-wrapper">
              <Mail size={18} className="forgot-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
          </div>

          <button type="submit" className="forgot-btn" disabled={isLoading}>
            <Send size={18} />
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </>
      ) : (
        <div className="forgot-success">
          <div className="forgot-success-icon">✓</div>
          <h3>Check your email</h3>
          <p>
            We've sent password reset instructions to{' '}
            <strong>{email}</strong>
          </p>
        </div>
      )}

      <Link to="/login" className="forgot-back">
        <ArrowLeft size={16} />
        Back to Sign In
      </Link>
    </form>
  )
}