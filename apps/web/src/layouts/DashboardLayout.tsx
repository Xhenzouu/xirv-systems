import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import Header from "../components/navigation/Header"
import Sidebar from "../components/navigation/Sidebar"
import "./DashboardLayout.css"

interface DashboardLayoutProps {
  children?: ReactNode
}

function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout