import { Link } from "react-router-dom"

import Button from "../ui/Button"
import Input from "../ui/Input"

import "./LoginForm.css"

function LoginForm() {

  return (
    <form className="login-form">

      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
      />

      <Button>
        Sign In
      </Button>

      <div className="login-links">

        <Link to="/forgot-password">
          Forgot your password?
        </Link>

        <Link to="/register">
          Create an account
        </Link>

      </div>

    </form>
  )

}

export default LoginForm