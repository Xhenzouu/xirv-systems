import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm"
import './ForgotPassword.css'

export default function ForgotPassword() {
  return (
    <div className="forgot-password-page">
      <AuthCard>
        <AuthHeader
          title="Reset Password"
          subtitle="Enter your email address and we'll send you a link to reset your password."
        />
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  )
}