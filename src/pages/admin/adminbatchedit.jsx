import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./adminbatchedit.css";
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

function AdminBatchEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const originalBatchCode = searchParams.get("batch");

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const availableSeats = Math.max(
    Number(formData.capacity || 0) -
      Number(formData.currentStudents || 0),
    0
  );

  // Convert MongoDB date to input[type="date"] format
  const formatDateForInput = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().split("T")[0];
  };

  // Fetch selected batch
  useEffect(() => {
    const fetchBatch = async () => {
      if (!originalBatchCode) {
        setError("Batch code is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/batches");

        const batches = Array.isArray(data)
          ? data
          : Array.isArray(data.batches)
          ? data.batches
          : Array.isArray(data.data)
          ? data.data
          : [];

        const selectedBatch = batches.find(
          (item) =>
            String(item.batchCode || "").toLowerCase() ===
            String(originalBatchCode).toLowerCase()
        );

        if (!selectedBatch) {
          throw new Error("Selected batch was not found.");
        }

        setFormData({
          batchName: selectedBatch.batchName || "",
          batchCode: selectedBatch.batchCode || "",
          course: selectedBatch.course || "",
          batchType: selectedBatch.batchType || "",
          centre: selectedBatch.centre || "",
          classroom: selectedBatch.classroom || "",
          startDate: formatDateForInput(
            selectedBatch.startDate
          ),
          endDate: formatDateForInput(
            selectedBatch.endDate
          ),
          coordinator: selectedBatch.coordinator || "",
          capacity:
            selectedBatch.capacity !== undefined
              ? selectedBatch.capacity
              : "",
          currentStudents:
            selectedBatch.currentStudents !== undefined
              ? selectedBatch.currentStudents
              : 0,
          status: selectedBatch.status || "Active",
          notes: selectedBatch.notes || "",
        });

        setFacultyRows(
          Array.isArray(selectedBatch.faculty) &&
            selectedBatch.faculty.length > 0
            ? selectedBatch.faculty.map((item) => ({
                faculty: item.faculty || "",
                subject: item.subject || "",
              }))
            : [{ ...emptyFaculty }]
        );

        setScheduleRows(
          Array.isArray(selectedBatch.schedule) &&
            selectedBatch.schedule.length > 0
            ? selectedBatch.schedule.map((item) => ({
                day: item.day || "",
                startTime: item.startTime || "",
                endTime: item.endTime || "",
                classroom: item.classroom || "",
              }))
            : [{ ...emptySchedule }]
        );
      } catch (err) {
        console.error("Error loading batch:", err);

        setError(
          err.message || "Unable to load batch details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [originalBatchCode]);

  // Update normal fields
  const updateField = (event) => {
    const { id, value } = event.target;

    setFormData((current) => ({
      ...current,
      [id]: value,
    }));
  };

  // Update status
  const updateStatus = (event) => {
    setFormData((current) => ({
      ...current,
      status: event.target.value,
    }));
  };

  // Faculty handlers
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

  // Schedule handlers
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

  // Save changes
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!originalBatchCode) {
      showNotification("Original batch code is missing.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest(
        `/batches/${encodeURIComponent(originalBatchCode)}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...formData,
            capacity: Number(formData.capacity),
            currentStudents: Number(
              formData.currentStudents
            ),
            faculty: facultyRows,
            schedule: scheduleRows,
          }),
        }
      );

      showNotification("Batch updated successfully.");

      setTimeout(() => {
        navigate(
          `/admin/batch-details?batch=${encodeURIComponent(
            formData.batchCode
          )}`
        );
      }, 800);
    } catch (err) {
      console.error("Error updating batch:", err);

      showNotification(
        err.message || "Something went wrong while updating."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="batch-edit-page">
        <div className="edit-message">
          <div className="message-icon">▣</div>

          <h2>Loading Batch</h2>

          <p>
            Fetching the batch information from the database.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="batch-edit-page">
        <div className="edit-message">
          <div className="message-icon error-icon">!</div>

          <h2>Unable to Load Batch</h2>

          <p>{error}</p>

          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate("/admin/batches")}
          >
            ← Back to Batches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="batch-edit-page">
      <div className="edit-container">

        <div className="edit-topbar">
          <Link
            to={`/admin/batch-details?batch=${encodeURIComponent(
              formData.batchCode
            )}`}
            className="back-link"
          >
            ← Back to Batch Details
          </Link>
        </div>

        <div className="edit-header">
          <div>
            <span className="section-eyebrow">
              BATCH MANAGEMENT
            </span>

            <h1>Edit Batch</h1>

            <p>
              Update the academic, faculty, schedule and
              enrollment information for this batch.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Batch Information */}
          <section className="form-card">
            <div className="section-header">
              <h2>Batch Information</h2>
              <p>
                Update the identification and academic details.
              </p>
            </div>

            <div className="form-grid">

              <div className="field">
                <label htmlFor="batchName">
                  Batch Name <span className="required">*</span>
                </label>

                <input
                  id="batchName"
                  type="text"
                  value={formData.batchName}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="batchCode">
                  Batch ID / Code <span className="required">*</span>
                </label>

                <input
                  id="batchCode"
                  type="text"
                  value={formData.batchCode}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="course">
                  Course <span className="required">*</span>
                </label>

                <select
                  id="course"
                  value={formData.course}
                  onChange={updateField}
                  required
                >
                  <option value="">Select Course</option>

                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="batchType">
                  Batch Type <span className="required">*</span>
                </label>

                <select
                  id="batchType"
                  value={formData.batchType}
                  onChange={updateField}
                  required
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
                  Centre <span className="required">*</span>
                </label>

                <select
                  id="centre"
                  value={formData.centre}
                  onChange={updateField}
                  required
                >
                  <option value="">Select Centre</option>

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
                  type="text"
                  value={formData.classroom}
                  onChange={updateField}
                  placeholder="e.g. Room 204"
                />
              </div>

              <div className="field">
                <label htmlFor="startDate">
                  Start Date <span className="required">*</span>
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={updateField}
                  required
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
          </section>

          {/* Faculty */}
          <section className="form-card">
            <div className="section-header">
              <h2>Faculty & Academic Assignment</h2>

              <p>
                Update faculty members and their subjects.
              </p>
            </div>

            <div className="repeat-list">
              {facultyRows.map((row, index) => (
                <div
                  className="repeat-row"
                  key={`faculty-${index}`}
                >
                  <div className="field">
                    <label>
                      Faculty{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      value={row.faculty}
                      onChange={(event) =>
                        updateFaculty(
                          index,
                          "faculty",
                          event.target.value
                        )
                      }
                      required
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

                  <div className="field">
                    <label>
                      Subject{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      value={row.subject}
                      onChange={(event) =>
                        updateFaculty(
                          index,
                          "subject",
                          event.target.value
                        )
                      }
                      required
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
                    onClick={() => removeFaculty(index)}
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-btn"
                onClick={addFaculty}
              >
                + Add Faculty
              </button>
            </div>
          </section>

          {/* Coordinator */}
          <section className="form-card">
            <div className="section-header">
              <h2>Batch Coordinator</h2>

              <p>
                Update the staff member coordinating this batch.
              </p>
            </div>

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

                {coordinatorOptions.map((coordinator) => (
                  <option
                    key={coordinator}
                    value={coordinator}
                  >
                    {coordinator}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Schedule */}
          <section className="form-card">
            <div className="section-header">
              <h2>Batch Schedule</h2>

              <p>
                Update the recurring weekly timetable.
              </p>
            </div>

            <div className="repeat-list">
              {scheduleRows.map((row, index) => (
                <div
                  className="repeat-row schedule-edit-row"
                  key={`schedule-${index}`}
                >
                  <div className="field">
                    <label>
                      Day <span className="required">*</span>
                    </label>

                    <select
                      value={row.day}
                      onChange={(event) =>
                        updateSchedule(
                          index,
                          "day",
                          event.target.value
                        )
                      }
                      required
                    >
                      <option value="">
                        Select Day
                      </option>

                      {dayOptions.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>
                      Start Time{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      type="time"
                      value={row.startTime}
                      onChange={(event) =>
                        updateSchedule(
                          index,
                          "startTime",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="field">
                    <label>
                      End Time{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      type="time"
                      value={row.endTime}
                      onChange={(event) =>
                        updateSchedule(
                          index,
                          "endTime",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Classroom</label>

                    <input
                      type="text"
                      value={row.classroom}
                      onChange={(event) =>
                        updateSchedule(
                          index,
                          "classroom",
                          event.target.value
                        )
                      }
                      placeholder="Room"
                    />
                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeSchedule(index)}
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-btn"
                onClick={addSchedule}
              >
                + Add Schedule
              </button>
            </div>
          </section>

          {/* Capacity */}
          <section className="form-card">
            <div className="section-header">
              <h2>Capacity & Enrollment</h2>

              <p>
                Update the student capacity and current enrollment.
              </p>
            </div>

            <div className="form-grid">

              <div className="field">
                <label htmlFor="capacity">
                  Student Capacity{" "}
                  <span className="required">*</span>
                </label>

                <input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="currentStudents">
                  Current Students
                </label>

                <input
                  id="currentStudents"
                  type="number"
                  min="0"
                  value={formData.currentStudents}
                  onChange={updateField}
                />
              </div>

            </div>

            <div className="capacity-box">
              <div>
                <span>Total Capacity</span>

                <strong>
                  {Number(formData.capacity || 0)}
                </strong>
              </div>

              <div>
                <span>Enrolled Students</span>

                <strong>
                  {Number(formData.currentStudents || 0)}
                </strong>
              </div>

              <div>
                <span>Available Seats</span>

                <strong>{availableSeats}</strong>
              </div>
            </div>
          </section>

          {/* Status & Notes */}
          <section className="form-card">
            <div className="section-header">
              <h2>Admin Controls</h2>

              <p>
                Update the operational status and notes.
              </p>
            </div>

            <div className="field">
              <label>
                Batch Status{" "}
                <span className="required">*</span>
              </label>

              <div className="status-grid">
                {[
                  "Active",
                  "Upcoming",
                  "Completed",
                  "Inactive",
                ].map((status) => (
                  <label
                    className="status-option"
                    key={status}
                  >
                    <input
                      type="radio"
                      name="batchStatus"
                      value={status}
                      checked={formData.status === status}
                      onChange={updateStatus}
                    />

                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="notes">
                Batch Notes
              </label>

              <textarea
                id="notes"
                value={formData.notes}
                onChange={updateField}
                placeholder="Add internal notes about this batch..."
                rows="5"
              />
            </div>
          </section>

          {/* Actions */}
          <section className="form-card">
            <div className="form-actions">

              <button
                type="button"
                className="btn btn-cancel"
                onClick={() =>
                  navigate(
                    `/admin/batch-details?batch=${encodeURIComponent(
                      formData.batchCode
                    )}`
                  )
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-save"
                disabled={saving}
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>
          </section>

        </form>

        {notification && (
          <div className="toast">
            {notification}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminBatchEdit;