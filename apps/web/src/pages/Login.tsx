import AuthCard from "../components/auth/AuthCard"
import AuthHeader from "../components/auth/AuthHeader"
import LoginForm from "../components/auth/LoginForm"

function Login() {

  return (
    <AuthCard>

      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to continue using XIRV Systems."
      />

      <LoginForm />

    </AuthCard>
  )

}

export default Login