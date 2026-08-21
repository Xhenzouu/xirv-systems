import '../../pages/Settings.css'

interface DeleteAccountModalProps {
  showDeleteModal: boolean
  setShowDeleteModal: (value: boolean) => void
  deleteConfirm: string
  setDeleteConfirm: (value: string) => void
  deletePassword: string
  setDeletePassword: (value: string) => void
  isDeleteLoading: boolean
  handleDeleteAccount: () => void
}

export function DeleteAccountModal({
  showDeleteModal,
  setShowDeleteModal,
  deleteConfirm,
  setDeleteConfirm,
  deletePassword,
  setDeletePassword,
  isDeleteLoading,
  handleDeleteAccount,
}: DeleteAccountModalProps) {
  if (!showDeleteModal) return null

  return (
    <div className="settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h2>Delete Account</h2>
          <button className="settings-modal-close" onClick={() => setShowDeleteModal(false)}>
            ×
          </button>
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
  )
}