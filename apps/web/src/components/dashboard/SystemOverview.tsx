import Panel from "../ui/Panel"
import { CheckCircle } from 'lucide-react'

function SystemOverview() {
  return (
    <Panel title="System Overview">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <CheckCircle size={20} style={{ color: '#22c55e' }} />
        <p style={{ margin: 0 }}>
          XIRV intelligence platform is operating normally.
        </p>
      </div>
    </Panel>
  )
}

export default SystemOverview