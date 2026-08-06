import { useNavigate } from "react-router-dom"

import "./QuickActions.css"

function QuickActions() {

  const navigate = useNavigate()

  return (
    <section className="quick-actions">

      <h2>Quick Actions</h2>

      <div className="quick-actions-grid">

        <button onClick={() => navigate("/ai")}>
          🚀 Launch AI
        </button>

        <button onClick={() => navigate("/knowledge")}>
          📚 Knowledge Base
        </button>

        <button onClick={() => navigate("/analytics")}>
          📊 Analytics
        </button>

        <button onClick={() => navigate("/settings")}>
          ⚙️ Settings
        </button>

      </div>

    </section>
  )

}

export default QuickActions