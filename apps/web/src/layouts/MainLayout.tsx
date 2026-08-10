import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import "./MainLayout.css"

interface MainLayoutProps {
  children?: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      {children || <Outlet />}
    </div>
  )
}

export default MainLayout