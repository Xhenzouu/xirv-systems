import type { ReactNode } from "react"

import Header from "../components/navigation/Header"
import Sidebar from "../components/navigation/Sidebar"

import "./DashboardLayout.css"

interface DashboardLayoutProps {
  children: ReactNode
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
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout