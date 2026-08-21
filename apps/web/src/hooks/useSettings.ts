import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from './useToast'
import { authApi } from '../api'
import api from '../api/client'

export function useSettings() {
  const { user } = useAuth()
  const toast = useToast()

  // Profile
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  // Password
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

  // Email Verification
  const [verificationStatus, setVerificationStatus] = useState<boolean | null>(null)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setEmail(user.email || '')
      loadVerificationStatus()
    }
  }, [user])

  const loadVerificationStatus = async () => {
    try {
      setVerificationLoading(true)
      const status = await authApi.getVerificationStatus()
      setVerificationStatus(status.isVerified)
    } catch (error) {
      console.error('Failed to load verification status:', error)
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!user) return
    setResending(true)
    setVerifyMessage(null)

    try {
      await authApi.resendVerification(user.email)
      setVerifyMessage('✅ Verification email sent! Please check your inbox.')
      toast.success('Verification email sent!')
    } catch (error: any) {
      setVerifyMessage(`❌ ${error.response?.data?.message || 'Failed to resend verification email'}`)
      toast.error(error.response?.data?.message || 'Failed to resend verification email')
    } finally {
      setResending(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProfileLoading(true)
    toast.loading('Updating profile...')

    try {
      await api.patch('/users/profile', { firstName, lastName, email })
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

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await api.patch('/users/password', { currentPassword, newPassword })
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
      await api.delete('/users/account', { data: { password: deletePassword } })
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

  return {
    // Profile
    firstName,
    lastName,
    email,
    setFirstName,
    setLastName,
    setEmail,
    isProfileLoading,
    handleProfileUpdate,

    // Password
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

    // Delete
    deleteConfirm,
    deletePassword,
    setDeleteConfirm,
    setDeletePassword,
    isDeleteLoading,
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteAccount,

    // Verification
    verificationStatus,
    verificationLoading,
    resending,
    verifyMessage,
    handleResendVerification,
  }
}