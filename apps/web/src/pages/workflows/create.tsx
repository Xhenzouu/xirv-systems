import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWorkflow } from '../../api/workflows'
import './Workflows.css'

export default function CreateWorkflow() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'MANUAL' as 'MANUAL' | 'SCHEDULED' | 'EVENT' | 'WEBHOOK',
    definition: { steps: [] },
  })
  const [jsonError, setJsonError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Workflow name is required')
      return
    }

    try {
      setLoading(true)
      await createWorkflow(formData)
      navigate('/workflows')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create workflow')
    } finally {
      setLoading(false)
    }
  }

  function handleJsonChange(value: string) {
    try {
      const parsed = JSON.parse(value)
      setFormData({ ...formData, definition: parsed })
      setJsonError(null)
    } catch {
      setJsonError('Invalid JSON format')
    }
  }

  return (
    <div className="xirv-workflows-page">
      <div className="xirv-page-header">
        <div>
          <h1>Create Workflow</h1>
          <p className="xirv-page-subtitle">Define a new automated process</p>
        </div>
        <button onClick={() => navigate('/workflows')} className="xirv-btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="xirv-workflow-form">
        <div className="xirv-form-group">
          <label htmlFor="name">Workflow Name <span className="required">*</span></label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Document Approval Process"
            className="xirv-form-input"
          />
        </div>

        <div className="xirv-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What does this workflow do?"
            rows={3}
            className="xirv-form-textarea"
          />
        </div>

        <div className="xirv-form-group">
          <label htmlFor="triggerType">Trigger Type</label>
          <select
            id="triggerType"
            value={formData.triggerType}
            onChange={(e) => setFormData({ ...formData, triggerType: e.target.value as any })}
            className="xirv-form-select"
          >
            <option value="MANUAL">Manual — Triggered by user action</option>
            <option value="SCHEDULED">Scheduled — Runs on a schedule</option>
            <option value="EVENT">Event — Triggered by system events</option>
            <option value="WEBHOOK">Webhook — Triggered by external calls</option>
          </select>
        </div>

        <div className="xirv-form-group">
          <label htmlFor="definition">Workflow Definition (JSON)</label>
          <textarea
            id="definition"
            value={JSON.stringify(formData.definition, null, 2)}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={10}
            className={`xirv-form-textarea xirv-json-editor ${jsonError ? 'xirv-json-error' : ''}`}
          />
          {jsonError ? (
            <div className="xirv-form-error">{jsonError}</div>
          ) : (
            <div className="xirv-form-help">Define your workflow steps as JSON. Example: {"{ \"steps\": [ { \"type\": \"approval\", \"target\": \"admin\" } ] }"}</div>
          )}
        </div>

        <div className="xirv-form-actions">
          <button type="submit" disabled={loading || !!jsonError} className="xirv-btn-primary">
            {loading ? 'Creating...' : 'Create Workflow'}
          </button>
        </div>
      </form>
    </div>
  )
}