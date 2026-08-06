import Panel from "../ui/Panel"
import { dashboardActivity } from "../../services/dashboard"

function ActivityPanel() {
  return (
    <Panel title="Recent Activity">
      <ul className="activity-list">
        {dashboardActivity.map((activity) => (
          <li key={activity.id}>
            <strong>{activity.message}</strong>
            <span>{activity.time}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export default ActivityPanel