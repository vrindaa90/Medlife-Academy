import { NavLink } from "react-router-dom"
import "./adminsidebar.css"

function AdminSidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      label: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard",
    },
    {
      label: "Students",
      icon: "👨‍🎓",
      path: "/admin/students",
    },
    {
      label: "Batches",
      icon: "📚",
      path: "/admin/batches",
    },
    {
      label: "Careers",
      icon: "💼",
      path: "/admin/careers",
    },
    {
      label: "Career Applicants",
      icon: "📄",
      path: "/admin/career-applicants",
    },
    {
      label: "Queries",
      icon: "💬",
      path: "/admin/queries",
    },
    {
      label: "Reports",
      icon: "📈",
      path: "/admin/report",
    },
    {
      label: "Settings",
      icon: "⚙️",
      path: "/admin/settings",
    },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onClose}
        ></div>
      )}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">M</div>

          <div>
            <h2>MedLife</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <p className="admin-menu-title">MENU</p>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <NavLink
            to="/"
            className="admin-back-site"
            onClick={onClose}
          >
            <span>🌐</span>
            <span>View Website</span>
          </NavLink>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar