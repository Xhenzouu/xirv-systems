import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm"
import './ForgotPassword.css'

function ForgotPassword() {
  return (
    <div className="forgot-password-page">
      <AuthCard>
        <AuthHeader
          title="Reset Password"
          subtitle="Enter your email to receive reset instructions."
        />
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  )
}

export default ForgotPassword