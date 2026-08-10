import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'
import './LoginForm.css'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="login-form-title">
        <h2>Sign In</h2>
        <p>Enter your credentials to access your account</p>
      </div>

      {error && (
        <div className="login-error">
          <span className="login-error-icon">✕</span>
          {error}
        </div>
      )}

      <div className="login-form-group">
        <label>Email Address</label>
        <div className="login-input-wrapper">
          <Mail size={18} className="login-input-icon" />
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

      <div className="login-form-group">
        <label>Password</label>
        <div className="login-input-wrapper">
          <Lock size={18} className="login-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="login-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="login-options">
        <label className="login-remember">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        <Link to="/forgot-password" className="login-forgot">
          Forgot password?
        </Link>
      </div>

      <button type="submit" className="login-btn" disabled={isLoading}>
        <LogIn size={18} />
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="login-footer">
        Don't have an account?{' '}
        <Link to="/register" className="login-link">
          Sign up
        </Link>
      </p>
    </form>
  )
}