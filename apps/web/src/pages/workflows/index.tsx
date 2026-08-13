import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listWorkflows, updateWorkflowStatus, deleteWorkflow } from '../../api/workflows'
import type { Workflow } from '../../types/workflow'
import ExecuteWorkflowModal from '../../components/workflow/ExecuteWorkflowModal'
import DeleteWorkflowModal from '../../components/workflow/DeleteWorkflowModal'
import './Workflows.css'

export default function WorkflowsList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Execute modal state
  const [executeModalOpen, setExecuteModalOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadWorkflows()
  }, [])

  async function loadWorkflows() {
    try {
      setLoading(true)
      setError(null)
      const response = await listWorkflows()
      
      let workflowsData: Workflow[] = []
      if (Array.isArray(response)) {
        workflowsData = response
      } else if (response && typeof response === 'object') {
        workflowsData = (response as any).data || []
        if ((response as any).workflows) {
          workflowsData = (response as any).workflows
        }
      }
      
      setWorkflows(workflowsData)
    } catch (err: any) {
      console.error('❌ Failed to load workflows:', err)
      setError(err.message || 'Failed to load workflows')
      setWorkflows([])
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusToggle(workflow: Workflow) {
    const newStatus = workflow.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    try {
      await updateWorkflowStatus(workflow.id, newStatus)
      await loadWorkflows()
    } catch (err: any) {
      alert(`Failed to ${newStatus === 'ACTIVE' ? 'activate' : 'pause'} workflow`)
    }
  }

  // 🔥 THIS NOW OPENS THE MODAL INSTEAD OF USING confirm()
  function handleDeleteClick(workflow: Workflow) {
    console.log('🗑️ Delete clicked for:', workflow.name)
    setWorkflowToDelete(workflow)
    setDeleteModalOpen(true)
  }

  async function handleConfirmDelete() {
    if (!workflowToDelete) return
    setIsDeleting(true)
    try {
      await deleteWorkflow(workflowToDelete.id)
      await loadWorkflows()
      setDeleteModalOpen(false)
      setWorkflowToDelete(null)
    } catch (err: any) {
      alert('Failed to delete workflow')
    } finally {
      setIsDeleting(false)
    }
  }

  function handleExecuteClick(workflow: Workflow) {
    setSelectedWorkflow(workflow)
    setExecuteModalOpen(true)
  }

  if (loading) return <div className="xirv-loading">Loading workflows...</div>
  
  if (error) {
    return (
      <div className="xirv-workflows-page">
        <div className="xirv-page-header">
          <h1>Workflows</h1>
        </div>
        <div className="xirv-error">
          <p>❌ {error}</p>
          <button onClick={loadWorkflows} className="xirv-btn-primary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="xirv-workflows-page">
      {/* Page Header */}
      <div className="xirv-page-header">
        <div>
          <h1>Workflows</h1>
          <p className="xirv-page-subtitle">Automate business processes with AI-powered workflows</p>
        </div>
        <div className="xirv-header-actions">
          <Link to="/workflows/tasks" className="xirv-btn-secondary">
            Task Board
          </Link>
          <Link to="/workflows/create" className="xirv-btn-primary">
            + Create Workflow
          </Link>
        </div>
      </div>

      {/* Workflow List */}
      {workflows.length === 0 ? (
        <div className="xirv-empty-state">
          <div className="xirv-empty-icon">⚡</div>
          <h3>No workflows yet</h3>
          <p>Create your first workflow to automate processes like document approvals, AI reviews, and more.</p>
          <Link to="/workflows/create" className="xirv-btn-primary" style={{ marginTop: '1rem' }}>
            + Create Workflow
          </Link>
        </div>
      ) : (
        <div className="xirv-workflow-list">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="xirv-workflow-card">
              <div className="xirv-workflow-card-header">
                <div className="xirv-workflow-info">
                  <h3>
                    <Link to={`/workflows/${workflow.id}`}>{workflow.name}</Link>
                  </h3>
                  {workflow.description && <p>{workflow.description}</p>}
                </div>
                <div className="xirv-workflow-actions">
                  <span className={`xirv-status-badge xirv-status-${workflow.status.toLowerCase()}`}>
                    {workflow.status}
                  </span>
                  <button
                    onClick={() => handleStatusToggle(workflow)}
                    className="xirv-btn-secondary"
                    title={workflow.status === 'ACTIVE' ? 'Pause workflow' : 'Activate workflow'}
                  >
                    {workflow.status === 'ACTIVE' ? '⏸ Pause' : '▶ Activate'}
                  </button>
                  {workflow.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleExecuteClick(workflow)}
                      className="xirv-btn-primary"
                      title="Execute workflow"
                    >
                      ▶ Execute
                    </button>
                  )}
                  <Link to={`/workflows/${workflow.id}`} className="xirv-btn-secondary">
                    View
                  </Link>
                  {/* 🔥 THIS BUTTON NOW CALLS handleDeleteClick */}
                  <button
                    onClick={() => handleDeleteClick(workflow)}
                    className="xirv-btn-danger"
                    title="Delete workflow"
                  >
                    🗑
                  </button>
                </div>
              </div>
              <div className="xirv-workflow-card-footer">
                <span>Trigger: {workflow.triggerType}</span>
                <span>Tasks: {workflow._count?.tasks || 0}</span>
                <span>Created: {new Date(workflow.createdAt).toLocaleDateString()}</span>
                {workflow.isTemplate && <span className="xirv-template-badge">Template</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Execute Modal */}
      {selectedWorkflow && (
        <ExecuteWorkflowModal
          isOpen={executeModalOpen}
          onClose={() => setExecuteModalOpen(false)}
          workflowId={selectedWorkflow.id}
          workflowName={selectedWorkflow.name}
          onSuccess={loadWorkflows}
        />
      )}

      {/* Delete Modal */}
      {workflowToDelete && (
        <DeleteWorkflowModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setWorkflowToDelete(null)
          }}
          onConfirm={handleConfirmDelete}
          workflowName={workflowToDelete.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}