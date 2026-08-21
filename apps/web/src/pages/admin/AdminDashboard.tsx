import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdmin } from '../../hooks/useAdmin'
import { Building2, Users, UserPlus, Settings, Shield, Sparkles } from 'lucide-react'
import './AdminPages.css'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { organization, members, loading, loadData } = useAdmin()

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="xirv-admin-dashboard">
        <div className="xirv-loading">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="xirv-admin-dashboard">
      <section className="xirv-admin-hero">
        <div>
          <h1>
            <Shield size={28} style={{ display: 'inline', marginRight: '12px' }} />
            Admin Dashboard
          </h1>
          <p>Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
        <Link to="/admin/members" className="xirv-hero-btn">
          <Sparkles size={18} style={{ display: 'inline', marginRight: '8px' }} />
          Manage Members
        </Link>
      </section>

      <div className="xirv-admin-stats">
        <div className="xirv-stat-card">
          <div className="xirv-stat-icon organization">
            <Building2 size={24} />
          </div>
          <div className="xirv-stat-content">
            <span className="xirv-stat-value">{organization?.name || 'N/A'}</span>
            <span className="xirv-stat-label">Organization</span>
          </div>
        </div>

        <div className="xirv-stat-card">
          <div className="xirv-stat-icon members">
            <Users size={24} />
          </div>
          <div className="xirv-stat-content">
            <span className="xirv-stat-value">{members.length}</span>
            <span className="xirv-stat-label">Members</span>
          </div>
        </div>

        <div className="xirv-stat-card">
          <div className="xirv-stat-icon invites">
            <UserPlus size={24} />
          </div>
          <div className="xirv-stat-content">
            <span className="xirv-stat-value">0</span>
            <span className="xirv-stat-label">Pending Invites</span>
          </div>
        </div>

        <div className="xirv-stat-card">
          <div className="xirv-stat-icon role">
            <Settings size={24} />
          </div>
          <div className="xirv-stat-content">
            <span className="xirv-stat-value">{organization?.role || 'ADMIN'}</span>
            <span className="xirv-stat-label">Your Role</span>
          </div>
        </div>
      </div>

      <h2 className="xirv-admin-section-title">Quick Actions</h2>
      <div className="xirv-admin-grid">
        <Link to="/admin/members" className="xirv-admin-card">
          <Users size={28} />
          <h3>Members</h3>
          <p>Manage your organization members</p>
          <span className="xirv-card-action">View Members →</span>
        </Link>

        <Link to="/admin/invite" className="xirv-admin-card">
          <UserPlus size={28} />
          <h3>Invite Users</h3>
          <p>Invite new members to your organization</p>
          <span className="xirv-card-action">Invite →</span>
        </Link>

        <Link to="/admin/teams" className="xirv-admin-card">
          <Users size={28} />
          <h3>Teams</h3>
          <p>Create and manage teams</p>
          <span className="xirv-card-action">Manage Teams →</span>
        </Link>

        <Link to="/admin/settings" className="xirv-admin-card">
          <Settings size={28} />
          <h3>Settings</h3>
          <p>Update organization settings</p>
          <span className="xirv-card-action">Settings →</span>
        </Link>
      </div>
    </div>
  )
}