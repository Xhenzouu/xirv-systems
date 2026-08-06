import type { DashboardCard } from "../types/dashboard"

export const dashboardCards: DashboardCard[] = [
  {
    id: "ai",
    title: "AI Intelligence",
    description: "System is ready.",
    status: "active",
  },
  {
    id: "knowledge",
    title: "Knowledge Base",
    description: "No data connected yet.",
    status: "inactive",
  },
  {
    id: "system",
    title: "System Status",
    description: "All services operational.",
    status: "active",
  },
]

export interface DashboardActivity {
  id: string
  message: string
  time: string
}

export const dashboardActivity: DashboardActivity[] = [
  {
    id: "1",
    message: "AI Engine initialized",
    time: "Just now",
  },
  {
    id: "2",
    message: "Dashboard loaded",
    time: "1 minute ago",
  },
  {
    id: "3",
    message: "Knowledge Base ready",
    time: "5 minutes ago",
  },
]