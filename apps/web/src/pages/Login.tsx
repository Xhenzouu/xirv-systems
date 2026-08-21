import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import LoginForm from "../components/auth/LoginForm"
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, user, isLoading } = useAuth()

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      if (user.role === 'SUPER_ADMIN') {
        navigate('/super-admin', { replace: true })
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, user, isLoading, navigate])

  return (
    <div className="login-page">
      <AuthCard>
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to continue using XIRV Systems."
        />
        <LoginForm />
      </AuthCard>
    </div>
  )
}

export default Login