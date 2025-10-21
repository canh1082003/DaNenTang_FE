import { Outlet } from 'react-router-dom'
import Sidebar from '../pages/admin/SideBar/SideBar'
import "../pages/admin/dashboard.css"

const AdminLayout = () => {
    return (
       <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
    )
}

export default AdminLayout
