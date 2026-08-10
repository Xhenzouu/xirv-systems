import { useEffect, useState } from 'react'
import { documentApi } from '../api'
import SystemOverview from '../components/dashboard/SystemOverview'
import MetricCard from '../components/dashboard/MetricCard'
import ActivityPanel from '../components/dashboard/ActivityPanel'
import DashboardHero from '../components/dashboard/DashboardHero'
import QuickActions from '../components/dashboard/QuickActions'
import './Dashboard.css'

function Dashboard() {
  const [documentCount, setDocumentCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await documentApi.list()
        setDocumentCount(docs.total || 0)
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="dashboard">
      <DashboardHero />

      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Here's what's happening with your XIRV Systems platform.</p>
      </header>

      <SystemOverview />

      <div className="dashboard-metrics">
        <MetricCard
          title="AI Engine"
          value={isLoading ? 'Loading...' : 'Online'}
          status="active"
        />

        <MetricCard
          title="Knowledge Base"
          value={isLoading ? 'Loading...' : `${documentCount} Records`}
          status={documentCount > 0 ? 'active' : 'inactive'}
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