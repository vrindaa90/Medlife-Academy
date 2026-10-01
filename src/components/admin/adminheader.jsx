import { useNavigate } from "react-router-dom"
import "./adminheader.css"

function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate()

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div>
          <h1>Admin Panel</h1>
          <p>Manage your institute</p>
        </div>
      </div>

      <div className="admin-header-right">
        <button
          className="admin-notification-btn"
          onClick={() => alert("No new notifications")}
          aria-label="Notifications"
        >
          🔔
          <span className="admin-notification-dot"></span>
        </button>

        <button
          className="admin-profile"
          onClick={() => navigate("/admin/settings")}
        >
          <div className="admin-profile-avatar">
            A
          </div>

          <div className="admin-profile-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <span className="admin-profile-arrow">⌄</span>
        </button>
      </div>
    </header>
  )
}

export default AdminHeader