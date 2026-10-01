import { useState } from "react"
import AdminSidebar from "./adminsidebar"
import AdminHeader from "./adminheader"
import "./adminlayout.css"

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
