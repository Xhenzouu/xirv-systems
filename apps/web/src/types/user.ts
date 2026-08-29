export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isEmailVerified?: boolean
  avatar?: string | null
  bio?: string | null
  phone?: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    documents: number
    refreshTokens: number
    auditLogs: number
    createdWorkflows: number
    assignedTasks: number
    approvals: number
  }
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string | null
  bio?: string | null
  phone?: string | null
}