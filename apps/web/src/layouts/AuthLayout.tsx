import { Outlet } from "react-router-dom"
import "./AuthLayout.css"

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout-container">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout