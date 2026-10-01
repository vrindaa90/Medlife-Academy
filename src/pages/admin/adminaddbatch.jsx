import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminaddbatch.css";
import apiRequest from "../../services/apiService";

const courseOptions = [
  "NEET Class 11",
  "NEET Class 12",
  "NEET Dropper",
  "NEET 2.0",
  "NEET Crash Course",
  "NEET Test Series",
  "Online NEET Preparation",
];

const batchTypeOptions = [
  "Regular",
  "Elite",
  "Foundation",
  "Crash Course",
  "Test Series",
  "Online",
];

const centreOptions = [
  "Rohini",
  "Lajpat Nagar",
  "Dwarka",
  "Pitampura",
  "Janakpuri",
  "Online",
];

const facultyOptions = [
  "Dr. Amit Sharma",
  "Dr. Riya Kapoor",
  "Dr. Neha Verma",
  "Dr. Rahul Mehta",
  "Dr. Ananya Singh",
];

const subjectOptions = [
  "Physics",
  "Chemistry",
  "Biology",
  "Botany",
  "Zoology",
];

const coordinatorOptions = [
  "Riya Sharma",
  "Aman Kapoor",
  "Neha Patel",
  "Admin",
];

const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyFaculty = {
  faculty: "",
  subject: "",
};

const emptySchedule = {
  day: "",
  startTime: "",
  endTime: "",
  classroom: "",
};

function AdminAddBatch() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const [formData, setFormData] = useState({
    batchName: "",
    batchCode: "",
    course: "",
    batchType: "",
    centre: "",
    classroom: "",
    startDate: "",
    endDate: "",
    coordinator: "",
    capacity: "",
    currentStudents: 0,
    status: "Active",
    notes: "",
  });

  const [facultyRows, setFacultyRows] = useState([
    { ...emptyFaculty },
  ]);

  const [scheduleRows, setScheduleRows] = useState([
    { ...emptySchedule },
  ]);

  const availableSeats = Math.max(
    Number(formData.capacity || 0) -
      Number(formData.currentStudents || 0),
    0
  );

  const updateField = (event) => {
    const { id, value } = event.target;

    setFormData((current) => ({
      ...current,
      [id === "currentStudents" ? "currentStudents" : id]: value,
    }));
  };

  const updateRadioStatus = (event) => {
    setFormData((current) => ({
      ...current,
      status: event.target.value,
    }));
  };

  const updateFaculty = (index, field, value) => {
    setFacultyRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const addFaculty = () => {
    setFacultyRows((current) => [
      ...current,
      { ...emptyFaculty },
    ]);
  };

  const removeFaculty = (index) => {
    setFacultyRows((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter(
        (_, rowIndex) => rowIndex !== index
      );
    });
  };

  const updateSchedule = (index, field, value) => {
    setScheduleRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const addSchedule = () => {
    setScheduleRows((current) => [
      ...current,
      { ...emptySchedule },
    ]);
  };

  const removeSchedule = (index) => {
    setScheduleRows((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter(
        (_, rowIndex) => rowIndex !== index
      );
    });
  };

  const showNotification = (message) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  const goBack = () => {
    navigate("/admin/batches");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("CREATE BATCH FORM SUBMITTED");
    console.log("Form data:", formData);

    try {
      await apiRequest("/batches", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          capacity: Number(formData.capacity),
          currentStudents: Number(formData.currentStudents),
          faculty: facultyRows,
          schedule: scheduleRows,
        }),
      });

      showNotification("Batch created successfully.");

      setTimeout(() => {
        navigate("/admin/batches");
      }, 1000);
    } catch (error) {
      console.error("Error creating batch:", error);

      showNotification(
        error.message || "Something went wrong."
      );
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "show" : ""
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
        id="sidebar"
      >
        <div className="brand">
          <div className="brand-logo">M</div>

          <div className="brand-text">
            <h2>MedPath Academy</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <div className="nav-title">Main Menu</div>

        <nav className="nav">
          <Link
            to="/admin/dashboard"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">⌂</span>
            Dashboard
          </Link>

          <Link
            to="/admin/queries"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">▤</span>
            Queries
            <span className="badge">42</span>
          </Link>

          <Link
            to="/admin/students"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">♙</span>
            Students
          </Link>

          <Link
            to="/admin/batches"
            className="nav-item active"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">▦</span>
            Batches
          </Link>

          <Link
            to="/admin/careers"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">◉</span>
            Career Applications
          </Link>

          <Link
            to="/admin/report"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">◫</span>
            Reports
          </Link>

          <Link
            to="/admin/settings"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">⚙</span>
            Settings
          </Link>
        </nav>

        <div className="admin-profile">
          <div className="profile-avatar">A</div>

          <div className="profile-info">
            <strong>Admin</strong>
            <span>Super Administrator</span>
          </div>

          <div className="online"></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu"
              id="mobileMenu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={goBack}
              aria-label="Go back"
            >
              ←
            </button>

            <div className="page-heading">
              <h1>Create New Batch</h1>
              <p>Create and configure a new academic batch</p>
            </div>
          </div>

          <button
            type="button"
            className="notification"
            onClick={() =>
              showNotification("No new notifications")
            }
            aria-label="Notifications"
            title="Notifications"
          >
            ♧
          </button>
        </header>

        <section className="content">
          <div className="intro">
            <div>
              <h2>Batch Creation</h2>

              <p>
                Add the academic, faculty, schedule and capacity
                details for this batch.
              </p>
            </div>
          </div>

          <form id="batchForm" onSubmit={handleSubmit}>

            {/* Batch Information */}
            <div className="form-card">
              <div className="section-header">
                <h3>Batch Information</h3>
                <p>
                  Basic identification and academic details.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">

                  <div className="field">
                    <label htmlFor="batchName">
                      Batch Name{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="batchName"
                      placeholder="e.g. NEET Class 12 - Elite A"
                      required
                      type="text"
                      value={formData.batchName}
                      onChange={updateField}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="batchCode">
                      Batch ID / Code{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="batchCode"
                      placeholder="e.g. MP-BAT-001"
                      required
                      type="text"
                      value={formData.batchCode}
                      onChange={updateField}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="course">
                      Course{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      id="course"
                      required
                      value={formData.course}
                      onChange={updateField}
                    >
                      <option value="">
                        Select Course
                      </option>

                      {courseOptions.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="batchType">
                      Batch Type{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      id="batchType"
                      required
                      value={formData.batchType}
                      onChange={updateField}
                    >
                      <option value="">
                        Select Batch Type
                      </option>

                      {batchTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="centre">
                      Centre{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      id="centre"
                      required
                      value={formData.centre}
                      onChange={updateField}
                    >
                      <option value="">
                        Select Centre
                      </option>

                      {centreOptions.map((centre) => (
                        <option key={centre} value={centre}>
                          {centre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="classroom">
                      Classroom
                    </label>

                    <input
                      id="classroom"
                      placeholder="e.g. Room 204"
                      type="text"
                      value={formData.classroom}
                      onChange={updateField}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="startDate">
                      Start Date{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="startDate"
                      required
                      type="date"
                      value={formData.startDate}
                      onChange={updateField}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="endDate">
                      End Date
                    </label>

                    <input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={updateField}
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* Faculty */}
            <div className="form-card">
              <div className="section-header">
                <h3>Faculty &amp; Academic Assignment</h3>

                <p>
                  Assign faculty members and the subjects they
                  will teach.
                </p>
              </div>

              <div className="form-body">
                <div
                  className="repeat-list"
                  id="facultyList"
                >
                  {facultyRows.map((row, index) => (
                    <div
                      className="repeat-row"
                      key={`faculty-${index}`}
                    >
                      <div>
                        <label
                          htmlFor={`faculty-${index}`}
                        >
                          Faculty{" "}
                          <span className="required">
                            *
                          </span>
                        </label>

                        <select
                          id={`faculty-${index}`}
                          className="faculty"
                          required
                          value={row.faculty}
                          onChange={(event) =>
                            updateFaculty(
                              index,
                              "faculty",
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Faculty
                          </option>

                          {facultyOptions.map((faculty) => (
                            <option
                              key={faculty}
                              value={faculty}
                            >
                              {faculty}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`subject-${index}`}
                        >
                          Subject{" "}
                          <span className="required">
                            *
                          </span>
                        </label>

                        <select
                          id={`subject-${index}`}
                          className="subject"
                          required
                          value={row.subject}
                          onChange={(event) =>
                            updateFaculty(
                              index,
                              "subject",
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Subject
                          </option>

                          {subjectOptions.map((subject) => (
                            <option
                              key={subject}
                              value={subject}
                            >
                              {subject}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() =>
                          removeFaculty(index)
                        }
                        aria-label={`Remove faculty row ${
                          index + 1
                        }`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="add-btn"
                  onClick={addFaculty}
                >
                  + Add Faculty
                </button>
              </div>
            </div>

            {/* Coordinator */}
            <div className="form-card">
              <div className="section-header">
                <h3>Batch Coordinator</h3>

                <p>
                  Assign the staff member responsible for
                  coordinating this batch.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="coordinator">
                      Academic Coordinator
                    </label>

                    <select
                      id="coordinator"
                      value={formData.coordinator}
                      onChange={updateField}
                    >
                      <option value="">
                        Select Coordinator
                      </option>

                      {coordinatorOptions.map(
                        (coordinator) => (
                          <option
                            key={coordinator}
                            value={coordinator}
                          >
                            {coordinator}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="form-card">
              <div className="section-header">
                <h3>Batch Schedule</h3>

                <p>
                  Add the recurring weekly timetable for this
                  batch.
                </p>
              </div>

              <div className="form-body">
                <div
                  className="repeat-list"
                  id="scheduleList"
                >
                  {scheduleRows.map((row, index) => (
                    <div
                      className="schedule-row"
                      key={`schedule-${index}`}
                    >
                      <div>
                        <label
                          htmlFor={`schedule-day-${index}`}
                        >
                          Day{" "}
                          <span className="required">
                            *
                          </span>
                        </label>

                        <select
                          id={`schedule-day-${index}`}
                          className="schedule-day"
                          required
                          value={row.day}
                          onChange={(event) =>
                            updateSchedule(
                              index,
                              "day",
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Day
                          </option>

                          {dayOptions.map((day) => (
                            <option
                              key={day}
                              value={day}
                            >
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`start-time-${index}`}
                        >
                          Start Time{" "}
                          <span className="required">
                            *
                          </span>
                        </label>

                        <input
                          id={`start-time-${index}`}
                          className="start-time"
                          required
                          type="time"
                          value={row.startTime}
                          onChange={(event) =>
                            updateSchedule(
                              index,
                              "startTime",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`end-time-${index}`}
                        >
                          End Time{" "}
                          <span className="required">
                            *
                          </span>
                        </label>

                        <input
                          id={`end-time-${index}`}
                          className="end-time"
                          required
                          type="time"
                          value={row.endTime}
                          onChange={(event) =>
                            updateSchedule(
                              index,
                              "endTime",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`schedule-room-${index}`}
                        >
                          Classroom
                        </label>

                        <input
                          id={`schedule-room-${index}`}
                          className="schedule-room"
                          placeholder="Room"
                          type="text"
                          value={row.classroom}
                          onChange={(event) =>
                            updateSchedule(
                              index,
                              "classroom",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() =>
                          removeSchedule(index)
                        }
                        aria-label={`Remove schedule row ${
                          index + 1
                        }`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="add-btn"
                  onClick={addSchedule}
                >
                  + Add Schedule
                </button>
              </div>
            </div>

            {/* Capacity */}
            <div className="form-card">
              <div className="section-header">
                <h3>Capacity &amp; Enrollment</h3>

                <p>
                  Manage the number of students allowed in
                  this batch.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">

                  <div className="field">
                    <label htmlFor="capacity">
                      Student Capacity{" "}
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      id="capacity"
                      min="1"
                      placeholder="e.g. 60"
                      required
                      type="number"
                      value={formData.capacity}
                      onChange={updateField}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="currentStudents">
                      Current Students
                    </label>

                    <input
                      id="currentStudents"
                      min="0"
                      type="number"
                      value={formData.currentStudents}
                      onChange={updateField}
                    />

                    <div className="hint">
                      Number of students already assigned to
                      this batch.
                    </div>
                  </div>

                  <div className="field full">
                    <label>Capacity Overview</label>

                    <div className="capacity-box">
                      <div className="capacity-stat">
                        <span>Total Capacity</span>

                        <strong id="capacityDisplay">
                          {Number(
                            formData.capacity || 0
                          )}
                        </strong>
                      </div>

                      <div className="capacity-stat">
                        <span>Enrolled Students</span>

                        <strong id="studentDisplay">
                          {Number(
                            formData.currentStudents || 0
                          )}
                        </strong>
                      </div>

                      <div className="capacity-stat">
                        <span>Available Seats</span>

                        <strong id="availableDisplay">
                          {availableSeats}
                        </strong>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="form-card">
              <div className="section-header">
                <h3>Admin Controls</h3>

                <p>
                  Set the current operational status of the
                  batch.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">

                  <div className="field full">
                    <label>
                      Batch Status{" "}
                      <span className="required">
                        *
                      </span>
                    </label>

                    <div className="status-grid">
                      {[
                        "Active",
                        "Upcoming",
                        "Completed",
                        "Inactive",
                      ].map((status) => {
                        const id = status.toLowerCase();

                        return (
                          <div
                            className="status-option"
                            key={status}
                          >
                            <input
                              id={id}
                              name="status"
                              type="radio"
                              value={status}
                              checked={
                                formData.status ===
                                status
                              }
                              onChange={
                                updateRadioStatus
                              }
                            />

                            <label htmlFor={id}>
                              {status}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="field full">
                    <label htmlFor="notes">
                      Batch Notes
                    </label>

                    <textarea
                      id="notes"
                      placeholder="Add internal notes about the batch, faculty, classroom, special arrangements or other admin information..."
                      value={formData.notes}
                      onChange={updateField}
                    />

                    <div className="hint">
                      These notes are for internal
                      administrative use.
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-card">
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={goBack}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-save"
                >
                  + Create Batch
                </button>
              </div>
            </div>

          </form>
        </section>
      </main>

      {notification && (
        <div className="toast" id="toast">
          {notification}
        </div>
      )}
    </>
  );
}

export default AdminAddBatch;