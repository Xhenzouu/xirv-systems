export interface SystemStatus {
  name: string
  status: "online" | "offline"
  uptime?: string
}