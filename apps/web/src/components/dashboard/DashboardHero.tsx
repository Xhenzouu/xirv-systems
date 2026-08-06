import "./DashboardHero.css"
import Button from "../ui/Button"
import { getGreeting } from "../../utils/greeting"

function DashboardHero() {
  return (
    <section className="dashboard-hero">
      <div>
        <h1>{getGreeting()}, Brix</h1>

        <p>Welcome back to XIRV Systems.</p>

        <p>Your enterprise intelligence platform is ready.</p>
      </div>

      <Button>
        Launch AI Workspace
      </Button>
    </section>
  )
}

export default DashboardHero