import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import './RegisterForm.css'

export default function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      await register(fullName, email, password)
      toast.success('Account created! Welcome to XIRV Systems 🚀')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="register-form-title">
        <h2>Create Account</h2>
        <p>Fill in the details to get started</p>
      </div>

      {error && (
        <div className="register-error">
          <span className="register-error-icon">✕</span>
          {error}
        </div>
      )}

      <div className="register-form-group">
        <label>Full Name</label>
        <div className="register-input-wrapper">
          <User size={18} className="register-input-icon" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            autoFocus
          />
        </div>
      </div>

      <div className="register-form-group">
        <label>Email Address</label>
        <div className="register-input-wrapper">
          <Mail size={18} className="register-input-icon" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="register-form-group">
        <label>Password</label>
        <div className="register-input-wrapper">
          <Lock size={18} className="register-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            required
          />
          <button
            type="button"
            className="register-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <span className="register-hint">Password must be at least 8 characters</span>
      </div>

      <div className="register-form-group">
        <label>Confirm Password</label>
        <div className="register-input-wrapper">
          <Lock size={18} className="register-input-icon" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            className="register-password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" className="register-btn" disabled={isLoading}>
        <UserPlus size={18} />
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="register-footer">
        Already have an account?{' '}
        <Link to="/login" className="register-link">
          Sign in
        </Link>
      </p>
    </form>
  )
}