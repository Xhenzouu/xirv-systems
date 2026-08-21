import { CheckCircle, AlertCircle,  } from 'lucide-react'
import './VerificationBadge.css'

interface VerificationBadgeProps {
  isVerified: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function VerificationBadge({ isVerified, showLabel = true, size = 'md' }: VerificationBadgeProps) {
  const sizeMap = {
    sm: { icon: 14, text: 'text-xs' },
    md: { icon: 16, text: 'text-sm' },
    lg: { icon: 20, text: 'text-base' },
  }

  const sizes = sizeMap[size]

  return (
    <div className={`xirv-verification-badge xirv-verification-${isVerified ? 'verified' : 'unverified'}`}>
      {isVerified ? (
        <CheckCircle size={sizes.icon} />
      ) : (
        <AlertCircle size={sizes.icon} />
      )}
      {showLabel && (
        <span className={sizes.text}>
          {isVerified ? 'Verified' : 'Unverified'}
        </span>
      )}
    </div>
  )
}