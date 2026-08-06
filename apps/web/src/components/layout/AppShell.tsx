import "./AppShell.css"

import Header from "../navigation/Header"
import Sidebar from "../navigation/Sidebar"

import { Outlet } from "react-router-dom"


function AppShell() {

  return (
    <div className="xirv-shell">

      <Header />

      <div className="xirv-shell-body">

        <Sidebar />

        <main className="xirv-content">

          <Outlet />

        </main>

      </div>

    </div>
  )
}


export default AppShell