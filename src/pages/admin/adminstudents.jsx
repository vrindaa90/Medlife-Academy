import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminstudents.css";
import apiRequest from "../../services/apiService";
import { useAuth } from "../../context/authcontext";

function AdminStudents() {
  const navigate = useNavigate();
  const { admin } = useAuth();

  /* =========================================================
     ADMIN INFORMATION
  ========================================================= */

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

  /* =========================================================
     STATE
  ========================================================= */

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [centreFilter, setCentreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH STUDENTS
  ========================================================= */

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/students");

        const rawStudents = Array.isArray(data?.students)
          ? data.students
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];

        const formattedStudents = rawStudents.map((rawStudent) => {
          const student =
            rawStudent?.student &&
            typeof rawStudent.student === "object"
              ? rawStudent.student
              : rawStudent || {};

          const createdAt = student.createdAt
            ? new Date(student.createdAt)
            : null;

          /* ---------------------------------------------------
             NORMALIZE NAME
          --------------------------------------------------- */

          let studentName = "";

          const possibleNames = [
            student.name,
            student.studentName,
            student.fullName,
            student.student?.name,
            student.profile?.name,
            student.personalInfo?.name,
            student.personalDetails?.name,
          ];

          for (const candidate of possibleNames) {
            if (
              typeof candidate === "string" &&
              candidate.trim()
            ) {
              studentName = candidate.trim();
              break;
            }
          }

          if (!studentName) {
            const firstName =
              typeof student.firstName === "string"
                ? student.firstName.trim()
                : "";

            const lastName =
              typeof student.lastName === "string"
                ? student.lastName.trim()
                : "";

            studentName =
              `${firstName} ${lastName}`.trim();
          }

          if (!studentName) {
            studentName = "Unnamed Student";
          }

          /* ---------------------------------------------------
             NORMALIZE OTHER FIELDS
          --------------------------------------------------- */

          const studentEmail =
            student.email ||
            student.studentEmail ||
            student.student?.email ||
            "";

          const mobile =
            student.phone ||
            student.mobile ||
            student.studentMobile ||
            student.studentPhone ||
            "";

          const className =
            student.className ||
            student.studentClass ||
            student.class ||
            "";

          const batch = student.batch || "";
          const centre = student.centre || "";

          const initials = studentName
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

          const studentId =
            student.studentId ||
            student.id ||
            student._id ||
            "";

          const status = student.status || "active";

          const statusLabel =
            status === "pending"
              ? "Pending"
              : status === "inactive"
                ? "Inactive"
                : status === "completed"
                  ? "Completed"
                  : status === "dropped"
                    ? "Dropped"
                    : "Active";

          return {
            ...student,
            _id: student._id,

            id: String(studentId),

            name: studentName,
            displayName: studentName,

            email: String(studentEmail || ""),
            initials: initials || "ST",

            mobile: String(mobile || ""),
            batch: String(batch || ""),
            centre: String(centre || ""),
            className: String(className || ""),

            status,
            statusLabel,

            createdAt,

            batchKey: batch
              ? String(batch)
                  .toLowerCase()
                  .replace(/\s+/g, "-")
              : "",

            centreKey: centre
              ? String(centre)
                  .toLowerCase()
                  .replace(/\s+/g, "-")
              : "",
          };
        });

        console.log(
          "MedPath students loaded:",
          formattedStudents
        );

        setStudents(formattedStudents);
      } catch (err) {
        console.error(
          "Error fetching students:",
          err
        );

        setError(
          err?.message ||
            "Unable to load students. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* =========================================================
     BATCH OPTIONS
  ========================================================= */

  const batchOptions = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) => student.batch)
          .filter(Boolean)
      ),
    ]
      .sort((a, b) => a.localeCompare(b))
      .map((batch) => ({
        label: batch,
        value: batch
          .toLowerCase()
          .replace(/\s+/g, "-"),
      }));
  }, [students]);

  /* =========================================================
     CENTRE OPTIONS
  ========================================================= */

  const centreOptions = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) => student.centre)
          .filter(Boolean)
      ),
    ]
      .sort((a, b) => a.localeCompare(b))
      .map((centre) => ({
        label: centre,
        value: centre
          .toLowerCase()
          .replace(/\s+/g, "-"),
      }));
  }, [students]);

  /* =========================================================
     FILTER STUDENTS
  ========================================================= */

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    return students.filter((student) => {
      const searchable = [
        student.name,
        student.email,
        student.mobile,
        student.id,
        student.className,
        student.batch,
        student.centre,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!value || searchable.includes(value)) &&
        (batchFilter === "all" ||
          student.batchKey === batchFilter) &&
        (centreFilter === "all" ||
          student.centreKey === centreFilter) &&
        (statusFilter === "all" ||
          student.status === statusFilter)
      );
    });
  }, [
    students,
    search,
    batchFilter,
    centreFilter,
    statusFilter,
  ]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status === "active"
  ).length;

  const pendingStudents = students.filter(
    (student) => student.status === "pending"
  ).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newThisMonth = students.filter((student) => {
    if (
      !student.createdAt ||
      Number.isNaN(student.createdAt.getTime())
    ) {
      return false;
    }

    return (
      student.createdAt.getMonth() === currentMonth &&
      student.createdAt.getFullYear() === currentYear
    );
  }).length;

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setBatchFilter("all");
    setCentreFilter("all");
    setStatusFilter("all");
  };

  /* =========================================================
     VIEW STUDENT
  ========================================================= */

  const viewStudent = (student) => {
    navigate(
      `/admin/student-details?student=${encodeURIComponent(
        student.id
      )}`,
      {
        state: { student },
      }
    );
  };

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
        id="sidebarOverlay"
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

        <div className="nav-label">
          MAIN MENU
        </div>

        <nav className="nav-menu">
          <Link
            className="nav-item"
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/queries"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">◉</span>
            <span>Queries</span>
          </Link>

          <Link
            className="nav-item active"
            to="/admin/students"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">♙</span>
            <span>Students</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/batches"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">▣</span>
            <span>Batches</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/careers"
            onClick={() => setSidebarOpen(false)}
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
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">◔</span>
            <span>Reports</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/settings"
            onClick={() => setSidebarOpen(false)}
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
            <h1>Students</h1>

            <p>
              Manage enrolled students and student records
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
              title={`${adminName} profile`}
              aria-label="Admin profile"
            >
              {adminInitials}
            </button>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <section className="content">
          {/* =================================================
              DIRECTORY HEADER
          ================================================= */}

          <div className="page-intro">
            <div className="intro-left">
              <h2>Student Directory</h2>

              <p>
                View and manage students enrolled with
                MedPath Academy.
              </p>
            </div>

            <Link
              className="add-student"
              to="/admin/add-student"
            >
              + Add Student
            </Link>
          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-blue">
                  ♙
                </div>
              </div>

              <div className="stat-label">
                Total Students
              </div>

              <div className="stat-number">
                {totalStudents}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-green">
                  ✓
                </div>
              </div>

              <div className="stat-label">
                Active Students
              </div>

              <div className="stat-number">
                {activeStudents}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-purple">
                  ✦
                </div>
              </div>

              <div className="stat-label">
                New This Month
              </div>

              <div className="stat-number">
                {newThisMonth}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-orange">
                  ◌
                </div>
              </div>

              <div className="stat-label">
                Pending Admission
              </div>

              <div className="stat-number">
                {pendingStudents}
              </div>
            </div>
          </div>

          {/* =================================================
              STUDENT PANEL
          ================================================= */}

          <div className="student-panel">
            {/* ===============================================
                FILTER BAR
            =============================================== */}

            <div className="filter-bar">
              <div className="search-wrapper">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  className="search-input"
                  id="studentSearch"
                  placeholder="Search by name, email, mobile, student ID..."
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <select
                className="filter-select"
                id="batchFilter"
                value={batchFilter}
                onChange={(event) =>
                  setBatchFilter(event.target.value)
                }
              >
                <option value="all">
                  All Batches
                </option>

                {batchOptions.map((batch) => (
                  <option
                    key={batch.value}
                    value={batch.value}
                  >
                    {batch.label}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                id="centreFilter"
                value={centreFilter}
                onChange={(event) =>
                  setCentreFilter(event.target.value)
                }
              >
                <option value="all">
                  All Centres
                </option>

                {centreOptions.map((centre) => (
                  <option
                    key={centre.value}
                    value={centre.value}
                  >
                    {centre.label}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="inactive">
                  Inactive
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="dropped">
                  Dropped
                </option>
              </select>

              <button
                type="button"
                className="clear-button"
                id="clearFilters"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>

            {/* ===============================================
                TABLE HEADER
            =============================================== */}

            <div className="table-header">
              <div className="table-title">
                Student Records
              </div>

              <div
                className="student-count"
                id="studentCount"
              >
                {loading
                  ? "Loading students..."
                  : `${filteredStudents.length} matching students`}
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
                  Loading students
                </h3>

                <p>
                  Fetching student records from the
                  MedPath database.
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
                  Unable to load students
                </h3>

                <p>{error}</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              /* =============================================
                 EMPTY
              ============================================= */

              <div
                className="empty-state"
                id="emptyState"
              >
                <div className="empty-icon">
                  ♙
                </div>

                <h3>
                  No students found
                </h3>

                <p>
                  {students.length === 0
                    ? "Student records will appear here once they are added."
                    : "Try changing your search or filters."}
                </p>
              </div>
            ) : (
              /* =============================================
                 STUDENT TABLE
              ============================================= */

              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Student ID</th>
                        <th>Class</th>
                        <th>Batch</th>
                        <th>Centre</th>
                        <th>Mobile</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody id="studentTable">
                      {filteredStudents.map(
                        (student) => (
                          <tr
                            className="student-row"
                            key={student.id}
                          >
                            {/* STUDENT */}

                            <td>
                              <div className="student-cell">
                                <div className="student-avatar">
                                  {student.initials ||
                                    "ST"}
                                </div>

                                <div className="student-details">
                                  <div className="student-cell-name">
                                    {student.displayName ||
                                      student.name ||
                                      "Unnamed Student"}
                                  </div>

                                  <div className="student-cell-email">
                                    {student.email ||
                                      "No email"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* STUDENT ID */}

                            <td>
                              <span className="student-id">
                                {student.id || "—"}
                              </span>
                            </td>

                            {/* CLASS */}

                            <td>
                              <span className="class-name">
                                {student.className || "—"}
                              </span>
                            </td>

                            {/* BATCH */}

                            <td>
                              <div className="batch-cell">
                                <div className="batch-name">
                                  {student.batch || "—"}
                                </div>

                                <div className="batch-type">
                                  {student.batch
                                    ? "Assigned Batch"
                                    : "Not assigned"}
                                </div>
                              </div>
                            </td>

                            {/* CENTRE */}

                            <td>
                              <span className="centre-name">
                                {student.centre || "—"}
                              </span>
                            </td>

                            {/* MOBILE */}

                            <td>
                              <span className="mobile-number">
                                {student.mobile || "—"}
                              </span>
                            </td>

                            {/* STATUS */}

                            <td>
                              <span
                                className={`status status-${student.status}`}
                              >
                                {student.statusLabel}
                              </span>
                            </td>

                            {/* ACTION */}

                            <td>
                              <button
                                type="button"
                                className="view-button"
                                onClick={() =>
                                  viewStudent(student)
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
                    PAGINATION / INFO
                ========================================= */}

                <div className="pagination">
                  <div className="pagination-info">
                    Showing{" "}
                    {filteredStudents.length}{" "}
                    students
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminStudents;