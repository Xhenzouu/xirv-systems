import { Link } from "react-router-dom"
import Brand from "../branding/Brand"
import UserProfile from "../user/UserProfile"
import "./Header.css"

function Header() {
  return (
    <header className="xirv-header">
      <Brand />

      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <UserProfile />
    </header>
  )
}

export default Header