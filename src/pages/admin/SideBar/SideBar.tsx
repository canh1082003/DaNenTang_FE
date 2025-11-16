import { useState } from "react"
import "./Sidebar.css"
import { menuItems } from "./AdminMenuItem"
import { NavLink } from "react-router-dom"
import { useAdmin } from "../../../hooks/auth/InfoAdmin/useAdmin"
import { useLogout } from "../../../hooks/auth/Logout/Logout"
import { LoadingModal } from "../../../components/Loading/ModalLoading"


export default function Sidebar( ) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { adminInfo, loading } = useAdmin();
  const [showMenu, setShowMenu] = useState(false);
  const { loading : loadingLogout, logout } = useLogout();

  const handleLogout = () => {
    logout();
    <LoadingModal show={loadingLogout} text="Đang xử lý kết nối..." />
  }
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
              <p className="user-name">{adminInfo?.username || "Unknown"}</p>
              <p className="user-email">{adminInfo?.email || "Unknown"}</p>
            </div>
          )}
           <div
          className="settings-icon"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          ⚙️
        </div>

        {/* Menu dropdown */}
        {showMenu && (
          <div className="user-menu">
            <button onClick={handleLogout}>Đăng Xuất</button>
          </div>
        )}
        </div>
      </div>
            
      
    </aside>
  )
}
