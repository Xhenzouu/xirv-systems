import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { LogOut } from 'lucide-react'
import LogoutModal from '../auth/LogoutModal'
import './UserProfile.css'

function UserProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      toast.success('Logged out successfully')
      setShowLogoutModal(false)
      navigate('/login')
    } catch (error) {
      toast.error('Failed to logout')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    return (
      <div className="xirv-user-profile">
        <a href="/login" className="xirv-user-login">Sign In</a>
      </div>
    )
  }

  return (
    <>
      <div className="xirv-user-profile">
        <span className="xirv-user-name">
          {user.firstName} {user.lastName}
        </span>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="xirv-user-logout"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  )
}

export default UserProfile