import { Link } from "react-router-dom"

import Button from "../ui/Button"
import Input from "../ui/Input"

import "./RegisterForm.css"

function RegisterForm() {
  return (
    <form className="register-form">

      <Input
        label="Full Name"
        placeholder="John Doe"
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
      />

      <Button>
        Create Account
      </Button>

      <div className="register-links">

        <Link to="/login">
          Already have an account? Sign In
        </Link>

      </div>

    </form>
  )
}

export default RegisterForm