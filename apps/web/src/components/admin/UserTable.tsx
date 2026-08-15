import { useState } from 'react'
import { Search, RefreshCw, User, Mail, Calendar } from 'lucide-react'
import type { User as UserType } from '../../types/super-admin'
import './AdminComponents.css'

interface UserTableProps {
  users: UserType[]
  updating: string | null
  onRoleUpdate: (userId: string, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN') => void
  onRefresh: () => void
}

export function UserTable({ users, updating, onRoleUpdate, onRefresh }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'xirv-role-super'
      case 'ADMIN': return 'xirv-role-admin'
      default: return 'xirv-role-user'
    }
  }

  return (
    <div className="xirv-user-table-container">
      <div className="xirv-user-table-header">
        <div className="xirv-user-table-search">
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onRefresh} className="xirv-btn-secondary">
            <RefreshCw size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Refresh
          </button>
        </div>
        <span className="xirv-user-count">
          <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
          {users.length} users
        </span>
      </div>

      <div className="xirv-user-table-wrapper">
        <table className="xirv-user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Documents</th>
              <th>Workflows</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="xirv-user-name">
                    <User size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--text-secondary)' }} />
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="xirv-user-date">
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <Mail size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--text-secondary)' }} />
                  {user.email}
                </td>
                <td>
                  <span className={`xirv-role-badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user._count.documents}</td>
                <td>{user._count.createdWorkflows}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => onRoleUpdate(user.id, e.target.value as any)}
                    disabled={updating === user.id}
                    className="xirv-role-select"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                  {updating === user.id && <span className="xirv-spinner">⏳</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="xirv-empty-state">
          <p>No users found</p>
        </div>
      )}
    </div>
  )
}