import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "./adminquerydetails.css";
import apiRequest from "../../services/apiService";
import { useAuth } from "../../context/authcontext";

function AdminQueryDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { admin, logout } = useAuth();

  const passedQuery = location.state?.query;
  const queryId = searchParams.get("query");

  const [query, setQuery] = useState(passedQuery || null);
  const [status, setStatus] = useState("new");
  const [assignedTo, setAssignedTo] = useState("Admin");
  const [category, setCategory] = useState("General Enquiry");
  const [priority, setPriority] = useState("Normal");
  const [followupDate, setFollowupDate] = useState("");
  const [followupTime, setFollowupTime] = useState("");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const showToast = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // Load the selected query from MongoDB
  useEffect(() => {
    const loadQuery = async () => {
      try {
        setLoading(true);
        setError("");

        let selectedQuery = passedQuery;

        // Prefer fetching the latest record by MongoDB ID
        if (queryId && queryId.length === 24) {
          const data = await apiRequest(`/queries/${queryId}`);

          if (!data.success) {
            throw new Error(
              data.message || "Could not load query."
            );
          }

          selectedQuery = data.query;
        }

        if (!selectedQuery) {
          throw new Error(
            "Query not found. Please return to the Queries page and open a query."
          );
        }

        setQuery(selectedQuery);
        setStatus(selectedQuery.status || "new");
        setAssignedTo(selectedQuery.assignedTo || "Admin");
        setCategory(
          selectedQuery.category || "General Enquiry"
        );
        setPriority(selectedQuery.priority || "Normal");
        setFollowupDate(
          selectedQuery.followupDate || ""
        );
        setFollowupTime(
          selectedQuery.followupTime || ""
        );
      } catch (err) {
        console.error("Error loading query:", err);

        setError(
          err.message || "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuery();
  }, [queryId, passedQuery]);

  // Save query management changes
  const saveChanges = async () => {
    if (!query?._id) {
      showToast("Query ID is missing.");
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest(
        `/queries/${query._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            assignedTo,
            category,
            priority,
            followupDate,
            followupTime,
          }),
        }
      );

      if (!data.success) {
        throw new Error(
          data.message || "Failed to save changes."
        );
      }

      setQuery(data.query);

      setStatus(data.query.status || "new");
      setAssignedTo(
        data.query.assignedTo || "Admin"
      );
      setCategory(
        data.query.category || "General Enquiry"
      );
      setPriority(
        data.query.priority || "Normal"
      );
      setFollowupDate(
        data.query.followupDate || ""
      );
      setFollowupTime(
        data.query.followupTime || ""
      );

      showToast("Changes saved successfully!");
    } catch (err) {
      console.error("Error saving query:", err);

      showToast(
        err.message || "Could not save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  // Schedule follow-up
  const scheduleFollowup = async () => {
    if (!followupDate || !followupTime) {
      showToast("Please select both date and time.");
      return;
    }

    if (!query?._id) {
      showToast("Query ID is missing.");
      return;
    }

    try {
      setSaving(true);

      const data = await apiRequest(
        `/queries/${query._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "followup",
            followupDate,
            followupTime,
          }),
        }
      );

      if (!data.success) {
        throw new Error(
          data.message || "Could not schedule follow-up."
        );
      }

      setQuery(data.query);
      setStatus(data.query.status || "followup");
      setFollowupDate(
        data.query.followupDate || followupDate
      );
      setFollowupTime(
        data.query.followupTime || followupTime
      );

      showToast(
        "Follow-up scheduled successfully!"
      );
    } catch (err) {
      console.error(
        "Error scheduling follow-up:",
        err
      );

      showToast(
        err.message ||
          "Could not schedule follow-up."
      );
    } finally {
      setSaving(false);
    }
  };

  // Add internal note
  const addNote = async () => {
    if (!note.trim()) {
      showToast("Please write a note first.");
      return;
    }

    if (!query?._id) {
      showToast("Query ID is missing.");
      return;
    }

    try {
      setSaving(true);

      const existingNotes = Array.isArray(query.notes)
        ? query.notes
        : [];

      const updatedNotes = [
        ...existingNotes,
        {
          text: note.trim(),
          createdAt: new Date().toISOString(),
        },
      ];

      const data = await apiRequest(
        `/queries/${query._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            notes: updatedNotes,
          }),
        }
      );

      if (!data.success) {
        throw new Error(
          data.message || "Could not save note."
        );
      }

      setQuery(data.query);
      setNote("");

      showToast("Internal note added!");
    } catch (err) {
      console.error("Error saving note:", err);

      showToast(
        err.message || "Could not save note."
      );
    } finally {
      setSaving(false);
    }
  };

  const makeCall = () => {
    if (query?.phone) {
      window.location.href = `tel:${query.phone}`;
    }
  };

  const sendEmail = () => {
    if (query?.email) {
      window.location.href = `mailto:${query.email}`;
    }
  };

  const openWhatsApp = () => {
    if (query?.phone) {
      const phone = query.phone.replace(/\D/g, "");

      if (!phone) {
        showToast("Valid phone number is not available.");
        return;
      }

      window.open(
        `https://wa.me/${phone}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (err) {
      console.error("Logout error:", err);

      navigate("/admin/login", {
        replace: true,
      });
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="main">
        <section className="content">
          <p>Loading query details...</p>
        </section>
      </main>
    );
  }

  if (error || !query) {
    return (
      <main className="main">
        <section className="content">
          <h2>Unable to load query</h2>

          <p>{error || "Query not found."}</p>

          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/admin/queries")}
          >
            Back to Queries
          </button>
        </section>
      </main>
    );
  }

  const initials = (query.name || "Student")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <aside className="sidebar">
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
            className="nav-item"
            to="/admin/dashboard"
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            className="nav-item active"
            to="/admin/queries"
          >
            <span className="nav-icon">◉</span>
            <span>Queries</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/students"
          >
            <span className="nav-icon">♙</span>
            <span>Students</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/batches"
          >
            <span className="nav-icon">▣</span>
            <span>Batches</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/careers"
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
          >
            <span className="nav-icon">◔</span>
            <span>Reports</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/settings"
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

            <div>
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
          <div className="topbar-left">
            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/admin/queries")
              }
              title="Back to queries"
              aria-label="Back to queries"
            >
              ←
            </button>

            <div className="page-heading">
              <h1>Query Details</h1>

              <p>
                Review and manage student enquiry
              </p>
            </div>
          </div>

          <div className="header-actions">
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
          <div className="query-header">
            <div className="student-main">
              <div className="large-avatar">
                {initials}
              </div>

              <div>
                <h2>{query.name}</h2>

                <p>
                  Student enquiry ·{" "}
                  {query.city ||
                    "City not provided"}
                </p>

                <div className="query-id">
                  Query ID: {query._id}
                </div>
              </div>
            </div>

            <div className="query-header-right">
              <select
                className="status-select"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                aria-label="Query status"
              >
                <option value="new">
                  ● New
                </option>

                <option value="contacted">
                  ● Contacted
                </option>

                <option value="followup">
                  ● Follow-up
                </option>

                <option value="resolved">
                  ● Resolved
                </option>
              </select>

              <button
                type="button"
                className="save-button"
                onClick={saveChanges}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="details-grid">
            <div>
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      Student Information
                    </div>

                    <div className="card-subtitle">
                      Contact information submitted
                      through the website
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-grid">
                    <div>
                      <div className="info-label">
                        Full Name
                      </div>

                      <div className="info-value">
                        {query.name ||
                          "Not provided"}
                      </div>
                    </div>

                    <div>
                      <div className="info-label">
                        Mobile Number
                      </div>

                      <div className="info-value">
                        {query.phone ? (
                          <a
                            href={`tel:${query.phone}`}
                          >
                            {query.phone}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="info-label">
                        Email Address
                      </div>

                      <div className="info-value">
                        {query.email ? (
                          <a
                            href={`mailto:${query.email}`}
                          >
                            {query.email}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="info-label">
                        City
                      </div>

                      <div className="info-value">
                        {query.city ||
                          "Not provided"}
                      </div>
                    </div>

                    <div>
                      <div className="info-label">
                        Query Source
                      </div>

                      <div className="info-value">
                        Contact Us Form
                      </div>
                    </div>

                    <div>
                      <div className="info-label">
                        Received
                      </div>

                      <div className="info-value">
                        {formatDate(
                          query.createdAt
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="query-message">
                    <div className="query-message-label">
                      Student&apos;s Query
                    </div>

                    <p>
                      {query.message ||
                        "No message provided."}
                    </p>
                  </div>

                  <div className="contact-actions">
                    <button
                      type="button"
                      className="contact-button"
                      onClick={makeCall}
                      disabled={!query.phone}
                    >
                      ☎ Call Student
                    </button>

                    <button
                      type="button"
                      className="contact-button"
                      onClick={sendEmail}
                      disabled={!query.email}
                    >
                      ✉ Send Email
                    </button>

                    <button
                      type="button"
                      className="contact-button"
                      onClick={openWhatsApp}
                      disabled={!query.phone}
                    >
                      ◇ WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="card"
                style={{ marginTop: "18px" }}
              >
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      Query Activity
                    </div>

                    <div className="card-subtitle">
                      Recorded query information
                    </div>
                  </div>
                </div>

                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot">
                      +
                    </div>

                    <div>
                      <div className="timeline-title">
                        Query received through{" "}
                        <strong>
                          Contact Us
                        </strong>
                      </div>

                      <div className="timeline-time">
                        {formatDate(
                          query.createdAt
                        )}
                      </div>
                    </div>
                  </div>

                  {query.updatedAt && (
                    <div className="timeline-item">
                      <div className="timeline-dot">
                        ✓
                      </div>

                      <div>
                        <div className="timeline-title">
                          Query record last updated
                        </div>

                        <div className="timeline-time">
                          {formatDate(
                            query.updatedAt
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      Query Management
                    </div>

                    <div className="card-subtitle">
                      Assign and organize this enquiry
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="field">
                    <label htmlFor="assignedTo">
                      Assigned To
                    </label>

                    <select
                      id="assignedTo"
                      value={assignedTo}
                      onChange={(event) =>
                        setAssignedTo(
                          event.target.value
                        )
                      }
                    >
                      <option value="Admin">
                        Admin
                      </option>

                      <option value="Counsellor 1">
                        Counsellor 1
                      </option>

                      <option value="Counsellor 2">
                        Counsellor 2
                      </option>

                      <option value="Centre Manager">
                        Centre Manager
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="queryCategory">
                      Query Category
                    </label>

                    <select
                      id="queryCategory"
                      value={category}
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                    >
                      <option value="Batch Enquiry">
                        Batch Enquiry
                      </option>

                      <option value="Admission">
                        Admission
                      </option>

                      <option value="Fees">
                        Fees
                      </option>

                      <option value="Centre Enquiry">
                        Centre Enquiry
                      </option>

                      <option value="Online Course">
                        Online Course
                      </option>

                      <option value="General Enquiry">
                        General Enquiry
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="queryPriority">
                      Priority
                    </label>

                    <select
                      id="queryPriority"
                      value={priority}
                      onChange={(event) =>
                        setPriority(
                          event.target.value
                        )
                      }
                    >
                      <option value="Low">
                        Low
                      </option>

                      <option value="Normal">
                        Normal
                      </option>

                      <option value="High">
                        High
                      </option>
                    </select>
                  </div>
                </div>

                <div className="followup-box">
                  <div className="followup-heading">
                    <div className="followup-icon">
                      ↻
                    </div>

                    Schedule Follow-up
                  </div>

                  <div className="followup-text">
                    Set the next date and time to
                    contact this student.
                  </div>

                  <div
                    className="field"
                    style={{ marginTop: "14px" }}
                  >
                    <label htmlFor="followupDate">
                      Follow-up Date
                    </label>

                    <input
                      id="followupDate"
                      type="date"
                      value={followupDate}
                      onChange={(event) =>
                        setFollowupDate(
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="followupTime">
                      Follow-up Time
                    </label>

                    <input
                      id="followupTime"
                      type="time"
                      value={followupTime}
                      onChange={(event) =>
                        setFollowupTime(
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="note-button"
                    style={{
                      background: "#2a9674",
                    }}
                    onClick={scheduleFollowup}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Schedule Follow-up"}
                  </button>
                </div>
              </div>

              <div
                className="card"
                style={{ marginTop: "18px" }}
              >
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      Internal Notes
                    </div>

                    <div className="card-subtitle">
                      Notes visible only to
                      admin/staff
                    </div>
                  </div>
                </div>

                <div className="notes-area">
                  <textarea
                    className="note-input"
                    placeholder="Write a note about this enquiry..."
                    value={note}
                    onChange={(event) =>
                      setNote(event.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="note-button"
                    onClick={addNote}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "+ Add Internal Note"}
                  </button>

                  <div className="saved-notes">
                    {(query.notes || []).map(
                      (item, index) => (
                        <div
                          className="timeline-item"
                          key={
                            item?._id ||
                            item?.createdAt ||
                            index
                          }
                        >
                          <div className="timeline-dot">
                            ✎
                          </div>

                          <div>
                            <div className="timeline-title">
                              {item.text}
                            </div>

                            <div className="timeline-time">
                              {formatDate(
                                item.createdAt
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {toast && (
        <div className="toast">
          <div className="toast-icon">✓</div>

          <span>{toast}</span>
        </div>
      )}
    </>
  );
}

export default AdminQueryDetails;