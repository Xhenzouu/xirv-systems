import Card from "../ui/Card"
import StatusBadge from "../ui/StatusBadge"

interface MetricCardProps {
  title: string
  value: string
  status?: "active" | "inactive" | "warning"
}

function MetricCard({
  title,
  value,
  status,
}: MetricCardProps) {

  return (
    <Card
      title={title}
      headerAction={
        status && (
          <StatusBadge status={status} />
        )
      }
    >

      <h2>
        {value}
      </h2>

    </Card>
  )
}

export default MetricCard