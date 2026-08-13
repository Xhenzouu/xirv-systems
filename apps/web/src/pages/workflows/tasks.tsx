import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { listTasks, updateTaskStatus } from '../../api/workflows'
import type { Task } from '../../types/workflow'
import ApprovalModal from '../../components/workflow/ApprovalModal'
import './Workflows.css'

type FilterType = 'all' | 'assigned' | 'pending' | 'in_progress'

export default function TaskBoard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    loadTasks()
  }, [filter])

  async function loadTasks() {
    try {
      setLoading(true)
      const params: any = {}
      
      if (filter === 'assigned' && user) {
        params.assignedTo = user.id
      }
      if (filter === 'pending') {
        params.status = 'PENDING'
      }
      if (filter === 'in_progress') {
        params.status = 'IN_PROGRESS'
      }

      const response = await listTasks(params)
      setTasks(response.data)
    } catch (err: any) {
      console.error('Failed to load tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(taskId: string, status: Task['status']) {
    try {
      await updateTaskStatus(taskId, status)
      await loadTasks()
    } catch (err: any) {
      alert('Failed to update task status')
    }
  }

  function handleApproveClick(task: Task) {
    setSelectedTask(task)
    setApprovalModalOpen(true)
  }

  if (loading) return <div className="xirv-loading">Loading tasks...</div>

  return (
    <div className="xirv-workflows-page">
      <div className="xirv-page-header">
        <div>
          <h1>Task Board</h1>
          <p className="xirv-page-subtitle">Manage your workflow tasks and approvals</p>
        </div>
        <div className="xirv-filter-group">
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'xirv-filter-active' : ''}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('assigned')} 
            className={filter === 'assigned' ? 'xirv-filter-active' : ''}
          >
            Assigned to Me
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={filter === 'pending' ? 'xirv-filter-active' : ''}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('in_progress')} 
            className={filter === 'in_progress' ? 'xirv-filter-active' : ''}
          >
            In Progress
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="xirv-empty-state">
          <div className="xirv-empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p>Tasks will appear here when workflows are executed and tasks are assigned to you.</p>
        </div>
      ) : (
        <div className="xirv-task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="xirv-task-card">
              <div className="xirv-task-card-header">
                <div>
                  <h3>{task.title}</h3>
                  {task.instance?.workflow && (
                    <span className="xirv-task-workflow">in {task.instance.workflow.name}</span>
                  )}
                </div>
                <span className={`xirv-priority-badge xirv-priority-${task.priority}`}>
                  P{task.priority}
                </span>
              </div>

              {task.description && (
                <p className="xirv-task-description">{task.description}</p>
              )}

              <div className="xirv-task-meta">
                <span className={`xirv-status-badge xirv-status-${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
                {task.dueDate && (
                  <span className="xirv-task-due">
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                {task.assignee && (
                  <span className="xirv-task-assignee">
                    👤 {task.assignee.firstName} {task.assignee.lastName}
                  </span>
                )}
              </div>

              {/* Approvals */}
              {task.approvals && task.approvals.length > 0 && (
                <div className="xirv-task-approvals">
                  <span className="xirv-approval-label">
                    Approvals: {task.approvals.filter(a => a.status === 'APPROVED').length}/{task.approvals.length}
                  </span>
                  {task.approvals.some(a => a.status === 'PENDING') && (
                    <button
                      onClick={() => handleApproveClick(task)}
                      className="xirv-btn-primary"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Review Approvals
                    </button>
                  )}
                </div>
              )}

              <div className="xirv-task-actions">
                {task.status === 'PENDING' && (
                  <button 
                    onClick={() => handleStatusUpdate(task.id, 'IN_PROGRESS')} 
                    className="xirv-btn-secondary"
                  >
                    Start
                  </button>
                )}
                {task.status === 'IN_PROGRESS' && (
                  <button 
                    onClick={() => handleStatusUpdate(task.id, 'COMPLETED')} 
                    className="xirv-btn-primary"
                  >
                    Complete
                  </button>
                )}
                {task.status === 'PENDING' && (
                  <button 
                    onClick={() => handleStatusUpdate(task.id, 'CANCELLED')} 
                    className="xirv-btn-danger"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal - FIXED: removed taskId prop */}
      {selectedTask && (
        <ApprovalModal
          isOpen={approvalModalOpen}
          onClose={() => setApprovalModalOpen(false)}
          taskTitle={selectedTask.title}
          approvals={selectedTask.approvals || []}
          onSuccess={loadTasks}
        />
      )}
    </div>
  )
}