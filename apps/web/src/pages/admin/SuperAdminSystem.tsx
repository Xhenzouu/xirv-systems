import { Server, Clock, Cpu, Activity, HardDrive } from 'lucide-react'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'

export default function SuperAdminSystem() {
  const { systemStatus } = useSuperAdmin()

  if (!systemStatus) {
    return <div className="xirv-loading">Loading system info...</div>
  }

  // Format uptime
  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="xirv-super-admin-page">
      {/* Header */}
      <div className="xirv-page-header">
        <h1>
          <Server size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          System Information
        </h1>
        <p>View system status and performance metrics</p>
      </div>

      {/* System Status Cards */}
      <div className="xirv-system-metrics">
        <div className="xirv-system-metric-card">
          <div className="xirv-system-metric-icon status">
            <Activity size={24} />
          </div>
          <div className="xirv-system-metric-content">
            <span className="xirv-system-metric-label">Status</span>
            <span className="xirv-system-metric-value healthy">{systemStatus.status}</span>
          </div>
        </div>

        <div className="xirv-system-metric-card">
          <div className="xirv-system-metric-icon uptime">
            <Clock size={24} />
          </div>
          <div className="xirv-system-metric-content">
            <span className="xirv-system-metric-label">Uptime</span>
            <span className="xirv-system-metric-value">{formatUptime(systemStatus.uptime)}</span>
          </div>
        </div>

        <div className="xirv-system-metric-card">
          <div className="xirv-system-metric-icon node">
            <Cpu size={24} />
          </div>
          <div className="xirv-system-metric-content">
            <span className="xirv-system-metric-label">Node Version</span>
            <span className="xirv-system-metric-value">{systemStatus.nodeVersion}</span>
          </div>
        </div>

        <div className="xirv-system-metric-card">
          <div className="xirv-system-metric-icon env">
            <Server size={24} />
          </div>
          <div className="xirv-system-metric-content">
            <span className="xirv-system-metric-label">Environment</span>
            <span className="xirv-system-metric-value">{systemStatus.environment}</span>
          </div>
        </div>
      </div>

      {/* Memory Details */}
      <div className="xirv-system-memory-section">
        <h2>
          <HardDrive size={20} style={{ display: 'inline', marginRight: '8px' }} />
          Memory Usage
        </h2>
        <div className="xirv-system-memory-grid">
          <div className="xirv-system-memory-card">
            <span className="xirv-system-memory-label">RSS (Resident Set Size)</span>
            <span className="xirv-system-memory-value">
              {systemStatus.memory ? `${Math.round(systemStatus.memory.rss / 1024 / 1024)} MB` : 'N/A'}
            </span>
          </div>
          <div className="xirv-system-memory-card">
            <span className="xirv-system-memory-label">Heap Total</span>
            <span className="xirv-system-memory-value">
              {systemStatus.memory ? `${Math.round(systemStatus.memory.heapTotal / 1024 / 1024)} MB` : 'N/A'}
            </span>
          </div>
          <div className="xirv-system-memory-card">
            <span className="xirv-system-memory-label">Heap Used</span>
            <span className="xirv-system-memory-value">
              {systemStatus.memory ? `${Math.round(systemStatus.memory.heapUsed / 1024 / 1024)} MB` : 'N/A'}
            </span>
          </div>
          <div className="xirv-system-memory-card">
            <span className="xirv-system-memory-label">External</span>
            <span className="xirv-system-memory-value">
              {systemStatus.memory ? `${Math.round(systemStatus.memory.external / 1024 / 1024)} MB` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="xirv-system-timestamp">
        <span>Last updated: {new Date(systemStatus.timestamp).toLocaleString()}</span>
      </div>
    </div>
  )
}