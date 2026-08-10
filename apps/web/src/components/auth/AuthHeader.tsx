import './AuthHeader.css'

interface AuthHeaderProps {
  title: string
  subtitle: string
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="auth-header">
      <div className="auth-header-logo">
        <span className="auth-header-logo-text">XIRV</span>
        <span className="auth-header-logo-sub">Systems</span>
      </div>
      <h1 className="auth-header-title">{title}</h1>
      <p className="auth-header-subtitle">{subtitle}</p>
    </div>
  )
}