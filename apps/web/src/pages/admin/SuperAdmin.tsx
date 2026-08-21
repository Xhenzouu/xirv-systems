import { Link } from 'react-router-dom'
import { Shield, Users, FileText, Settings, Trash2, Sparkles, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'
import { SystemStatus } from '../../components/admin/SystemStatus'
import './SuperAdmin.css'

export default function SuperAdmin() {
  const { user } = useAuth()
  const { loading, systemStatus, totalUsers, totalLogs, totalOrgs } = useSuperAdmin()

  if (loading) {
    return (
      <div className="xirv-super-admin">
        <div className="xirv-loading">Loading SUPER_ADMIN dashboard...</div>
      </div>
    )
  }

  return (
    <div className="xirv-super-admin">
      {/* Hero Section */}
      <section className="xirv-super-admin-hero">
        <div>
          <h1>
            <Shield size={28} style={{ display: 'inline', marginRight: '12px' }} />
            SUPER_ADMIN Dashboard
          </h1>
          <p>Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
        <Link to="/super-admin/users" className="xirv-hero-btn">
          <Sparkles size={18} style={{ display: 'inline', marginRight: '8px' }} />
          Manage Users
        </Link>
      </section>

      {/* System Status Cards */}
      <SystemStatus status={systemStatus} />

      {/* Quick Stats Cards */}
      <div className="xirv-admin-stats">
        <div className="xirv-stat-card">
          <div className="xirv-stat-icon users">
            <Users size={24} />
          </div>
          <div className="xirv-stat-content">
            <span className="xirv-stat-value">{totalUsers}</span>
            <span className="xirv-stat-label">Total Users</span>
          </div>
        </div>
        <div className="xirv-stat-card">
          <div className="xirv-stat-icon logs">
            <FileText size={24} />
          </div>
          <div className="xirv-stat-content">
            <span className="xirv-stat-value">{totalLogs}</span>
            <span className="xirv-stat-label">Audit Logs</span>
          </div>
        </div>
        <div className="xirv-stat-card">
          <div className="xirv-stat-icon system">
            <Settings size={24} />
          </div>
          <div className="xirv-stat-content">
            <span className="xirv-stat-value">{systemStatus?.nodeVersion || 'N/A'}</span>
            <span className="xirv-stat-label">Node Version</span>
          </div>
        </div>
        <div className="xirv-stat-card">
          <div className="xirv-stat-icon cache">
            <Building2 size={24} />
          </div>
          <div className="xirv-stat-content">
            <span className="xirv-stat-value">{totalOrgs}</span>
            <span className="xirv-stat-label">Organizations</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <h2 className="xirv-admin-section-title">Quick Actions</h2>
      <div className="xirv-super-admin-grid">
        <Link to="/super-admin/users" className="xirv-super-admin-card">
          <Users size={28} />
          <h3>User Management</h3>
          <p>Manage all users and roles</p>
          <span className="xirv-card-action">View Users →</span>
        </Link>

        <Link to="/super-admin/audit-logs" className="xirv-super-admin-card">
          <FileText size={28} />
          <h3>Audit Logs</h3>
          <p>View system activity</p>
          <span className="xirv-card-action">View Logs →</span>
        </Link>

        <Link to="/super-admin/system" className="xirv-super-admin-card">
          <Settings size={28} />
          <h3>System Info</h3>
          <p>View system status</p>
          <span className="xirv-card-action">View Info →</span>
        </Link>

        <Link to="/super-admin/cache" className="xirv-super-admin-card">
          <Trash2 size={28} />
          <h3>Cache Management</h3>
          <p>Clear Redis cache</p>
          <span className="xirv-card-action">Clear Cache →</span>
        </Link>
      </div>
    </div>
  )
}