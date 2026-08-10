import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import RegisterForm from "../components/auth/RegisterForm"
import './Register.css'

function Register() {
  return (
    <div className="register-page">
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Start your journey with XIRV Systems."
        />
        <RegisterForm />
      </AuthCard>
    </div>
  )
}

export default Register