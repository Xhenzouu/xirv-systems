import { useState } from 'react'
import { Trash2, Database } from 'lucide-react'
import './AdminComponents.css'

interface CacheControlsProps {
  onClearCache: () => Promise<boolean>
  onRefresh: () => void
}

export function CacheControls({ onClearCache, onRefresh }: CacheControlsProps) {
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the Redis cache?')) return

    setIsClearing(true)
    const success = await onClearCache()
    setIsClearing(false)

    if (success) {
      alert('✅ Cache cleared successfully!')
      onRefresh()
    } else {
      alert('❌ Failed to clear cache')
    }
  }

  return (
    <div className="xirv-cache-controls">
      <h3>
        <Database size={20} style={{ display: 'inline', marginRight: '8px' }} />
        Cache Management
      </h3>
      <p>Clear Redis cache to force fresh data from the database.</p>
      <button
        onClick={handleClearCache}
        disabled={isClearing}
        className="xirv-btn-danger"
      >
        <Trash2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
        {isClearing ? '⏳ Clearing...' : 'Clear Cache'}
      </button>
    </div>
  )
}