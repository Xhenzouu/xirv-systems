import "./Dashboard.css"

import SystemOverview from "../components/dashboard/SystemOverview"
import MetricCard from "../components/dashboard/MetricCard"
import ActivityPanel from "../components/dashboard/ActivityPanel"
import DashboardHero from "../components/dashboard/DashboardHero"
import QuickActions from "../components/dashboard/QuickActions"

function Dashboard() {
  return (
    <section className="dashboard">

      <DashboardHero />

      <header className="dashboard-header">

        <h1>
          XIRV Dashboard
        </h1>

        <p>
          Intelligence workspace overview.
        </p>

      </header>


      <SystemOverview />


      <div className="dashboard-metrics">

        <MetricCard
          title="AI Engine"
          value="Online"
          status="active"
        />


        <MetricCard
          title="Knowledge Base"
          value="0 Records"
          status="inactive"
        />


        <MetricCard
          title="System Health"
          value="100%"
          status="active"
        />

      </div>

      <QuickActions />

      <ActivityPanel />

    </section>
  )
}


export default Dashboard