import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../services/apiService";
import "./adminaddcareerapplicant.css";

function AdminCareer() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // SIDEBAR
  // ========================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ========================================
  // FETCH CAREER APPLICATIONS
  // ========================================

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/careers");

      const applicants = Array.isArray(data?.applicants)
        ? data.applicants
        : [];

      setApplications(applicants);
    } catch (err) {
      console.error(
        "Error loading career applications:",
        err
      );

      setError(
        err.message ||
          "Unable to load career applications. Please check the backend server."
      );

      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ========================================
  // NORMALIZE STATUS
  // ========================================

  const normalizeStatus = (status) => {
    return String(status || "")
      .trim()
      .toLowerCase();
  };

  // ========================================
  // SEARCH + FILTER
  // ========================================

  const filteredApplications = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return applications.filter((application) => {
      const applicantName = String(
        application.applicantName || ""
      ).toLowerCase();

      const email = String(
        application.email || ""
      ).toLowerCase();

      const phone = String(
        application.phone || ""
      ).toLowerCase();

      const position = String(
        application.position || ""
      ).toLowerCase();

      const source = String(
        application.source || ""
      ).toLowerCase();

      const status = normalizeStatus(
        application.status
      );

      const matchesSearch =
        searchText === "" ||
        applicantName.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText) ||
        position.includes(searchText) ||
        source.includes(searchText);

      let matchesStatus = true;

      if (statusFilter === "new") {
        matchesStatus = status === "new";
      }

      if (statusFilter === "review") {
        matchesStatus =
          status === "under review" ||
          status === "review" ||
          status === "in review";
      }

      if (statusFilter === "interview") {
        matchesStatus = status === "interview";
      }

      if (statusFilter === "selected") {
        matchesStatus =
          status === "shortlisted" ||
          status === "offer" ||
          status === "selected";
      }

      if (statusFilter === "rejected") {
        matchesStatus = status === "rejected";
      }

      if (statusFilter === "joined") {
        matchesStatus =
          status === "hired" ||
          status === "joined";
      }

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // ========================================
  // STATISTICS
  // ========================================

  const totalApplications = applications.length;

  const newApplications = applications.filter(
    (application) =>
      normalizeStatus(application.status) === "new"
  ).length;

  const inReviewApplications = applications.filter(
    (application) => {
      const status = normalizeStatus(
        application.status
      );

      return (
        status === "under review" ||
        status === "review" ||
        status === "in review"
      );
    }
  ).length;

  const selectedApplications = applications.filter(
    (application) => {
      const status = normalizeStatus(
        application.status
      );

      return (
        status === "shortlisted" ||
        status === "offer" ||
        status === "selected" ||
        status === "hired" ||
        status === "joined"
      );
    }
  ).length;

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "all";

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "new") {
      return "status-new";
    }

    if (
      normalized === "under review" ||
      normalized === "review" ||
      normalized === "in review"
    ) {
      return "status-review";
    }

    if (normalized === "shortlisted") {
      return "status-shortlisted";
    }

    if (normalized === "interview") {
      return "status-interview";
    }

    if (normalized === "offer") {
      return "status-offer";
    }

    if (
      normalized === "hired" ||
      normalized === "joined"
    ) {
      return "status-hired";
    }

    if (normalized === "rejected") {
      return "status-rejected";
    }

    if (normalized === "withdrawn") {
      return "status-withdrawn";
    }

    return "";
  };

  // ========================================
  // VIEW APPLICANT
  // ========================================

  const handleViewApplicant = (application) => {
    const applicantId = application?._id;

    if (!applicantId) {
      setError(
        "Unable to open applicant details because the applicant ID is missing."
      );
      return;
    }

    navigate(
      `/admin/career-details?applicant=${encodeURIComponent(
        applicantId
      )}`
    );
  };

  // ========================================
  // ADD APPLICANT
  // ========================================

  const handleAddApplicant = () => {
    navigate("/admin/careers/add");
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      {/* ========================================
          SIDEBAR OVERLAY
      ======================================== */}

      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "show" : ""
        }`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="brand">
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

        <div className="sidebar-nav">
          <div className="nav-label">
            Main Menu
          </div>

          <nav>
            <Link
              className="nav-item"
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
              className="nav-item active"
              to="/admin/careers"
              onClick={closeSidebar}
            >
              <span className="nav-icon">▤</span>
              <span>Career Applications</span>
            </Link>
          </nav>

          <div className="nav-label">
            Management
          </div>

          <nav>
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
        </div>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">
              AD
            </div>

            <div className="admin-info">
              <div className="admin-name">
                Admin
              </div>

              <div className="admin-role">
                Administrator
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="main">
        {/* TOPBAR */}

        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
            >
              ☰
            </button>

            <div>
              <div className="page-title">
                Career Applications
              </div>

              <div className="page-subtitle">
                Review and manage applications
                submitted through MedPath Academy
              </div>
            </div>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
              title="Notifications"
            >
              ♢
            </button>

            <button
              type="button"
              className="icon-button"
              aria-label="Admin profile"
              title="Admin profile"
            >
              AD
            </button>
          </div>
        </header>

        {/* CONTENT */}

        <section className="content">
          <div className="page-intro">
            <div>
              <div className="intro-heading">
                Career Applications
              </div>

              <p className="intro-text">
                Applications received from
                candidates are displayed here for
                recruitment management.
              </p>
            </div>

            <button
              type="button"
              className="add-btn"
              onClick={handleAddApplicant}
            >
              + Add Applicant
            </button>
          </div>

          {/* ========================================
              STATS
          ======================================== */}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">
                  Total Applications
                </span>

                <div className="stat-icon">
                  ▤
                </div>
              </div>

              <div className="stat-number">
                {totalApplications}
              </div>

              <div className="stat-meta">
                All career applications
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">
                  New Applications
                </span>

                <div className="stat-icon">
                  +
                </div>
              </div>

              <div className="stat-number">
                {newApplications}
              </div>

              <div className="stat-meta">
                Awaiting review
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">
                  In Review
                </span>

                <div className="stat-icon">
                  ◌
                </div>
              </div>

              <div className="stat-number">
                {inReviewApplications}
              </div>

              <div className="stat-meta">
                Currently being reviewed
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-label">
                  Selected
                </span>

                <div className="stat-icon">
                  ✓
                </div>
              </div>

              <div className="stat-number">
                {selectedApplications}
              </div>

              <div className="stat-meta">
                Shortlisted, offer or hired
              </div>
            </div>
          </div>

          {/* ========================================
              APPLICATION DIRECTORY
          ======================================== */}

          <div className="panel">
            <div className="panel-header">
              <div className="panel-heading">
                Application Directory
              </div>

              <div className="panel-description">
                Search and filter candidate
                applications.
              </div>
            </div>

            {/* FILTERS */}

            <div className="filter-row">
              <div className="search-box">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  className="form-control"
                  type="search"
                  placeholder="Search applicants..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  aria-label="Search applicants"
                />
              </div>

              <select
                className="form-control"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                aria-label="Filter by status"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="new">
                  New
                </option>

                <option value="review">
                  In Review
                </option>

                <option value="interview">
                  Interview
                </option>

                <option value="selected">
                  Selected
                </option>

                <option value="rejected">
                  Rejected
                </option>

                <option value="joined">
                  Joined
                </option>
              </select>

              <button
                type="button"
                className="clear-btn"
                onClick={clearFilters}
                disabled={!hasFilters}
              >
                Clear
              </button>
            </div>

            {/* LOADING */}

            {loading && (
              <div className="empty-state visible">
                <div className="empty-icon">
                  ◌
                </div>

                <h3>
                  Loading career applications...
                </h3>

                <p>
                  Please wait while applications
                  are loaded from the database.
                </p>
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="empty-state visible">
                <div className="empty-icon">
                  !
                </div>

                <h3>
                  Unable to load applications
                </h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="clear-btn"
                  onClick={fetchApplications}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              filteredApplications.length ===
                0 && (
                <div className="empty-state visible">
                  <div className="empty-icon">
                    ▤
                  </div>

                  <h3>
                    {applications.length ===
                    0
                      ? "No career applications yet"
                      : "No matching applications"}
                  </h3>

                  <p>
                    {applications.length ===
                    0
                      ? "Candidate applications will appear here automatically when they are submitted through the website."
                      : "Try changing your search or status filter to find an application."}
                  </p>
                </div>
              )}

            {/* ========================================
                TABLE
            ======================================== */}

            {!loading &&
              !error &&
              filteredApplications.length >
                0 && (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Position</th>
                        <th>Date</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map(
                        (application) => (
                          <tr
                            key={
                              application._id ||
                              application.id
                            }
                          >
                            <td>
                              <div className="applicant-cell">
                                <strong>
                                  {application.applicantName ||
                                    "—"}
                                </strong>

                                {application.email && (
                                  <small>
                                    {
                                      application.email
                                    }
                                  </small>
                                )}
                              </div>
                            </td>

                            <td>
                              {application.position ||
                                "—"}
                            </td>

                            <td>
                              {formatDate(
                                application.appliedOn ||
                                  application.createdAt
                              )}
                            </td>

                            <td>
                              {application.source ||
                                "—"}
                            </td>

                            <td>
                              <span
                                className={`status-badge ${getStatusClass(
                                  application.status
                                )}`}
                              >
                                {application.status ||
                                  "—"}
                              </span>
                            </td>

                            {/* ========================================
                                ONLY VIEW BUTTON
                            ======================================== */}

                            <td>
                              <button
                                type="button"
                                className="action-btn"
                                onClick={() =>
                                  handleViewApplicant(
                                    application
                                  )
                                }
                                title="View applicant details"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminCareer;