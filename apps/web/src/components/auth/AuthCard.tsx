import "./AuthCard.css"

interface AuthCardProps {
  children: React.ReactNode
}

function AuthCard({
  children,
}: AuthCardProps) {

  return (
    <section className="auth-card">

      {children}

    </section>
  )

}

export default AuthCard