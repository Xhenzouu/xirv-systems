import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { User, Mail, Lock, Key, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import api from '../api/client'
import './Settings.css'

function Settings() {
  const { user } = useAuth()
  const toast = useToast()
  
  // Profile form
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProfileLoading(true)
    toast.loading('Updating profile...')

    try {
      await api.patch('/users/profile', {
        firstName,
        lastName,
        email,
      })
      
      toast.success('Profile updated successfully!')
      
      try {
        const response = await api.get('/users/profile')
        const updatedUser = response.data.data
        setFirstName(updatedUser.firstName)
        setLastName(updatedUser.lastName)
        setEmail(updatedUser.email)
      } catch {
        // If we can't refresh, just keep the current values
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsPasswordLoading(true)
    toast.loading('Changing password...')

    try {
      await api.patch('/users/password', {
        currentPassword,
        newPassword,
      })
      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm')
      return
    }

    if (!deletePassword) {
      toast.error('Please enter your password')
      return
    }

    setIsDeleteLoading(true)
    toast.loading('Deleting account...')

    try {
      await api.delete('/users/account', {
        data: { password: deletePassword }
      })
      toast.success('Account deleted successfully')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account')
      setIsDeleteLoading(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile Section */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-title">
              <User size={20} />
              <h2>Profile</h2>
            </div>
          </div>
          <form onSubmit={handleProfileUpdate} className="settings-form">
            <div className="settings-form-group">
              <label>First Name</label>
              <div className="settings-input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
            </div>
            <div className="settings-form-group">
              <label>Last Name</label>
              <div className="settings-input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div className="settings-form-group">
              <label>Email</label>
              <div className="settings-input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="settings-btn settings-btn-primary"
              disabled={isProfileLoading}
            >
              <Save size={16} />
              {isProfileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Section */}
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

        {/* Danger Zone */}
        <div className="settings-card settings-card-danger">
          <div className="settings-card-header">
            <div className="settings-card-title settings-card-title-danger">
              <Trash2 size={20} />
              <h2>Danger Zone</h2>
            </div>
          </div>
          <div className="settings-danger-content">
            <p>Once you delete your account, there is no going back. This action is permanent and irreversible.</p>
            <button
              className="settings-btn settings-btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>Delete Account</h2>
              <button className="settings-modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="settings-modal-body">
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <p className="settings-modal-warning">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="settings-modal-input"
              />
              <p className="settings-modal-warning" style={{ marginTop: 'var(--space-md)' }}>
                Enter your password:
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your password"
                className="settings-modal-input"
              />
            </div>
            <div className="settings-modal-footer">
              <button
                className="settings-btn settings-btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirm('')
                  setDeletePassword('')
                }}
              >
                Cancel
              </button>
              <button
                className="settings-btn settings-btn-danger"
                onClick={handleDeleteAccount}
                disabled={isDeleteLoading || deleteConfirm !== 'DELETE' || !deletePassword}
              >
                {isDeleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings