import "./Sidebar.css"

import { NavLink } from "react-router-dom"

import { navigationItems } from "../../services/navigation"

function Sidebar() {
  return (
    <aside className="xirv-sidebar">
      <nav>
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar