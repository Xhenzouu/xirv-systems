import Brand from "../branding/Brand"
import UserProfile from "../user/UserProfile"
import "./Header.css"

function Header() {
  return (
    <header className="xirv-header">
      <Brand />

      <nav>
        {/* Navigation links removed */}
      </nav>

      <UserProfile />
    </header>
  )
}

export default Header