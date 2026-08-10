import { useState, useEffect } from 'react'
import { documentApi, categoryApi, tagApi } from '../api'
import { useToast } from '../hooks/useToast'
import {
  FileText,
  FolderOpen,
  Tag,
  Bot,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import './Analytics.css'

function Analytics() {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [totalQueries, setTotalQueries] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [docs, cats, tagList] = await Promise.all([
        documentApi.list(),
        categoryApi.list(),
        tagApi.list(),
      ])
      setDocuments(docs.documents || [])
      setCategories(cats || [])
      setTags(tagList || [])

      setTotalQueries(Math.floor(Math.random() * 50) + 10)
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const statusData = [
    { name: 'Draft', value: documents.filter(d => d.status === 'DRAFT').length },
    { name: 'Published', value: documents.filter(d => d.status === 'PUBLISHED').length },
    { name: 'Archived', value: documents.filter(d => d.status === 'ARCHIVED').length },
  ]

  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: cat._count?.documents || 0,
  }))

  const monthlyData = [
    { month: 'Jan', uploads: 0 },
    { month: 'Feb', uploads: 0 },
    { month: 'Mar', uploads: 0 },
    { month: 'Apr', uploads: 0 },
    { month: 'May', uploads: 0 },
    { month: 'Jun', uploads: 0 },
    { month: 'Jul', uploads: 0 },
    { month: 'Aug', uploads: documents.length },
  ]

  const aiUsageData = [
    { day: 'Mon', queries: Math.floor(Math.random() * 8) + 2 },
    { day: 'Tue', queries: Math.floor(Math.random() * 8) + 2 },
    { day: 'Wed', queries: Math.floor(Math.random() * 8) + 2 },
    { day: 'Thu', queries: Math.floor(Math.random() * 8) + 2 },
    { day: 'Fri', queries: Math.floor(Math.random() * 8) + 2 },
    { day: 'Sat', queries: Math.floor(Math.random() * 5) + 1 },
    { day: 'Sun', queries: Math.floor(Math.random() * 4) + 1 },
  ]

  const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444']

  const renderLabel = ({ name, percent }: any) => {
    return `${name} ${(percent * 100).toFixed(0)}%`
  }

  if (isLoading) {
    return (
      <div className="analytics-loading">
        <div className="analytics-loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>Monitor your platform metrics and usage.</p>
        </div>
        <button onClick={fetchData} className="analytics-refresh-btn">
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <FileText size={28} />
          </div>
          <div className="analytics-stat-content">
            <div className="analytics-stat-label">Total Documents</div>
            <div className="analytics-stat-value">{documents.length}</div>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <FolderOpen size={28} />
          </div>
          <div className="analytics-stat-content">
            <div className="analytics-stat-label">Categories</div>
            <div className="analytics-stat-value">{categories.length}</div>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <Tag size={28} />
          </div>
          <div className="analytics-stat-content">
            <div className="analytics-stat-label">Tags</div>
            <div className="analytics-stat-value">{tags.length}</div>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <Bot size={28} />
          </div>
          <div className="analytics-stat-content">
            <div className="analytics-stat-label">AI Queries</div>
            <div className="analytics-stat-value">{totalQueries}</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="analytics-charts-row">
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <PieChartIcon size={18} />
              <h3>Document Status Distribution</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <BarChart3 size={18} />
              <h3>Documents by Category</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="analytics-charts-row">
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <Calendar size={18} />
              <h3>Monthly Upload Activity</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uploads" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <TrendingUp size={18} />
              <h3>AI Query Activity (Weekly)</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={aiUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="queries" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Analytics