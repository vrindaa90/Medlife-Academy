import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminqueries.css";
import apiRequest from "../../services/apiService";

function AdminQueries() {
  const navigate = useNavigate();

  const [queries, setQueries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH REAL QUERIES
  ========================================================= */

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/queries");

        const formattedQueries = (data.queries || []).map((query) => {
          const createdAt = query.createdAt
            ? new Date(query.createdAt)
            : null;

          return {
            ...query,

            id: query._id,

            initials: query.name
              ? query.name
                  .split(" ")
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "NA",

            status: query.status || "new",

            statusLabel:
              query.statusLabel ||
              (query.status === "contacted"
                ? "Contacted"
                : query.status === "followup"
                ? "Follow-up"
                : query.status === "resolved"
                ? "Resolved"
                : "New"),

            type: query.type || "General Enquiry",

            date: createdAt
              ? createdAt.toDateString() === new Date().toDateString()
                ? "today"
                : new Date(
                    createdAt.getFullYear(),
                    createdAt.getMonth(),
                    createdAt.getDate()
                  ).getTime() ===
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate() - 1
                  ).getTime()
                ? "yesterday"
                : "week"
              : "week",

            received: createdAt
              ? createdAt.toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Not available",
          };
        });

        setQueries(formattedQueries);
      } catch (err) {
        console.error("Error fetching queries:", err);

        setError(
          "Unable to load queries. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  /* =========================================================
     CITIES FROM REAL DATA
  ========================================================= */

  const cities = useMemo(() => {
    return [
      ...new Set(
        queries.map((query) => query.city).filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [queries]);

  /* =========================================================
     FILTER QUERIES
  ========================================================= */

  const filteredQueries = useMemo(() => {
    const value = search.trim().toLowerCase();

    return queries.filter((query) => {
      const searchable = [
        query.name,
        query.email,
        query.phone,
        query.city,
        query.message,
        query.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!value || searchable.includes(value)) &&
        (statusFilter === "all" ||
          query.status === statusFilter) &&
        (cityFilter === "all" ||
          query.city === cityFilter) &&
        (dateFilter === "all" ||
          query.date === dateFilter)
      );
    });
  }, [
    queries,
    search,
    statusFilter,
    cityFilter,
    dateFilter,
  ]);

  /* =========================================================
     REAL STATISTICS
  ========================================================= */

  const totalQueries = queries.length;

  const newQueries = queries.filter(
    (query) => query.status === "new"
  ).length;

  const contactedQueries = queries.filter(
    (query) => query.status === "contacted"
  ).length;

  const followupQueries = queries.filter(
    (query) => query.status === "followup"
  ).length;

  const resolvedQueries = queries.filter(
    (query) => query.status === "resolved"
  ).length;

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCityFilter("all");
    setDateFilter("all");
  };

  /* =========================================================
     VIEW QUERY
  ========================================================= */

  const viewQuery = (query) => {
    navigate(
      `/admin/query-details?query=${encodeURIComponent(
        query.id
      )}`,
      {
        state: { query },
      }
    );
  };

  const hasQueries = filteredQueries.length > 0;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          SIDEBAR OVERLAY
      ===================================================== */}

      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "show" : ""
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
        id="sidebar"
      >
        <div className="sidebar-brand">
          <div className="brand-logo">M</div>

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
            to="/admin/dashboard"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/queries"
            className="nav-item active"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">◉</span>
            <span>Queries</span>
          </Link>

          <Link
            to="/admin/students"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">♙</span>
            <span>Students</span>
          </Link>

          <Link
            to="/admin/batches"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">▣</span>
            <span>Batches</span>
          </Link>

          <Link
            to="/admin/careers"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">▤</span>
            <span>Career Applications</span>
          </Link>
        </nav>

        <div className="nav-label">MANAGEMENT</div>

        <nav className="nav-menu">
          <Link
            to="/admin/report"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">◔</span>
            <span>Reports</span>
          </Link>

          <Link
            to="/admin/settings"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">AD</div>

            <div className="admin-info">
              <div className="admin-name">
                Admin
              </div>

              <div className="admin-role">
                Super Administrator
              </div>
            </div>

            <div className="online-dot" />
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main">
        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="topbar">
          <button
            type="button"
            className="mobile-menu"
            id="mobileMenu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="page-heading">
            <h1>Queries</h1>

            <p>
              Manage and track student enquiries
            </p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="header-button"
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
              AD
            </button>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <section className="content">
          {/* =================================================
              PAGE INTRO
          ================================================= */}

          <div className="page-intro">
            <div className="intro-left">
              <h2>Student Queries</h2>

              <p>
                View, filter and track every enquiry received
                through MedPath.
              </p>
            </div>

            <button
              type="button"
              className="export-button"
              disabled={!hasQueries}
            >
              ↓ Export Queries
            </button>
          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="stats-grid">
            <button
              type="button"
              className={`stat-card ${
                statusFilter === "all"
                  ? "active"
                  : ""
              }`}
              onClick={() => setStatusFilter("all")}
            >
              <span className="stat-label">
                All Queries
              </span>

              <span className="stat-number">
                {totalQueries}
              </span>

              <span className="stat-line">
                Total enquiries
              </span>
            </button>

            <button
              type="button"
              className={`stat-card new ${
                statusFilter === "new"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStatusFilter("new")
              }
            >
              <span className="stat-label">
                New
              </span>

              <span className="stat-number">
                {newQueries}
              </span>

              <span className="stat-line">
                Need attention
              </span>
            </button>

            <button
              type="button"
              className={`stat-card contacted ${
                statusFilter === "contacted"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStatusFilter("contacted")
              }
            >
              <span className="stat-label">
                Contacted
              </span>

              <span className="stat-number">
                {contactedQueries}
              </span>

              <span className="stat-line">
                Already reached
              </span>
            </button>

            <button
              type="button"
              className={`stat-card followup ${
                statusFilter === "followup"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStatusFilter("followup")
              }
            >
              <span className="stat-label">
                Follow-up
              </span>

              <span className="stat-number">
                {followupQueries}
              </span>

              <span className="stat-line">
                Follow-up required
              </span>
            </button>

            <button
              type="button"
              className={`stat-card resolved ${
                statusFilter === "resolved"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setStatusFilter("resolved")
              }
            >
              <span className="stat-label">
                Resolved
              </span>

              <span className="stat-number">
                {resolvedQueries}
              </span>

              <span className="stat-line">
                Successfully closed
              </span>
            </button>
          </div>

          {/* =================================================
              QUERY PANEL
          ================================================= */}

          <div className="query-panel">
            {/* ===============================================
                FILTER BAR
            =============================================== */}

            <div className="filter-bar">
              <div className="search-wrapper">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  id="querySearch"
                  className="search-input"
                  placeholder="Search by name, email, mobile, city or query..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <select
                id="statusFilter"
                className="filter-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="new">
                  New
                </option>

                <option value="contacted">
                  Contacted
                </option>

                <option value="followup">
                  Follow-up
                </option>

                <option value="resolved">
                  Resolved
                </option>
              </select>

              <select
                id="cityFilter"
                className="filter-select"
                value={cityFilter}
                onChange={(event) =>
                  setCityFilter(event.target.value)
                }
              >
                <option value="all">
                  All Cities
                </option>

                {cities.map((city) => (
                  <option
                    key={city}
                    value={city}
                  >
                    {city}
                  </option>
                ))}
              </select>

              <select
                id="dateFilter"
                className="filter-select"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
              >
                <option value="all">
                  All Dates
                </option>

                <option value="today">
                  Today
                </option>

                <option value="yesterday">
                  Yesterday
                </option>

                <option value="week">
                  This Week
                </option>
              </select>

              <button
                type="button"
                className="clear-button"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>

            {/* ===============================================
                RECORD HEADER
            =============================================== */}

            <div className="table-top">
              <div className="table-title">
                Query Records
              </div>

              <div className="result-count">
                {loading
                  ? "Loading queries..."
                  : `${filteredQueries.length} matching queries`}
              </div>
            </div>

            {/* ===============================================
                LOADING
            =============================================== */}

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">
                  ⌛
                </div>

                <h3>
                  Loading queries
                </h3>

                <p>
                  Fetching the latest enquiries from
                  the MedPath database.
                </p>
              </div>
            ) : error ? (
              /* =============================================
                 ERROR
              ============================================= */

              <div className="empty-state">
                <div className="empty-icon">
                  !
                </div>

                <h3>
                  Unable to load queries
                </h3>

                <p>
                  {error}
                </p>
              </div>
            ) : hasQueries ? (
              /* =============================================
                 QUERY TABLE
              ============================================= */

              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Student
                        </th>

                        <th>
                          Mobile
                        </th>

                        <th>
                          City
                        </th>

                        <th>
                          Query
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Received
                        </th>

                        <th>
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredQueries.map(
                        (query) => (
                          <tr
                            className="query-row"
                            key={query.id}
                          >
                            {/* STUDENT */}

                            <td>
                              <div className="student">
                                <div className="avatar">
                                  {query.initials}
                                </div>

                                <div>
                                  <div className="student-name">
                                    {query.name ||
                                      "Unnamed"}
                                  </div>

                                  <div className="student-email">
                                    {query.email ||
                                      "No email"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* MOBILE */}

                            <td>
                              {query.phone || "—"}
                            </td>

                            {/* CITY */}

                            <td>
                              {query.city || "—"}
                            </td>

                            {/* QUERY */}

                            <td className="query-cell">
                              <div className="query-main">
                                {query.message ||
                                  "No message"}
                              </div>

                              <div className="query-type">
                                {query.type}
                              </div>
                            </td>

                            {/* STATUS */}

                            <td>
                              <span
                                className={`status status-${query.status}`}
                              >
                                {query.statusLabel}
                              </span>
                            </td>

                            {/* RECEIVED */}

                            <td>
                              {query.received}
                            </td>

                            {/* ACTION */}

                            <td>
                              <button
                                type="button"
                                className="view-button"
                                onClick={() =>
                                  viewQuery(query)
                                }
                              >
                                View →
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* =========================================
                    PAGINATION / RESULT INFO
                ========================================= */}

                <div className="pagination">
                  <div className="pagination-info">
                    Showing{" "}
                    {filteredQueries.length}{" "}
                    queries
                  </div>
                </div>
              </>
            ) : (
              /* =============================================
                 NO RESULTS
              ============================================= */

              <div className="empty-state">
                <div className="empty-icon">
                  ⌕
                </div>

                <h3>
                  No queries found
                </h3>

                <p>
                  {queries.length === 0
                    ? "New student enquiries will appear here once they are received."
                    : "Try changing your search or filters."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminQueries;