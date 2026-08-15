import type { SystemStatus as SystemStatusType } from '../../types/super-admin'
import './AdminComponents.css'

interface SystemStatusProps {
  status: SystemStatusType | null
}

export function SystemStatus({ status }: SystemStatusProps) {
  if (!status) return null

  const cards = [
    {
      label: 'System Status',
      value: status.status,
      className: status.status === 'healthy' ? 'healthy' : 'warning',
    },
    {
      label: 'Uptime',
      value: `${Math.floor(status.uptime / 60)} minutes`,
    },
    {
      label: 'Node Version',
      value: status.nodeVersion,
    },
    {
      label: 'Environment',
      value: status.environment,
    },
  ]

  return (
    <div className="xirv-system-status-cards">
      {cards.map((card, index) => (
        <div key={index} className="xirv-status-card">
          <div className="xirv-status-label">{card.label}</div>
          <div className={`xirv-status-value ${card.className || ''}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  )
}