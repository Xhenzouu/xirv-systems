import type { AuditLog } from '../../types/super-admin'
import './AdminComponents.css'

interface AuditLogsProps {
  logs: AuditLog[]
  total: number
}

export function AuditLogs({ logs, total }: AuditLogsProps) {
  return (
    <div className="xirv-audit-logs">
      <div className="xirv-audit-logs-header">
        <h3>Recent Activity</h3>
        <span className="xirv-log-count">{total} total</span>
      </div>

      {logs.length === 0 ? (
        <div className="xirv-empty-state">
          <p>No audit logs found</p>
        </div>
      ) : (
        <div className="xirv-audit-log-list">
          {logs.map((log) => (
            <div key={log.id} className="xirv-audit-log-item">
              <div className="xirv-audit-log-user">
                {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}
              </div>
              <div className="xirv-audit-log-action">{log.action}</div>
              <div className="xirv-audit-log-time">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}