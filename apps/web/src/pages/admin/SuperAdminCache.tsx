import { Trash2 } from 'lucide-react'
import { CacheControls } from '../../components/admin/CacheControls'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'

export default function SuperAdminCache() {
  const { clearCache, loadData } = useSuperAdmin()

  return (
    <div className="xirv-super-admin-page">
      <div className="xirv-page-header">
        <h1>
          <Trash2 size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          Cache Management
        </h1>
        <p>Manage Redis cache and data freshness</p>
      </div>
      <CacheControls onClearCache={clearCache} onRefresh={loadData} />
    </div>
  )
}