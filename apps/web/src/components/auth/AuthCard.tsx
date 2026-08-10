import './AuthCard.css'

interface AuthCardProps {
  children: React.ReactNode
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="auth-card">
      <div className="auth-card-content">
        {children}
      </div>
    </div>
  )
}