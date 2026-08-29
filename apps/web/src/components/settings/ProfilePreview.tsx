import { Calendar, Mail, Phone, FileText } from 'lucide-react'
import '../../pages/Settings.css'

interface ProfilePreviewProps {
  firstName: string
  lastName: string
  email: string
  role?: string
  bio?: string
  phone?: string
  memberSince?: string
}

export function ProfilePreview({
  firstName,
  lastName,
  email,
  role,
  bio,
  phone,
  memberSince,
}: ProfilePreviewProps) {
  const fullName = `${firstName} ${lastName}`.trim() || 'User'
  const initial = fullName.charAt(0).toUpperCase()

  return (
    <div className="profile-preview">
      <div className="profile-preview-avatar">
        <div className="profile-preview-avatar-placeholder">
          {initial}
        </div>
      </div>
      <div className="profile-preview-info">
        <h3 className="profile-preview-name">{fullName}</h3>
        {role && (
          <span className="profile-preview-role">{role}</span>
        )}
        <div className="profile-preview-details">
          {email && (
            <span className="profile-preview-detail">
              <Mail size={14} />
              {email}
            </span>
          )}
          {phone && (
            <span className="profile-preview-detail">
              <Phone size={14} />
              {phone}
            </span>
          )}
          {memberSince && (
            <span className="profile-preview-detail">
              <Calendar size={14} />
              Member since {memberSince}
            </span>
          )}
        </div>
        {bio && (
          <div className="profile-preview-bio">
            <FileText size={14} className="profile-preview-bio-icon" />
            <p>{bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}