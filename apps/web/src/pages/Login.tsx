import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import LoginForm from "../components/auth/LoginForm"
import './Login.css'

function Login() {
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