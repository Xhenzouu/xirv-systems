import api from './client'
import type { 
  Workflow, 
  WorkflowInstance, 
  Task, 
  Approval,
  CreateWorkflowData,
  UpdateWorkflowData,
  ListResponse 
} from '../types/workflow'

// ============ WORKFLOWS ============

export async function listWorkflows(params?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<ListResponse<Workflow>> {
  const response = await api.get('/workflows', { params })
  return response.data.data
}

export async function getWorkflow(id: string): Promise<Workflow> {
  const response = await api.get(`/workflows/${id}`)
  return response.data.data
}

export async function createWorkflow(data: CreateWorkflowData): Promise<Workflow> {
  const response = await api.post('/workflows', data)
  return response.data.data
}

export async function updateWorkflow(id: string, data: UpdateWorkflowData): Promise<Workflow> {
  const response = await api.patch(`/workflows/${id}`, data)
  return response.data.data
}

export async function updateWorkflowStatus(id: string, status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'): Promise<Workflow> {
  const response = await api.patch(`/workflows/${id}/status`, { status })
  return response.data.data
}

export async function deleteWorkflow(id: string): Promise<void> {
  await api.delete(`/workflows/${id}`)
}

export async function executeWorkflow(id: string, context?: any): Promise<WorkflowInstance> {
  const response = await api.post(`/workflows/${id}/execute`, { context })
  return response.data.data
}

// ============ INSTANCES ============

export async function listInstances(params?: {
  workflowId?: string
  status?: string
  limit?: number
  offset?: number
}): Promise<ListResponse<WorkflowInstance>> {
  const response = await api.get('/workflows/instances', { params })
  return response.data.data
}

export async function getInstance(id: string): Promise<WorkflowInstance> {
  const response = await api.get(`/workflows/instances/${id}`)
  return response.data.data
}

// ============ TASKS ============

export async function listTasks(params?: {
  instanceId?: string
  assignedTo?: string
  status?: string
  limit?: number
  offset?: number
}): Promise<ListResponse<Task>> {
  const response = await api.get('/workflows/tasks', { params })
  return response.data.data
}

export async function getTask(id: string): Promise<Task> {
  const response = await api.get(`/workflows/tasks/${id}`)
  return response.data.data
}

export async function createTask(instanceId: string, data: {
  title: string
  description?: string
  assignedTo?: string
  dueDate?: string
  priority?: number
  metadata?: any
}): Promise<Task> {
  const response = await api.post(`/workflows/instances/${instanceId}/tasks`, data)
  return response.data.data
}

export async function updateTask(id: string, data: {
  title?: string
  description?: string
  assignedTo?: string
  dueDate?: string
  priority?: number
  metadata?: any
}): Promise<Task> {
  const response = await api.patch(`/workflows/tasks/${id}`, data)
  return response.data.data
}

export async function updateTaskStatus(id: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED'): Promise<Task> {
  const response = await api.patch(`/workflows/tasks/${id}/status`, { status })
  return response.data.data
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/workflows/tasks/${id}`)
}

// ============ APPROVALS ============

export async function listApprovals(taskId: string): Promise<Approval[]> {
  const response = await api.get(`/workflows/tasks/${taskId}/approvals`)
  return response.data.data
}

export async function createApproval(taskId: string, comment?: string): Promise<Approval> {
  const response = await api.post(`/workflows/tasks/${taskId}/approvals`, { comment })
  return response.data.data
}

export async function updateApproval(id: string, status: 'APPROVED' | 'REJECTED' | 'CANCELLED', comment?: string): Promise<Approval> {
  const response = await api.patch(`/workflows/approvals/${id}`, { status, comment })
  return response.data.data
}