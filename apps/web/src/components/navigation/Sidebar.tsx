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
              // For SUPER_ADMIN pages, check if the current path starts with the item path
              if (item.path === '/super-admin') {
                return location.pathname === '/super-admin' ? "active" : ""
              }
              return isActive ? "active" : ""
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