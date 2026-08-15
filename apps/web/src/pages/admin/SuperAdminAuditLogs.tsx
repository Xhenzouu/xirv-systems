import { FileText } from 'lucide-react'
import { AuditLogs } from '../../components/admin/AuditLogs'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'

export default function SuperAdminAuditLogs() {
  const { auditLogs, totalLogs } = useSuperAdmin()

  return (
    <div className="xirv-super-admin-page">
      <div className="xirv-page-header">
        <h1>
          <FileText size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          Audit Logs
        </h1>
        <p>View all user activity and system events</p>
      </div>
      <AuditLogs logs={auditLogs} total={totalLogs} />
    </div>
  )
}