export interface Workflow {
  id: string
  name: string
  description: string | null
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  triggerType: 'MANUAL' | 'SCHEDULED' | 'EVENT' | 'WEBHOOK'
  triggerConfig: any
  definition: any
  isTemplate: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  creator?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  instances?: WorkflowInstance[]
  _count?: {
    tasks: number
  }
}

export interface WorkflowInstance {
  id: string
  workflowId: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  context: any
  startedAt: string
  completedAt: string | null
  createdBy: string
  workflow?: {
    id: string
    name: string
  }
  tasks?: Task[]
  _count?: {
    tasks: number
  }
}

export interface Task {
  id: string
  instanceId: string
  workflowId: string
  title: string
  description: string | null
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED'
  assignedTo: string | null
  dueDate: string | null
  priority: number
  metadata: any
  createdAt: string
  updatedAt: string
  completedAt: string | null
  assignee?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  instance?: {
    workflow: {
      id: string
      name: string
    }
  }
  approvals?: Approval[]
}

export interface Approval {
  id: string
  taskId: string
  approverId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  comment: string | null
  requestedAt: string
  respondedAt: string | null
  approver?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface CreateWorkflowData {
  name: string
  description?: string
  triggerType?: 'MANUAL' | 'SCHEDULED' | 'EVENT' | 'WEBHOOK'
  triggerConfig?: any
  definition: any
  isTemplate?: boolean
}

export interface UpdateWorkflowData {
  name?: string
  description?: string
  triggerType?: 'MANUAL' | 'SCHEDULED' | 'EVENT' | 'WEBHOOK'
  triggerConfig?: any
  definition?: any
}

export interface ListResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}