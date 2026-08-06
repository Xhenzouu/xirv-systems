export interface DashboardCard {
  id: string
  title: string
  description: string
  status: "active" | "inactive" | "warning"
}