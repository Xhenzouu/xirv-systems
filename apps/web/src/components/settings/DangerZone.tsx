import { Trash2 } from 'lucide-react'
import '../../pages/Settings.css'

interface DangerZoneProps {
  setShowDeleteModal: (value: boolean) => void
}

export function DangerZone({ setShowDeleteModal }: DangerZoneProps) {
  return (
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
  )
}