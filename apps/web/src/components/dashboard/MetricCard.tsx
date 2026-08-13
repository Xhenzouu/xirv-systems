import Card from "../ui/Card"
import StatusBadge from "../ui/StatusBadge"
import { Cpu, Database, Heart } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  status?: "active" | "inactive" | "warning"
  icon?: React.ReactNode
}

function MetricCard({
  title,
  value,
  status,
  icon,
}: MetricCardProps) {
  // Map title to icon if not provided
  const getIcon = () => {
    if (icon) return icon
    if (title.includes("AI")) return <Cpu size={24} />
    if (title.includes("Knowledge")) return <Database size={24} />
    if (title.includes("Health")) return <Heart size={24} />
    return null
  }

  return (
    <Card
      title={title}
      headerAction={
        status && (
          <StatusBadge status={status} />
        )
      }
    >
      <div className="metric-card-content">
        <div className="metric-icon">
          {getIcon()}
        </div>
        <h2>{value}</h2>
      </div>
    </Card>
  )
}

export default MetricCard