import { useNavigate } from "react-router-dom"
import { Rocket, BookOpen, BarChart3, Settings } from 'lucide-react'
import "./QuickActions.css"

function QuickActions() {
  const navigate = useNavigate()

  return (
    <section className="quick-actions">
      <h2>Quick Actions</h2>
      <div className="quick-actions-grid">
        <button onClick={() => navigate("/ai")}>
          <Rocket size={24} />
          Launch AI
        </button>
        <button onClick={() => navigate("/knowledge")}>
          <BookOpen size={24} />
          Knowledge Base
        </button>
        <button onClick={() => navigate("/analytics")}>
          <BarChart3 size={24} />
          Analytics
        </button>
        <button onClick={() => navigate("/settings")}>
          <Settings size={24} />
          Settings
        </button>
      </div>
    </section>
  )
}

export default QuickActions