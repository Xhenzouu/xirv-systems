import { Link } from "react-router-dom"

import Button from "../ui/Button"
import Input from "../ui/Input"

import "./ForgotPasswordForm.css"

function ForgotPasswordForm() {
  return (
    <form className="forgot-password-form">

      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
      />

      <Button>
        Send Reset Link
      </Button>

      <div className="forgot-password-links">

        <Link to="/login">
          Back to Sign In
        </Link>

      </div>

    </form>
  )
}

export default ForgotPasswordForm