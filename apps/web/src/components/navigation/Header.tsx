import { useAuth } from "../../context/AuthContext"
import { LogOut, Sun, Moon, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import "./Header.css"

function Header() {
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="xirv-header">
      <div className="xirv-header-left">
        <User size={20} className="xirv-header-icon" />
        <span className="xirv-header-username">
          {user?.firstName || 'User'} {user?.lastName || ''}
        </span>
      </div>

      <div className="xirv-header-actions">
        <button
          onClick={toggleTheme}
          className="xirv-header-btn"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={handleLogout}
          className="xirv-header-btn xirv-header-btn-logout"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}

export default Header