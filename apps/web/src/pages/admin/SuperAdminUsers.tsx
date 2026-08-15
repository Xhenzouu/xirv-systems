import { Users } from 'lucide-react'
import { UserTable } from '../../components/admin/UserTable'
import { useSuperAdmin } from '../../hooks/useSuperAdmin'

export default function SuperAdminUsers() {
  const { users, updating, loadData, updateUserRole } = useSuperAdmin()

  return (
    <div className="xirv-super-admin-page">
      <div className="xirv-page-header">
        <h1>
          <Users size={28} style={{ display: 'inline', marginRight: '12px', color: 'var(--xirv-accent)' }} />
          User Management
        </h1>
        <p>Manage all users and their roles</p>
      </div>
      <UserTable
        users={users}
        updating={updating}
        onRoleUpdate={updateUserRole}
        onRefresh={loadData}
      />
    </div>
  )
}