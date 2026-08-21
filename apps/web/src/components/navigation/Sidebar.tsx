import "./Sidebar.css"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { getNavigationItems } from "../../services/navigation"

function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const navigationItems = getNavigationItems(user?.role, location.pathname)

  return (
    <aside className="xirv-sidebar">
      <nav>
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => {
              // For exact matches only
              if (item.path === '/admin') {
                return location.pathname === '/admin' ? "active" : ""
              }
              if (item.path === '/super-admin') {
                return location.pathname === '/super-admin' ? "active" : ""
              }
              // For sub-pages, check if the path starts with the item path
              // but only if the item path is not the root admin/super-admin
              if (isActive) {
                return "active"
              }
              return ""
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar