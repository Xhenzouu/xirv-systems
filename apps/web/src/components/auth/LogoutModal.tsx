import { LogOut, X } from 'lucide-react'
import './LogoutModal.css'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoggingOut?: boolean
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut = false,
}: LogoutModalProps) {
  if (!isOpen) return null

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="logout-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="logout-modal-icon">
          <LogOut size={40} />
        </div>

        <h2>Confirm Logout</h2>
        <p>Are you sure you want to sign out of your account?</p>

        <div className="logout-modal-actions">
          <button
            className="logout-modal-btn logout-modal-btn-cancel"
            onClick={onClose}
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button
            className="logout-modal-btn logout-modal-btn-confirm"
            onClick={onConfirm}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}