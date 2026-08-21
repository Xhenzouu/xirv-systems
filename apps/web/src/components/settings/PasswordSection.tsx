import { Lock, Key, Eye, EyeOff } from 'lucide-react'
import '../../pages/Settings.css'

interface PasswordSectionProps {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  setCurrentPassword: (value: string) => void
  setNewPassword: (value: string) => void
  setConfirmPassword: (value: string) => void
  isPasswordLoading: boolean
  handlePasswordChange: (e: React.FormEvent<HTMLFormElement>) => void
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
  setShowCurrentPassword: (value: boolean) => void
  setShowNewPassword: (value: boolean) => void
  setShowConfirmPassword: (value: boolean) => void
}

export function PasswordSection({
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  isPasswordLoading,
  handlePasswordChange,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  setShowCurrentPassword,
  setShowNewPassword,
  setShowConfirmPassword,
}: PasswordSectionProps) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-title">
          <Lock size={20} />
          <h2>Change Password</h2>
        </div>
      </div>

      <form onSubmit={handlePasswordChange} className="settings-form">
        <div className="settings-form-group">
          <label>Current Password</label>
          <div className="settings-input-with-icon">
            <Key size={18} />
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              required
            />
            <button
              type="button"
              className="settings-password-toggle"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="settings-form-group">
          <label>New Password</label>
          <div className="settings-input-with-icon">
            <Lock size={18} />
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
              required
            />
            <button
              type="button"
              className="settings-password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="settings-form-group">
          <label>Confirm New Password</label>
          <div className="settings-input-with-icon">
            <Lock size={18} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              className="settings-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="settings-btn settings-btn-primary"
          disabled={isPasswordLoading}
        >
          <Key size={16} />
          {isPasswordLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}