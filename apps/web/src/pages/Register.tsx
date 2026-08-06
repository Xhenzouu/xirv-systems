import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import RegisterForm from "../components/auth/RegisterForm"

function Register() {
  return (
    <AuthCard>

      <AuthHeader
        title="Create Account"
        subtitle="Create your XIRV Systems account."
      />

      <RegisterForm />

    </AuthCard>
  )
}

export default Register