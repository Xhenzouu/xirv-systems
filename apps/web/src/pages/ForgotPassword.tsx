import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm"

function ForgotPassword() {
  return (
    <AuthCard>

      <AuthHeader
        title="Reset Password"
        subtitle="Enter your email to receive reset instructions."
      />

      <ForgotPasswordForm />

    </AuthCard>
  )
}

export default ForgotPassword