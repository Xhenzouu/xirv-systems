import { useAuth } from "../../context/AuthContext"
import { getGreeting } from "../../utils/greeting"
import Button from "../ui/Button"
import "./DashboardHero.css"

function DashboardHero() {
  const { user } = useAuth()

  return (
    <section className="dashboard-hero">
      <div>
        <h1>
          {getGreeting()}, {user?.firstName || "User"}!
        </h1>
        <p>Welcome back to XIRV Systems.</p>
        <p>Your enterprise intelligence platform is ready.</p>
      </div>

      <Button>Launch AI Workspace</Button>
    </section>
  )
}

export default DashboardHero