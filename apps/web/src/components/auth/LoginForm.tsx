import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'
import './LoginForm.css'

export default function LoginForm() {
  const { login, user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect after authentication
  useEffect(() => {
    console.log('🔍 Auth State:', { isAuthenticated, user, role: user?.role })
    
    if (isAuthenticated && user) {
      console.log('✅ User logged in with role:', user.role)
      if (user.role === 'SUPER_ADMIN') {
        console.log('➡️ Redirecting to /super-admin')
        navigate('/super-admin', { replace: true })
      } else {
        console.log('➡️ Redirecting to /dashboard')
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const loggedInUser = await login(email, password)
      console.log('📦 Login returned user:', loggedInUser)
      // The useEffect above will handle the redirect
    } catch (err: any) {
      console.error('❌ Login error:', err)
      setError(err.response?.data?.message || 'Invalid email or password')
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