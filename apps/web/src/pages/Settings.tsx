import { useSettings } from '../hooks/useSettings'
import { ProfileSection } from '../components/settings/ProfileSection'
import { PasswordSection } from '../components/settings/PasswordSection'
import { DangerZone } from '../components/settings/DangerZone'
import { DeleteAccountModal } from '../components/settings/DeleteAccountModal'
import './Settings.css'

function Settings() {
  const {
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
  } = useSettings()

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        <ProfileSection
          firstName={firstName}
          lastName={lastName}
          email={email}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          isProfileLoading={isProfileLoading}
          handleProfileUpdate={handleProfileUpdate}
          verificationStatus={verificationStatus}
          verificationLoading={verificationLoading}
          resending={resending}
          verifyMessage={verifyMessage}
          handleResendVerification={handleResendVerification}
        />

        <PasswordSection
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          isPasswordLoading={isPasswordLoading}
          handlePasswordChange={handlePasswordChange}
          showCurrentPassword={showCurrentPassword}
          showNewPassword={showNewPassword}
          showConfirmPassword={showConfirmPassword}
          setShowCurrentPassword={setShowCurrentPassword}
          setShowNewPassword={setShowNewPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />

        <DangerZone setShowDeleteModal={setShowDeleteModal} />
      </div>

      <DeleteAccountModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        deletePassword={deletePassword}
        setDeletePassword={setDeletePassword}
        isDeleteLoading={isDeleteLoading}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}

export default Settings