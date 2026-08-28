import Card from "../ui/Card"
import StatusBadge from "../ui/StatusBadge"
import { Cpu, Database, Heart, Building2 } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  status?: "active" | "inactive" | "warning"
  icon?: React.ReactNode
  subtitle?: string  // NEW: for role or additional info
}

function MetricCard({
  title,
  value,
  status,
  icon,
  subtitle,
}: MetricCardProps) {
  // Map title to icon if not provided
  const getIcon = () => {
    if (icon) return icon
    if (title.includes("AI")) return <Cpu size={24} />
    if (title.includes("Knowledge")) return <Database size={24} />
    if (title.includes("Health") || title.includes("System")) return <Heart size={24} />
    if (title.includes("Organization")) return <Building2 size={24} />
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
        <div>
          <h2>{value}</h2>
          {subtitle && (
            <span className="metric-card-subtitle">{subtitle}</span>
          )}
        </div>
      </div>
    </Card>
  )
}

export default MetricCard