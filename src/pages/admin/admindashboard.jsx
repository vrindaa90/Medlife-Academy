import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import apiRequest from "../../services/apiService";
import "./admindashboard.css";

function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [queries, setQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [queryError, setQueryError] = useState("");

  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  // ========================================
  // CURRENT DATE
  // ========================================

  useEffect(() => {
    const today = new Date();

    setCurrentDate(
      today.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  // ========================================
  // FETCH DASHBOARD DATA
  // ========================================

  useEffect(() => {
    const fetchDashboardQueries = async () => {
      try {
        setLoadingQueries(true);
        setQueryError("");

        const data = await apiRequest("/queries");

        if (data?.success && Array.isArray(data.queries)) {
          setQueries(data.queries);
        } else {
          setQueries([]);
        }
      } catch (error) {
        console.error("Dashboard query fetch error:", error);

        setQueryError(
          error.message || "Unable to load dashboard data."
        );

        setQueries([]);
      } finally {
        setLoadingQueries(false);
      }
    };

    fetchDashboardQueries();
  }, []);

  // ========================================
  // ADMIN INFORMATION
  // ========================================

  const adminName = admin?.name || "Admin";

  const adminRole =
    admin?.role === "superadmin"
      ? "Super Administrator"
      : "Administrator";

  const adminInitials =
    adminName
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  // ========================================
  // QUERY STATISTICS
  // ========================================

  const queryStats = useMemo(() => {
    let newQueries = 0;
    let followUps = 0;
    let resolvedQueries = 0;

    queries.forEach((query) => {
      const status = String(query?.status || "New")
        .trim()
        .toLowerCase();

      if (
        status === "new" ||
        status === "new query" ||
        status === "pending"
      ) {
        newQueries++;
      }

      if (
        status === "follow-up" ||
        status === "follow up" ||
        status === "followup" ||
        status === "in progress" ||
        status === "in-progress"
      ) {
        followUps++;
      }

      if (
        status === "resolved" ||
        status === "closed" ||
        status === "completed"
      ) {
        resolvedQueries++;
      }
    });

    return {
      total: queries.length,
      newQueries,
      followUps,
      resolvedQueries,
    };
  }, [queries]);

  // ========================================
  // RECENT QUERIES
  // ========================================

  const recentQueries = useMemo(() => {
    return [...queries]
      .sort((a, b) => {
        const dateA = new Date(
          a?.createdAt ||
            a?.created_at ||
            a?.createdDate ||
            0
        ).getTime();

        const dateB = new Date(
          b?.createdAt ||
            b?.created_at ||
            b?.createdDate ||
            0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [queries]);

  // ========================================
  // QUERY STATUS DISTRIBUTION
  // ========================================

  const queryStatusData = useMemo(() => {
    const statusCounts = {};

    queries.forEach((query) => {
      const rawStatus = String(
        query?.status || "New"
      ).trim();

      const status =
        rawStatus.charAt(0).toUpperCase() +
        rawStatus.slice(1);

      statusCounts[status] =
        (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).sort(
      (a, b) => b[1] - a[1]
    );
  }, [queries]);

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const formatQueryDate = (query) => {
    const dateValue =
      query?.createdAt ||
      query?.created_at ||
      query?.createdDate ||
      query?.date;

    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getQueryName = (query) => {
    return (
      query?.name ||
      query?.studentName ||
      query?.applicantName ||
      "Unknown"
    );
  };

  const getQueryMessage = (query) => {
    return (
      query?.message ||
      query?.query ||
      query?.subject ||
      "No message provided"
    );
  };

  const getQueryStatus = (query) => {
    return query?.status || "New";
  };

  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (
      normalizedStatus === "resolved" ||
      normalizedStatus === "closed" ||
      normalizedStatus === "completed"
    ) {
      return "status-resolved";
    }

    if (
      normalizedStatus === "follow-up" ||
      normalizedStatus === "followup" ||
      normalizedStatus === "in-progress"
    ) {
      return "status-followup";
    }

    return "status-new";
  };

  // ========================================
  // SIDEBAR
  // ========================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/admin/login", { replace: true });
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "show" : ""
        }`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
        id="sidebar"
      >
        <div className="sidebar-brand">
          <div className="brand-logo"></div>

          <div>
            <div className="brand-name">
              MedPath Academy
            </div>

            <div className="brand-subtitle">
              ADMIN PANEL
            </div>
          </div>
        </div>

        <div className="nav-label">MAIN MENU</div>

        <nav className="nav-menu">
          <Link
            className="nav-item active"
            to="/admin/dashboard"
            onClick={closeSidebar}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/queries"
            onClick={closeSidebar}
          >
            <span className="nav-icon">◉</span>
            <span>Queries</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/students"
            onClick={closeSidebar}
          >
            <span className="nav-icon">♙</span>
            <span>Students</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/batches"
            onClick={closeSidebar}
          >
            <span className="nav-icon">▣</span>
            <span>Batches</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/careers"
            onClick={closeSidebar}
          >
            <span className="nav-icon">▤</span>
            <span>Career Applications</span>
          </Link>
        </nav>

        <div className="nav-label">MANAGEMENT</div>

        <nav className="nav-menu">
          <Link
            className="nav-item"
            to="/admin/report"
            onClick={closeSidebar}
          >
            <span className="nav-icon">◔</span>
            <span>Reports</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/settings"
            onClick={closeSidebar}
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
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
                {adminRole}
              </div>
            </div>

            <div className="online-dot"></div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="logout-icon">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            type="button"
            aria-label="Open menu"
            className="mobile-menu"
            id="mobileMenu"
            onClick={() =>
              setSidebarOpen((open) => !open)
            }
          >
            ☰
          </button>

          <div className="page-heading">
            <h1>Dashboard</h1>

            <p>
              Overview of your institute&apos;s activity
            </p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <span>⌕</span>

              <input
                id="globalSearch"
                placeholder="Search..."
                type="text"
                aria-label="Search dashboard"
              />
            </div>

            <button
              type="button"
              className="header-button"
              id="notificationButton"
              title="Notifications"
              aria-label="Notifications"
            >
              ♢
            </button>

            <button
              type="button"
              className="header-button"
              title="Admin profile"
              aria-label="Admin profile"
            >
              {adminInitials}
            </button>
          </div>
        </header>

        <section className="content">
          <div className="welcome-card">
            <div className="welcome-content">
              <div className="welcome-tag">
                ADMIN OVERVIEW
              </div>

              <h2>
                Good afternoon, {adminName} 👋
              </h2>

              <p>
                Here&apos;s what&apos;s happening across
                MedPath today.
              </p>
            </div>

            <div className="date-box">
              <div className="date-label">Today</div>

              <div
                className="date-value"
                id="currentDate"
              >
                {currentDate || "Loading..."}
              </div>
            </div>
          </div>

          <div className="section-header">
            <h3>Overview</h3>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-blue">
                  ◉
                </div>
              </div>

              <div className="stat-label">
                Total Queries
              </div>

              <div className="stat-number">
                {loadingQueries
                  ? "..."
                  : queryStats.total}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-mint">
                  ✦
                </div>
              </div>

              <div className="stat-label">
                New Queries
              </div>

              <div className="stat-number">
                {loadingQueries
                  ? "..."
                  : queryStats.newQueries}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-orange">
                  ↻
                </div>
              </div>

              <div className="stat-label">
                Follow-ups
              </div>

              <div className="stat-number">
                {loadingQueries
                  ? "..."
                  : queryStats.followUps}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-purple">
                  ✓
                </div>
              </div>

              <div className="stat-label">
                Resolved Queries
              </div>

              <div className="stat-number">
                {loadingQueries
                  ? "..."
                  : queryStats.resolvedQueries}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Recent Queries
                  </div>

                  <div className="card-subtitle">
                    Latest student enquiries received
                  </div>
                </div>

                <Link
                  className="section-link"
                  to="/admin/queries"
                >
                  View all →
                </Link>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>City</th>
                      <th>Query</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loadingQueries ? (
                      <tr>
                        <td colSpan="5">
                          <div className="dashboard-empty-state">
                            <div className="empty-icon">
                              ◌
                            </div>

                            <strong>
                              Loading queries...
                            </strong>

                            <span>
                              Fetching the latest enquiries.
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : queryError ? (
                      <tr>
                        <td colSpan="5">
                          <div className="dashboard-empty-state">
                            <div className="empty-icon">
                              !
                            </div>

                            <strong>
                              Unable to load queries
                            </strong>

                            <span>
                              {queryError}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : recentQueries.length === 0 ? (
                      <tr>
                        <td colSpan="5">
                          <div className="dashboard-empty-state">
                            <div className="empty-icon">
                              ◉
                            </div>

                            <strong>
                              No queries available
                            </strong>

                            <span>
                              New enquiries will appear here
                              once they are received.
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      recentQueries.map((query, index) => {
                        const status =
                          getQueryStatus(query);

                        return (
                          <tr
                            key={
                              query?._id ||
                              query?.id ||
                              `query-${index}`
                            }
                          >
                            <td>
                              {getQueryName(query)}
                            </td>

                            <td>
                              {query?.city || "—"}
                            </td>

                            <td>
                              {getQueryMessage(query)}
                            </td>

                            <td>
                              <span
                                className={`query-status ${getStatusClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>
                            </td>

                            <td>
                              {formatQueryDate(query)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Recent Activity
                  </div>

                  <div className="card-subtitle">
                    Latest actions on the platform
                  </div>
                </div>
              </div>

              <div className="activity-list">
                {loadingQueries ? (
                  <div className="dashboard-empty-state compact">
                    <div className="empty-icon">
                      ◌
                    </div>

                    <strong>
                      Loading activity...
                    </strong>

                    <span>
                      Please wait while dashboard data
                      loads.
                    </span>
                  </div>
                ) : recentQueries.length === 0 ? (
                  <div className="dashboard-empty-state compact">
                    <div className="empty-icon">
                      ✓
                    </div>

                    <strong>
                      No recent activity
                    </strong>

                    <span>
                      Platform activity will appear here
                      as actions are recorded.
                    </span>
                  </div>
                ) : (
                  recentQueries
                    .slice(0, 4)
                    .map((query, index) => (
                      <div
                        className="activity-item"
                        key={
                          query?._id ||
                          query?.id ||
                          `activity-${index}`
                        }
                      >
                        <div className="activity-icon">
                          ◉
                        </div>

                        <div className="activity-content">
                          <strong>
                            New enquiry from{" "}
                            {getQueryName(query)}
                          </strong>

                          <span>
                            {formatQueryDate(query)}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div className="lower-grid">
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Query Status
                  </div>

                  <div className="card-subtitle">
                    Current distribution of enquiries
                  </div>
                </div>
              </div>

              <div className="overview-body">
                {loadingQueries ? (
                  <div className="dashboard-empty-state compact">
                    <div className="empty-icon">
                      ◌
                    </div>

                    <strong>
                      Loading query status...
                    </strong>

                    <span>
                      Calculating current enquiry
                      distribution.
                    </span>
                  </div>
                ) : queryStatusData.length === 0 ? (
                  <div className="dashboard-empty-state compact">
                    <div className="empty-icon">
                      ◔
                    </div>

                    <strong>
                      No query status data
                    </strong>

                    <span>
                      Status distribution will appear
                      once queries are added.
                    </span>
                  </div>
                ) : (
                  <div className="query-status-list">
                    {queryStatusData.map(
                      ([status, count]) => (
                        <div
                          className="query-status-row"
                          key={status}
                        >
                          <div className="query-status-name">
                            <span
                              className={`status-dot ${getStatusClass(
                                status
                              )}`}
                            ></span>

                            <span>{status}</span>
                          </div>

                          <strong>{count}</strong>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    Quick Actions
                  </div>

                  <div className="card-subtitle">
                    Frequently used admin actions
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <Link
                  className="quick-action"
                  to="/admin/queries"
                >
                  <div className="quick-icon">
                    ◉
                  </div>

                  <div>
                    <strong>View Queries</strong>
                    <span>Manage enquiries</span>
                  </div>
                </Link>

                <Link
                  className="quick-action"
                  to="/admin/students"
                >
                  <div className="quick-icon">
                    ♙
                  </div>

                  <div>
                    <strong>Students</strong>
                    <span>
                      View student records
                    </span>
                  </div>
                </Link>

                <Link
                  className="quick-action"
                  to="/admin/batches"
                >
                  <div className="quick-icon">
                    ▣
                  </div>

                  <div>
                    <strong>Batches</strong>
                    <span>Manage programs</span>
                  </div>
                </Link>

                <Link
                  className="quick-action"
                  to="/admin/careers"
                >
                  <div className="quick-icon">
                    💼
                  </div>

                  <div>
                    <strong>Careers</strong>
                    <span>
                      Review applications
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminDashboard;