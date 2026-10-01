import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminbatches.css";
import apiRequest from "../../services/apiService";
import { useAuth } from "../../context/authcontext";

function AdminBatches() {
  const navigate = useNavigate();
  const { admin } = useAuth();

  // Dynamic logged-in admin information
  const adminName = admin?.name || "Admin";

  const adminRole =
    admin?.role === "superadmin"
      ? "Super Administrator"
      : "Administrator";

  const adminInitials =
    adminName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [centreFilter, setCentreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Backend batch data
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH BATCHES
  // =========================================================

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Authenticated API request.
       *
       * apiRequest automatically attaches:
       * Authorization: Bearer <admin JWT>
       */
      const data = await apiRequest("/batches");

      const batches = Array.isArray(data)
        ? data
        : Array.isArray(data.batches)
          ? data.batches
          : Array.isArray(data.data)
            ? data.data
            : [];

      setBatchData(batches);
    } catch (err) {
      console.error("Error fetching batches:", err);

      setError(
        err.message ||
          "Unable to load batches. Please check if the backend server is running.",
      );

      setBatchData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // =========================================================
  // FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCourseFilter("all");
    setCentreFilter("all");
    setStatusFilter("all");
  };

  const hasFilters =
    search.trim() !== "" ||
    courseFilter !== "all" ||
    centreFilter !== "all" ||
    statusFilter !== "all";

  // =========================================================
  // VIEW BATCH
  // =========================================================

  const handleViewBatch = (batchCode) => {
    if (!batchCode) {
      return;
    }

    navigate(
      `/admin/batch-details?batch=${encodeURIComponent(batchCode)}`,
    );
  };

  // =========================================================
  // MOBILE SIDEBAR
  // =========================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =========================================================
  // FILTER BATCHES
  // =========================================================

  const filteredBatches = batchData.filter((batch) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      searchText === "" ||
      String(batch.batchName || "")
        .toLowerCase()
        .includes(searchText) ||
      String(batch.batchCode || "")
        .toLowerCase()
        .includes(searchText) ||
      String(batch.course || "")
        .toLowerCase()
        .includes(searchText) ||
      String(batch.centre || "")
        .toLowerCase()
        .includes(searchText) ||
      String(batch.coordinator || "")
        .toLowerCase()
        .includes(searchText);

    const matchesCourse =
      courseFilter === "all" ||
      String(batch.course || "").toLowerCase() ===
        courseFilter.toLowerCase();

    const matchesCentre =
      centreFilter === "all" ||
      String(batch.centre || "").toLowerCase() ===
        centreFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      String(batch.status || "").toLowerCase() ===
        statusFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesCourse &&
      matchesCentre &&
      matchesStatus
    );
  });

  // =========================================================
  // DYNAMIC STATISTICS
  // =========================================================

  const totalBatches = batchData.length;

  const activeBatches = batchData.filter(
    (batch) =>
      String(batch.status || "").toLowerCase() === "active",
  ).length;

  const upcomingBatches = batchData.filter(
    (batch) =>
      String(batch.status || "").toLowerCase() === "upcoming",
  ).length;

  const totalEnrolled = batchData.reduce(
    (total, batch) =>
      total + Number(batch.currentStudents || 0),
    0,
  );

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
      {/* =====================================================
          SIDEBAR OVERLAY
          ===================================================== */}

      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "show" : ""
        }`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
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

        <div className="nav-label">
          MAIN MENU
        </div>

        <nav className="nav-menu">
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
            className="nav-item active"
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

        <div className="nav-label">
          MANAGEMENT
        </div>

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

        {/* Dynamic logged-in admin profile */}
        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">
              {adminInitials}
            </div>

            <div>
              <div className="admin-name">
                {adminName}
              </div>

              <div className="admin-role">
                {adminRole}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="main">
        {/* TOPBAR */}

        <header className="topbar">
          <button
            type="button"
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="page-heading">
            <h1>Batches</h1>

            <p>
              Manage academic batches and enrollment
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

            {/* Dynamic admin initials */}
            <button
              type="button"
              className="header-button profile-button"
              title={`${adminName} profile`}
              aria-label="Admin profile"
            >
              {adminInitials}
            </button>
          </div>
        </header>

        {/* =====================================================
            PAGE CONTENT
            ===================================================== */}

        <section className="content">
          {/* PAGE INTRO */}

          <div className="page-intro">
            <div className="intro-left">
              <span className="section-eyebrow">
                ACADEMIC MANAGEMENT
              </span>

              <h2>Batch Directory</h2>

              <p>
                View and manage batches created through
                the MedPath Academy system.
              </p>
            </div>

            <Link
              className="add-batch"
              to="/admin/add-batch"
            >
              <span>+</span>
              Add Batch
            </Link>
          </div>

          {/* =================================================
              STATISTICS
              ================================================= */}

          <div className="stats-grid">
            {/* Total Batches */}

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-blue">
                  ▣
                </div>
              </div>

              <div className="stat-label">
                Total Batches
              </div>

              <div className="stat-number">
                {totalBatches}
              </div>

              <div className="stat-line">
                {totalBatches === 0
                  ? "No batch records yet"
                  : `${totalBatches} batch${
                      totalBatches !== 1
                        ? "es"
                        : ""
                    } in system`}
              </div>
            </div>

            {/* Active Batches */}

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-green">
                  ✓
                </div>
              </div>

              <div className="stat-label">
                Active Batches
              </div>

              <div className="stat-number">
                {activeBatches}
              </div>

              <div className="stat-line">
                {activeBatches === 0
                  ? "No active batches yet"
                  : `${activeBatches} active batch${
                      activeBatches !== 1
                        ? "es"
                        : ""
                    }`}
              </div>
            </div>

            {/* Upcoming Batches */}

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-purple">
                  ✦
                </div>
              </div>

              <div className="stat-label">
                Upcoming Batches
              </div>

              <div className="stat-number">
                {upcomingBatches}
              </div>

              <div className="stat-line">
                {upcomingBatches === 0
                  ? "No upcoming batches yet"
                  : `${upcomingBatches} upcoming batch${
                      upcomingBatches !== 1
                        ? "es"
                        : ""
                    }`}
              </div>
            </div>

            {/* Total Enrollment */}

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-orange">
                  ♙
                </div>
              </div>

              <div className="stat-label">
                Total Enrolled
              </div>

              <div className="stat-number">
                {totalEnrolled}
              </div>

              <div className="stat-line">
                {totalEnrolled === 0
                  ? "No enrollment data yet"
                  : `${totalEnrolled} student${
                      totalEnrolled !== 1
                        ? "s"
                        : ""
                    } enrolled`}
              </div>
            </div>
          </div>

          {/* =================================================
              BATCH PANEL
              ================================================= */}

          <div className="batch-panel">
            {/* FILTERS */}

            <div className="filter-bar">
              {/* Search */}

              <div className="search-wrapper">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  className="search-input"
                  type="text"
                  placeholder="Search batches..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              {/* Course Filter */}

              <select
                className="filter-select"
                value={courseFilter}
                onChange={(event) =>
                  setCourseFilter(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  All Courses
                </option>

                <option value="NEET Class 11">
                  NEET Class 11
                </option>

                <option value="NEET Class 12">
                  NEET Class 12
                </option>

                <option value="NEET 2.0">
                  NEET 2.0
                </option>

                <option value="Online NEET Preparation">
                  Online NEET Preparation
                </option>

                <option value="NEET Crash Course">
                  NEET Crash Course
                </option>

                <option value="NEET Test Series">
                  NEET Test Series
                </option>
              </select>

              {/* Centre Filter */}

              <select
                className="filter-select"
                value={centreFilter}
                onChange={(event) =>
                  setCentreFilter(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  All Centres
                </option>

                <option value="Rohini">
                  Rohini
                </option>

                <option value="Lajpat Nagar">
                  Lajpat Nagar
                </option>

                <option value="Dwarka">
                  Dwarka
                </option>

                <option value="Pitampura">
                  Pitampura
                </option>

                <option value="Janakpuri">
                  Janakpuri
                </option>

                <option value="Online">
                  Online
                </option>
              </select>

              {/* Status Filter */}

              <select
                className="filter-select"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="upcoming">
                  Upcoming
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>

              {/* Clear Filters */}

              <button
                type="button"
                className="clear-button"
                onClick={clearFilters}
                disabled={!hasFilters}
              >
                Clear
              </button>
            </div>

            {/* =================================================
                TABLE HEADER
                ================================================= */}

            <div className="table-header">
              <div>
                <div className="table-title">
                  Batch Records
                </div>

                <div className="table-subtitle">
                  {loading
                    ? "Loading batches..."
                    : error
                      ? "Unable to load records"
                      : hasFilters
                        ? `Showing ${
                            filteredBatches.length
                          } matching record${
                            filteredBatches.length !==
                            1
                              ? "s"
                              : ""
                          }`
                        : "Connected records from the MedPath Academy database"}
                </div>
              </div>

              <div className="batch-count">
                {loading
                  ? "Loading..."
                  : `${filteredBatches.length} batch${
                      filteredBatches.length !== 1
                        ? "es"
                        : ""
                    }`}
              </div>
            </div>

            {/* =================================================
                LOADING STATE
                ================================================= */}

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">
                  ▣
                </div>

                <h3>
                  Loading batches...
                </h3>

                <p>
                  Fetching batch records from
                  the MedPath Academy backend.
                </p>
              </div>
            ) : error ? (
              /* =================================================
                 ERROR STATE
                 ================================================= */

              <div className="empty-state">
                <div className="empty-icon">
                  ⚠
                </div>

                <h3>
                  Unable to load batches
                </h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="empty-action"
                  onClick={fetchBatches}
                >
                  Try Again
                </button>
              </div>
            ) : filteredBatches.length === 0 ? (
              /* =================================================
                 EMPTY / NO MATCH STATE
                 ================================================= */

              <div className="empty-state">
                <div className="empty-icon">
                  ▣
                </div>

                <h3>
                  {hasFilters
                    ? "No matching batches"
                    : "No batches available"}
                </h3>

                <p>
                  {hasFilters
                    ? "Try changing your search or filters to find a batch."
                    : "There are no batch records to display yet. Create a batch using the Add Batch button."}
                </p>

                {hasFilters ? (
                  <button
                    type="button"
                    className="empty-action"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link
                    className="empty-action"
                    to="/admin/add-batch"
                  >
                    Create your first batch
                  </Link>
                )}
              </div>
            ) : (
              /* =================================================
                 BATCH TABLE
                 ================================================= */

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Batch</th>
                      <th>Course</th>
                      <th>Type</th>
                      <th>Centre</th>
                      <th>Coordinator</th>
                      <th>Students</th>
                      <th>Start Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBatches.map(
                      (batch) => (
                        <tr
                          key={
                            batch._id ||
                            batch.batchCode
                          }
                        >
                          {/* Batch */}

                          <td>
                            <div className="batch-cell">
                              <div className="batch-icon">
                                ▣
                              </div>

                              <div>
                                <div className="batch-name">
                                  {batch.batchName ||
                                    "Unnamed Batch"}
                                </div>

                                <div className="batch-code">
                                  {batch.batchCode ||
                                    "—"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Course */}

                          <td>
                            {batch.course || "—"}
                          </td>

                          {/* Type */}

                          <td>
                            {batch.batchType || "—"}
                          </td>

                          {/* Centre */}

                          <td>
                            {batch.centre || "—"}
                          </td>

                          {/* Coordinator */}

                          <td>
                            {batch.coordinator ||
                              "—"}
                          </td>

                          {/* Students */}

                          <td>
                            {Number(
                              batch.currentStudents ||
                                0,
                            )}{" "}
                            /{" "}
                            {Number(
                              batch.capacity || 0,
                            )}
                          </td>

                          {/* Start Date */}

                          <td>
                            {batch.startDate
                              ? new Date(
                                  batch.startDate,
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </td>

                          {/* Status */}

                          <td>
                            <span
                              className={`status status-${String(
                                batch.status ||
                                  "",
                              ).toLowerCase()}`}
                            >
                              {batch.status ||
                                "Unknown"}
                            </span>
                          </td>

                          {/* Action */}

                          <td>
                            <button
                              type="button"
                              className="view-button"
                              onClick={() =>
                                handleViewBatch(
                                  batch.batchCode,
                                )
                              }
                            >
                              View →
                            </button>
                          </td>
                        </tr>
                      ),
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

export default AdminBatches;