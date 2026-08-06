import "./StatusBadge.css"

interface StatusBadgeProps {
  status: "active" | "inactive" | "warning"
}

function StatusBadge({
  status,
}: StatusBadgeProps) {

  return (
    <span className={`status-badge ${status}`}>
      {status}
    </span>
  )
}

export default StatusBadge