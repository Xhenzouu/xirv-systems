import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getWorkflow, updateWorkflowStatus, deleteWorkflow } from '../../api/workflows'
import type { Workflow } from '../../types/workflow'
import ExecuteWorkflowModal from '../../components/workflow/ExecuteWorkflowModal'
import DeleteWorkflowModal from '../../components/workflow/DeleteWorkflowModal'  // ← ADD THIS
import './Workflows.css'

export default function WorkflowDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [executeModalOpen, setExecuteModalOpen] = useState(false)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (id) loadWorkflow()
  }, [id])

  async function loadWorkflow() {
    if (!id) return
    try {
      setLoading(true)
      const data = await getWorkflow(id)
      setWorkflow(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load workflow')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusToggle() {
    if (!workflow) return
    const newStatus = workflow.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    try {
      await updateWorkflowStatus(workflow.id, newStatus)
      await loadWorkflow()
    } catch (err: any) {
      alert('Failed to update workflow status')
    }
  }

  // 🔥 REPLACED: Now opens modal instead of confirm()
  function handleDeleteClick() {
    setDeleteModalOpen(true)
  }

  // 🔥 NEW: Handles the actual deletion after modal confirmation
  async function handleConfirmDelete() {
    if (!workflow) return
    setIsDeleting(true)
    try {
      await deleteWorkflow(workflow.id)
      navigate('/workflows')
    } catch (err: any) {
      alert('Failed to delete workflow')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <div className="xirv-loading">Loading workflow...</div>
  if (error) return <div className="xirv-error">{error}</div>
  if (!workflow) return <div className="xirv-error">Workflow not found</div>

  return (
    <div className="xirv-workflows-page">
      <div className="xirv-page-header">
        <div>
          <h1>{workflow.name}</h1>
          <p className="xirv-page-subtitle">
            <span className={`xirv-status-badge xirv-status-${workflow.status.toLowerCase()}`}>
              {workflow.status}
            </span>
            <span style={{ marginLeft: '1rem' }}>Trigger: {workflow.triggerType}</span>
          </p>
        </div>
        <div className="xirv-header-actions">
          <button onClick={() => setExecuteModalOpen(true)} disabled={workflow.status !== 'ACTIVE'} className="xirv-btn-primary">
            ▶ Execute
          </button>
          <button onClick={handleStatusToggle} className="xirv-btn-secondary">
            {workflow.status === 'ACTIVE' ? '⏸ Pause' : '▶ Activate'}
          </button>
          <Link to="/workflows" className="xirv-btn-secondary">
            Back
          </Link>
          {/* 🔥 UPDATED: Now calls handleDeleteClick */}
          <button onClick={handleDeleteClick} className="xirv-btn-danger">
            🗑 Delete
          </button>
        </div>
      </div>

      <div className="xirv-workflow-detail">
        {/* Description */}
        {workflow.description && (
          <div className="xirv-detail-section">
            <h3>Description</h3>
            <p>{workflow.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="xirv-detail-grid">
          <div className="xirv-detail-section">
            <h3>Details</h3>
            <dl>
              <dt>Status</dt>
              <dd><span className={`xirv-status-badge xirv-status-${workflow.status.toLowerCase()}`}>{workflow.status}</span></dd>
              <dt>Trigger Type</dt>
              <dd>{workflow.triggerType}</dd>
              <dt>Is Template</dt>
              <dd>{workflow.isTemplate ? 'Yes' : 'No'}</dd>
              <dt>Created</dt>
              <dd>{new Date(workflow.createdAt).toLocaleString()}</dd>
              <dt>Last Updated</dt>
              <dd>{new Date(workflow.updatedAt).toLocaleString()}</dd>
            </dl>
          </div>

          <div className="xirv-detail-section">
            <h3>Statistics</h3>
            <dl>
              <dt>Total Tasks</dt>
              <dd>{workflow._count?.tasks || 0}</dd>
              <dt>Total Executions</dt>
              <dd>{workflow.instances?.length || 0}</dd>
            </dl>
          </div>
        </div>

        {/* Definition */}
        <div className="xirv-detail-section">
          <h3>Definition</h3>
          <pre className="xirv-json-viewer">{JSON.stringify(workflow.definition, null, 2)}</pre>
        </div>

        {/* Recent Executions */}
        {workflow.instances && workflow.instances.length > 0 && (
          <div className="xirv-detail-section">
            <h3>Recent Executions</h3>
            <table className="xirv-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Completed</th>
                  <th>Tasks</th>
                </tr>
              </thead>
              <tbody>
                {workflow.instances.slice(0, 10).map((instance) => (
                  <tr key={instance.id}>
                    <td>
                      <span className={`xirv-status-badge xirv-status-${instance.status.toLowerCase()}`}>
                        {instance.status}
                      </span>
                    </td>
                    <td>{new Date(instance.startedAt).toLocaleString()}</td>
                    <td>{instance.completedAt ? new Date(instance.completedAt).toLocaleString() : '-'}</td>
                    <td>{instance._count?.tasks || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Execute Modal */}
      <ExecuteWorkflowModal
        isOpen={executeModalOpen}
        onClose={() => setExecuteModalOpen(false)}
        workflowId={workflow.id}
        workflowName={workflow.name}
        onSuccess={loadWorkflow}
      />

      {/* 🔥 NEW: Delete Modal */}
      <DeleteWorkflowModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        workflowName={workflow.name}
        isDeleting={isDeleting}
      />
    </div>
  )
}