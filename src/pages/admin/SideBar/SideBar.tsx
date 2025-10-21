import { useState } from "react"
import "./Sidebar.css"
import { menuItems } from "./AdminMenuItem"
import { NavLink } from "react-router-dom"


export default function Sidebar( ) {
  const [isCollapsed, setIsCollapsed] = useState(false)


  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">{!isCollapsed && <span>ChatBox Pro</span>}</div>
        <button
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.id === "dashboard"}
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title={isCollapsed ? item.label : ""}
        >
          <span className="nav-icon">{item.icon}</span>
          {!isCollapsed && <span className="nav-label">{item.label}</span>}
        </NavLink>
      ))}

      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">👤</div>
          {!isCollapsed && (
            <div className="user-info">
              <p className="user-name">John Doe</p>
              <p className="user-email">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
