import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./adminsettings.css"
import { useAuth } from "../../context/authcontext"

function AdminSettings() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState("general")
  const [toast, setToast] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const adminName = admin?.name || "Admin"
  const adminEmail = admin?.email || "admin@medpathacademy.com"

  const adminRole =
    admin?.role === "superadmin"
      ? "Super Administrator"
      : "Administrator"

  const adminInitials = adminName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/admin/login", { replace: true })
    } catch (error) {
      console.error("Logout error:", error)
      navigate("/admin/login", { replace: true })
    }
  }

  const showMessage = (message) => {
    setToast(message)
    window.clearTimeout(window.__medpathToastTimer)
    window.__medpathToastTimer = window.setTimeout(() => setToast(""), 2200)
  }

  const toggleSidebar = () => setSidebarOpen((open) => !open)
  const closeSidebar = () => setSidebarOpen(false)

  const toggleSetting = (event) => {
    const button = event.currentTarget
    button.classList.toggle("on")
    showMessage(`Setting ${button.classList.contains("on") ? "enabled" : "disabled"}`)
  }

  const saveSettings = () => showMessage("Settings saved successfully")

  const signOutAll = () => {
    if (window.confirm("Are you sure you want to sign out of all other devices?")) {
      showMessage("All other sessions have been signed out")
    }
  }

  return (
    <>
<aside className={`sidebar ${sidebarOpen ? "open" : ""}`} id="sidebar">
<div className="brand">
<div className="brand-logo">
            M
        </div>
<div>
<div className="brand-name">
                MedPath Academy
            </div>
<div className="brand-subtitle">
                ADMIN PANEL
            </div>
</div>
</div>
<nav className="sidebar-nav">
<div className="nav-label">
            Main Menu
        </div>
<Link className="nav-item" to="/admin/dashboard">
<span className="nav-icon">
                ▦
            </span>

            Dashboard

        </Link>
<Link className="nav-item" to="/admin/queries">
<span className="nav-icon">
                ⌁
            </span>

            Queries

            <span className="nav-badge">
                42
            </span>
</Link>
<Link className="nav-item" to="/admin/students">
<span className="nav-icon">
                ♙
            </span>

            Students

        </Link>
<Link className="nav-item" to="/admin/batches">
<span className="nav-icon">
                ▤
            </span>

            Batches

        </Link>
<Link className="nav-item" to="/admin/careers">
<span className="nav-icon">
                ◉
            </span>

            Career Applications

        </Link>
<div className="nav-label" style={{ marginTop: "22px" }}>
            Management
        </div>
<Link className="nav-item" to="/admin/report" onClick={() => showMessage("Reports section")}>
<span className="nav-icon">
                ▥
            </span>

            Reports

        </Link>
<Link className="nav-item active" to="/admin/settings">
<span className="nav-icon">
                ⚙
            </span>

            Settings

        </Link>
</nav>
<div className="sidebar-bottom">
<div className="admin-profile">
<div className="admin-avatar">
                {adminInitials}
            </div>
<div className="admin-info">
<div className="admin-name">
                    {adminName}
                </div>
<div className="admin-role">
<span className="online-dot"></span>
                    {adminRole}
                </div>
</div>
</div>
</div>
</aside>
<div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} id="sidebarOverlay" onClick={closeSidebar}></div>
<main className="main">
<header className="topbar">
<div className="topbar-left">
<button type="button" className="mobile-menu" onClick={toggleSidebar}>
                ☰
            </button>
<div>
<div className="page-title">
                    Settings
                </div>
<div className="page-subtitle">
                    Manage your MedPath Academy admin workspace
                </div>
</div>
</div>
<div className="topbar-right">
<button type="button" className="icon-button" onClick={() => showMessage("No new notifications")}>

                ♢

                <span className="notification-dot"></span>
</button>
<button type="button" className="icon-button" onClick={() => showMessage("Admin profile")}>
                ◉
            </button>
</div>
</header>
<section className="content">
<div className="page-intro">
<h1 className="intro-heading">
                Admin Settings
            </h1>
<p className="intro-text">
                Configure your academy, account, notifications and administrator access.
            </p>
</div>
<div className="settings-layout">
<aside className="settings-menu">
<div className="settings-menu-title">
                    Settings
                </div>
<button type="button" className={`settings-tab ${activeSection === "general" ? "active" : ""}`} onClick={() => setActiveSection("general")}>
<span className="settings-tab-icon">
                        ⚙
                    </span>

                    General

                </button>
<button type="button" className={`settings-tab ${activeSection === "profile" ? "active" : ""}`} onClick={() => setActiveSection("profile")}>
<span className="settings-tab-icon">
                        ◉
                    </span>

                    My Profile

                </button>
<button type="button" className={`settings-tab ${activeSection === "notifications" ? "active" : ""}`} onClick={() => setActiveSection("notifications")}>
<span className="settings-tab-icon">
                        ♢
                    </span>

                    Notifications

                </button>
<button type="button" className={`settings-tab ${activeSection === "users" ? "active" : ""}`} onClick={() => setActiveSection("users")}>
<span className="settings-tab-icon">
                        ♙
                    </span>

                    Users &amp; Roles

                </button>
<button type="button" className={`settings-tab ${activeSection === "security" ? "active" : ""}`} onClick={() => setActiveSection("security")}>
<span className="settings-tab-icon">
                        ◈
                    </span>

                    Security

                </button>
<button type="button" className={`settings-tab ${activeSection === "preferences" ? "active" : ""}`} onClick={() => setActiveSection("preferences")}>
<span className="settings-tab-icon">
                        ◫
                    </span>

                    Preferences

                </button>
</aside>
<div className="settings-content">
<div className={`settings-section ${activeSection === "general" ? "active" : ""}`} id="general">
<div className="panel">
<div className="panel-header">
<div className="panel-heading">
                                Academy Information
                            </div>
<div className="panel-description">
                                Basic information displayed across the MedPath Academy admin system.
                            </div>
</div>
<div className="panel-body">
<div className="form-grid">
<div className="form-group">
<label className="form-label">
                                        Academy Name
                                    </label>
<input className="form-control" type="text" defaultValue="MedPath Academy"/>
</div>
<div className="form-group">
<label className="form-label">
                                        Admin Email
                                    </label>
<input className="form-control" type="email" defaultValue={adminEmail}/>
</div>
<div className="form-group">
<label className="form-label">
                                        Contact Number
                                    </label>
<input className="form-control" type="tel" defaultValue="+91 98765 43210"/>
</div>
<div className="form-group">
<label className="form-label">
                                        Website
                                    </label>
<input className="form-control" type="text" defaultValue="www.medpathacademy.com"/>
</div>
<div className="form-group full">
<label className="form-label">
                                        Academy Address
                                    </label>
<textarea className="form-control">Delhi, India</textarea>
</div>
<div className="form-group">
<label className="form-label">
                                        Time Zone
                                    </label>
<select className="form-control" defaultValue="Asia/Kolkata (IST)">
<option>
                                            Asia/Kolkata (IST)
                                        </option>
<option>
                                            Asia/Dubai (GST)
                                        </option>
<option>
                                            Asia/Singapore (SGT)
                                        </option>
</select>
</div>
<div className="form-group">
<label className="form-label">
                                        Currency
                                    </label>
<select className="form-control" defaultValue="Indian Rupee (₹)">
<option>
                                            Indian Rupee (₹)
                                        </option>
<option>
                                            US Dollar ($)
                                        </option>
</select>
</div>
</div>
<div className="save-row">
<button type="button" className="secondary-button" onClick={() => showMessage("Changes discarded")}>
                                    Cancel
                                </button>
<button type="button" className="primary-button" onClick={saveSettings}>
                                    Save Changes
                                </button>
</div>
</div>
</div>
<div className="panel">
<div className="panel-header">
<div className="panel-heading">
                                Admin Workspace
                            </div>
<div className="panel-description">
                                Control the basic behaviour of your administration workspace.
                            </div>
</div>
<div className="panel-body">
<div className="setting-list">
<div className="setting-item">
<div>
<div className="setting-title">
                                            Show Dashboard Statistics
                                        </div>
<div className="setting-description">
                                            Display student, query and batch statistics on the admin dashboard.
                                        </div>
</div>
<button type="button" className="toggle on" onClick={toggleSetting}></button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Enable Quick Actions
                                        </div>
<div className="setting-description">
                                            Show shortcuts for common administrative actions.
                                        </div>
</div>
<button type="button" className="toggle on" onClick={toggleSetting}></button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Compact Tables
                                        </div>
<div className="setting-description">
                                            Use smaller rows when viewing large student and query lists.
                                        </div>
</div>
<button type="button" className="toggle" onClick={toggleSetting}></button>
</div>
</div>
</div>
</div>
</div>
<div className={`settings-section ${activeSection === "profile" ? "active" : ""}`} id="profile">
<div className="panel">
<div className="panel-header">
<div className="panel-heading">
                                My Profile
                            </div>
<div className="panel-description">
                                Manage your administrator account information.
                            </div>
</div>
<div className="panel-body">
<div className="profile-top">
<div className="profile-avatar">
                                    {adminInitials}
                                </div>
<div>
<div className="profile-name">
                                        {adminName}
                                    </div>
<div className="profile-role">
                                        {adminRole}
                                    </div>
<div className="profile-status">
                                        Active Account
                                    </div>
</div>
</div>
<div className="form-grid">
<div className="form-group">
<label className="form-label">
                                        First Name
                                    </label>
<input className="form-control" defaultValue={adminName.split(" ")[0] || ""}/>
</div>
<div className="form-group">
<label className="form-label">
                                        Last Name
                                    </label>
<input className="form-control" defaultValue={adminName.split(" ").slice(1).join(" ") || ""}/>
</div>
<div className="form-group">
<label className="form-label">
                                        Email Address
                                    </label>
<input className="form-control" type="email" defaultValue="admin@medpathacademy.com"/>
</div>
<div className="form-group">
<label className="form-label">
                                        Phone Number
                                    </label>
<input className="form-control" type="tel" defaultValue="+91 98765 43210" />
</div>
<div className="form-group full">
<label className="form-label">
                                        Role
                                    </label>
<input className="form-control" disabled value={adminRole} readOnly/>
<span className="form-help">
                                        Only another authorized administrator can change your role.
                                    </span>
</div>
</div>
<div className="save-row">
<button type="button" className="primary-button" onClick={saveSettings}>
                                    Update Profile
                                </button>
</div>
</div>
</div>
</div>
<div className={`settings-section ${activeSection === "notifications" ? "active" : ""}`} id="notifications">
<div className="panel">
<div className="panel-header">
<div className="panel-heading">
                                Notification Preferences
                            </div>
<div className="panel-description">
                                Choose which events should generate notifications for administrators.
                            </div>
</div>
<div className="panel-body">
<div className="setting-list">
<div className="setting-item">
<div>
<div className="setting-title">
                                            New Student Registration
                                        </div>
<div className="setting-description">
                                            Get notified when a new student is registered.
                                        </div>
</div>
<button type="button" className="toggle on" onClick={toggleSetting}></button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            New Website Query
                                        </div>
<div className="setting-description">
                                            Receive an alert whenever a visitor submits a contact query.
                                        </div>
</div>
<button type="button" className="toggle on" onClick={toggleSetting}></button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Career Application
                                        </div>
<div className="setting-description">
                                            Get notified when someone applies for a job opening.
                                        </div>
</div>
<button type="button" className="toggle on" onClick={toggleSetting}></button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Follow-up Reminder
                                        </div>
<div className="setting-description">
                                            Receive reminders for scheduled query and student follow-ups.
                                        </div>
</div>
<button type="button" className="toggle on" onClick={toggleSetting}></button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Batch Capacity Alert
                                        </div>
<div className="setting-description">
                                            Alert administrators when a batch is close to becoming full.
                                        </div>
</div>
<button type="button" className="toggle" onClick={toggleSetting}></button>
</div>
</div>
<div className="save-row">
<button type="button" className="primary-button" onClick={saveSettings}>
                                    Save Notification Settings
                                </button>
</div>
</div>
</div>
</div>
<div className={`settings-section ${activeSection === "users" ? "active" : ""}`} id="users">
<div className="info-box">
<div className="info-icon">
                            i
                        </div>
<div className="info-text">
                            User roles control what different administrators and staff members can access inside the admin panel. Keep permissions limited to what each role actually needs.
                        </div>
</div>
<div className="panel">
<div className="panel-header">
<div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "15px",
                            }}>
<div>
<div className="panel-heading">
                                        Admin Users
                                    </div>
<div className="panel-description">
                                        Manage users who have access to the MedPath admin panel.
                                    </div>
</div>
<button type="button" className="primary-button" onClick={() => showMessage("Add user form coming soon")}>
                                    + Add User
                                </button>
</div>
</div>
<div className="user-table-wrap">
<table className="user-table">
<thead>
<tr>
<th>
                                            User
                                        </th>
<th>
                                            Role
                                        </th>
<th>
                                            Last Login
                                        </th>
<th>
                                            Status
                                        </th>
<th>
                                            Action
                                        </th>
</tr>
</thead>
<tbody>
<tr>
<td>
<div className="user-person">
<div className="user-avatar">
                                                    AD
                                                </div>
<div>
<div className="user-name">
                                                        Admin User
                                                    </div>
<div className="user-email">
                                                        admin@medpathacademy.com
                                                    </div>
</div>
</div>
</td>
<td>
<span className="role-badge admin">
                                                Super Admin
                                            </span>
</td>
<td>
                                            Today, 10:42 AM
                                        </td>
<td>
<span className="user-status">
                                                ● Active
                                            </span>
</td>
<td>
<button type="button" className="table-action" onClick={() => showMessage("This is your current account")}>
                                                Current
                                            </button>
</td>
</tr>
<tr>
<td>
<div className="user-person">
<div className="user-avatar">
                                                    RS
                                                </div>
<div>
<div className="user-name">
                                                        Riya Sharma
                                                    </div>
<div className="user-email">
                                                        riya@medpathacademy.com
                                                    </div>
</div>
</div>
</td>
<td>
<span className="role-badge">
                                                Manager
                                            </span>
</td>
<td>
                                            Today, 09:15 AM
                                        </td>
<td>
<span className="user-status">
                                                ● Active
                                            </span>
</td>
<td>
<button type="button" className="table-action" onClick={() => showMessage("User management coming soon")}>
                                                Manage
                                            </button>
</td>
</tr>
<tr>
<td>
<div className="user-person">
<div className="user-avatar">
                                                    AK
                                                </div>
<div>
<div className="user-name">
                                                        Aman Kapoor
                                                    </div>
<div className="user-email">
                                                        aman@medpathacademy.com
                                                    </div>
</div>
</div>
</td>
<td>
<span className="role-badge counsellor">
                                                Counsellor
                                            </span>
</td>
<td>
                                            Yesterday, 05:48 PM
                                        </td>
<td>
<span className="user-status">
                                                ● Active
                                            </span>
</td>
<td>
<button type="button" className="table-action" onClick={() => showMessage("User management coming soon")}>
                                                Manage
                                            </button>
</td>
</tr>
<tr>
<td>
<div className="user-person">
<div className="user-avatar">
                                                    NP
                                                </div>
<div>
<div className="user-name">
                                                        Neha Patel
                                                    </div>
<div className="user-email">
                                                        neha@medpathacademy.com
                                                    </div>
</div>
</div>
</td>
<td>
<span className="role-badge">
                                                Operations
                                            </span>
</td>
<td>
                                            05 Sep 2026
                                        </td>
<td>
<span className="user-status inactive">
                                                ● Inactive
                                            </span>
</td>
<td>
<button type="button" className="table-action" onClick={() => showMessage("User management coming soon")}>
                                                Manage
                                            </button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<div className="panel">
<div className="panel-header">
<div className="panel-heading">
                                Roles &amp; Permissions
                            </div>
<div className="panel-description">
                                Define which areas each role can access.
                            </div>
</div>
<div className="panel-body">
<div className="setting-list">
<div className="setting-item">
<div>
<div className="setting-title">
                                            Super Administrator
                                        </div>
<div className="setting-description">
                                            Full access to students, queries, batches, careers, reports and settings.
                                        </div>
</div>
<button type="button" className="secondary-button" onClick={() => showMessage("Role permissions coming soon")}>
                                        Manage Role
                                    </button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Manager
                                        </div>
<div className="setting-description">
                                            Manage students, queries, batches and operational reports.
                                        </div>
</div>
<button type="button" className="secondary-button" onClick={() => showMessage("Role permissions coming soon")}>
                                        Manage Role
                                    </button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Counsellor
                                        </div>
<div className="setting-description">
                                            Manage assigned queries, follow-ups and student admissions.
                                        </div>
</div>
<button type="button" className="secondary-button" onClick={() => showMessage("Role permissions coming soon")}>
                                        Manage Role
                                    </button>
</div>
</div>
</div>
</div>
</div>
<div className={`settings-section ${activeSection === "security" ? "active" : ""}`} id="security">
<div className="panel">
<div className="panel-header">
<div className="panel-heading">
                                Security
                            </div>
<div className="panel-description">
                                Protect administrator accounts and control login security.
                            </div>
</div>
<div className="panel-body">
<div className="security-grid">
<div className="security-card">
<div className="security-icon">
                                        🔑
                                    </div>
<div className="security-title">
                                        Change Password
                                    </div>
<div className="security-text">
                                        Update your administrator password regularly to keep your account secure.
                                    </div>
<button type="button" className="security-button" onClick={() => showMessage("Change password form coming soon")}>
                                        Change Password
                                    </button>
</div>
<div className="security-card">
<div className="security-icon">
                                        ◈
                                    </div>
<div className="security-title">
                                        Two-Factor Authentication
                                    </div>
<div className="security-text">
                                        Add an additional verification step when administrators sign in.
                                    </div>
<button type="button" className="security-button" onClick={() => showMessage("2FA setup coming soon")}>
                                        Configure 2FA
                                    </button>
</div>
<div className="security-card">
<div className="security-icon">
                                        ◷
                                    </div>
<div className="security-title">
                                        Session Management
                                    </div>
<div className="security-text">
                                        Review active sessions and control automatic session timeout.
                                    </div>
<button type="button" className="security-button" onClick={() => showMessage("Session management coming soon")}>
                                        Manage Sessions
                                    </button>
</div>
<div className="security-card">
<div className="security-icon">
                                        ▤
                                    </div>
<div className="security-title">
                                        Activity Log
                                    </div>
<div className="security-text">
                                        Review important administrator actions and system changes.
                                    </div>
<button type="button" className="security-button" onClick={() => showMessage("Activity log coming soon")}>
                                        View Activity Log
                                    </button>
</div>
</div>
</div>
</div>
<div className="panel danger-panel">
<div className="panel-header">
<div className="panel-heading danger-title">
                                Danger Zone
                            </div>
<div className="panel-description">
                                Sensitive actions that may affect your administrator account.
                            </div>
</div>
<div className="panel-body">
<div className="setting-item">
<div>
<div className="setting-title">
                                        Sign out of all devices
                                    </div>
<div className="setting-description">
                                        End all active administrator sessions except the current session.
                                    </div>
</div>
<button type="button" className="danger-button" onClick={signOutAll}>
                                    Sign Out All
                                </button>
</div>
</div>
</div>
</div>
<div className={`settings-section ${activeSection === "preferences" ? "active" : ""}`} id="preferences">
<div className="panel">
<div className="panel-header">
<div className="panel-heading">
                                System Preferences
                            </div>
<div className="panel-description">
                                Customize how information is displayed throughout the admin panel.
                            </div>
</div>
<div className="panel-body">
<div className="form-grid">
<div className="form-group">
<label className="form-label">
                                        Default Dashboard Period
                                    </label>
<select className="form-control" defaultValue="Last 30 Days">
<option>
                                            Today
                                        </option>
<option>
                                            Last 30 Days
                                        </option>
<option>
                                            Last 90 Days
                                        </option>
<option>
                                            This Year
                                        </option>
</select>
</div>
<div className="form-group">
<label className="form-label">
                                        Date Format
                                    </label>
<select className="form-control" defaultValue="DD MMM YYYY">
<option>
                                            DD MMM YYYY
                                        </option>
<option>
                                            DD/MM/YYYY
                                        </option>
<option>
                                            MM/DD/YYYY
                                        </option>
</select>
</div>
<div className="form-group">
<label className="form-label">
                                        Default Student View
                                    </label>
<select className="form-control" defaultValue="Student Directory">
<option>
                                            Student Directory
                                        </option>
<option>
                                            Recently Added
                                        </option>
<option>
                                            Active Students
                                        </option>
</select>
</div>
<div className="form-group">
<label className="form-label">
                                        Default Query View
                                    </label>
<select className="form-control" defaultValue="All Queries">
<option>
                                            All Queries
                                        </option>
<option>
                                            New Queries
                                        </option>
<option>
                                            Follow-ups
                                        </option>
</select>
</div>
</div>
<div className="save-row">
<button type="button" className="primary-button" onClick={saveSettings}>
                                    Save Preferences
                                </button>
</div>
</div>
</div>
<div className="panel">
<div className="panel-header">
<div className="panel-heading">
                                Interface Preferences
                            </div>
<div className="panel-description">
                                Control optional interface behaviour.
                            </div>
</div>
<div className="panel-body">
<div className="setting-list">
<div className="setting-item">
<div>
<div className="setting-title">
                                            Show Confirmation Before Delete
                                        </div>
<div className="setting-description">
                                            Ask for confirmation before deleting records.
                                        </div>
</div>
<button type="button" className="toggle on" onClick={toggleSetting}></button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Remember Last Filters
                                        </div>
<div className="setting-description">
                                            Keep your most recently used filters on list pages.
                                        </div>
</div>
<button type="button" className="toggle on" onClick={toggleSetting}></button>
</div>
<div className="setting-item">
<div>
<div className="setting-title">
                                            Enable Keyboard Shortcuts
                                        </div>
<div className="setting-description">
                                            Use keyboard shortcuts for common admin actions.
                                        </div>
</div>
<button type="button" className="toggle" onClick={toggleSetting}></button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
</main>
<div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  )
}

export default AdminSettings
