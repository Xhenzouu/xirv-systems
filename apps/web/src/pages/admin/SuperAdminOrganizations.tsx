import { useState } from 'react'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'
import { Building2, Users, Calendar, Plus, Edit, Trash2 } from 'lucide-react'
import { CreateOrgModal } from '../../components/admin/CreateOrgModal'
import { EditOrgModal } from '../../components/admin/EditOrgModal'
import { DeleteOrgModal } from '../../components/admin/DeleteOrgModal'
import './SuperAdmin.css'

export default function SuperAdminOrganizations() {
  const { organizations, loading, createOrganization, updateOrganization, deleteOrganization } = useSuperAdmin()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<any>(null)

  if (loading) {
    return <div className="xirv-loading">Loading organizations...</div>
  }

  return (
    <div className="xirv-super-admin-page">
      <div className="xirv-page-header">
        <div>
          <h1>
            <Building2 size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
            Organizations
          </h1>
          <p>Manage all organizations in the system</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="xirv-btn-primary">
          <Plus size={16} style={{ display: 'inline', marginRight: '6px' }} />
          New Organization
        </button>
      </div>

      {organizations.length === 0 ? (
        <div className="xirv-empty-state">
          <p>No organizations found</p>
        </div>
      ) : (
        <div className="xirv-org-grid">
          {organizations.map((org) => (
            <div key={org.id} className="xirv-org-card">
              <div className="xirv-org-header">
                <h3>{org.name}</h3>
                <span className="xirv-org-slug">/{org.slug}</span>
              </div>
              {org.description && <p>{org.description}</p>}
              <div className="xirv-org-meta">
                <span>
                  <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {org.members?.length || 0} members
                </span>
                <span>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Created {new Date(org.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="xirv-org-actions">
                <button
                  onClick={() => {
                    setSelectedOrg(org)
                    setShowEditModal(true)
                  }}
                  className="xirv-btn-secondary"
                >
                  <Edit size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedOrg(org)
                    setShowDeleteModal(true)
                  }}
                  className="xirv-btn-danger"
                >
                  <Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateOrgModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createOrganization}
      />

      <EditOrgModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedOrg(null)
        }}
        organization={selectedOrg}
        onUpdate={updateOrganization}
      />

      <DeleteOrgModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedOrg(null)
        }}
        organization={selectedOrg}
        onDelete={deleteOrganization}
      />
    </div>
  )
}