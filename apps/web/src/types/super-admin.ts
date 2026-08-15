export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  createdAt: string
  updatedAt: string
  _count: {
    documents: number
    refreshTokens: number
    auditLogs: number
    createdWorkflows: number
    assignedTasks: number
    approvals: number
  }
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  details: any
  createdAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface SystemStatus {
  status: string
  uptime: number
  memory: {
    rss: number
    heapTotal: number
    heapUsed: number
    external: number
    arrayBuffers: number
  }
  nodeVersion: string
  environment: string
  timestamp: string
}