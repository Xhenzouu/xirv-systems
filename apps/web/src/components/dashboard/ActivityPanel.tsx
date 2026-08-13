import Panel from "../ui/Panel"
import { dashboardActivity } from "../../services/dashboard"
import { Activity, Clock } from 'lucide-react'
import "./ActivityPanel.css"

function ActivityPanel() {
  return (
    <Panel title="Recent Activity">
      <ul className="activity-list">
        {dashboardActivity.map((activity) => (
          <li key={activity.id}>
            <div className="activity-icon">
              <Activity size={16} />
            </div>
            <div className="activity-content">
              <strong>{activity.message}</strong>
              <span className="activity-time">
                <Clock size={12} />
                {activity.time}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export default ActivityPanel