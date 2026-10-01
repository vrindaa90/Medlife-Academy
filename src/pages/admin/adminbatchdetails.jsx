import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./adminbatchdetails.css";
import apiRequest from "../../services/apiService";

function AdminBatchDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Get the batch code from the URL
  const searchParams = new URLSearchParams(location.search);
  const batchCode = searchParams.get("batch");

  // Fetch batches and find the selected batch
  useEffect(() => {
    const fetchBatch = async () => {
      if (!batchCode) {
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
            String(batchCode).toLowerCase()
        );

        if (!selectedBatch) {
          throw new Error("The selected batch could not be found.");
        }

        setBatch(selectedBatch);
      } catch (err) {
        console.error("Error loading batch details:", err);
        setError(err.message || "Unable to load batch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [batchCode]);

  // Format dates
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Back to batches
  const handleBack = () => {
    navigate("/admin/batches");
  };

  // Delete the current batch
  const handleDelete = async () => {
    if (!batch?.batchCode || deleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        batch.batchName || batch.batchCode
      }"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await apiRequest(
        `/batches/${encodeURIComponent(batch.batchCode)}`,
        {
          method: "DELETE",
        }
      );

      alert("Batch deleted successfully.");
      navigate("/admin/batches");
    } catch (err) {
      console.error("Error deleting batch:", err);
      setError(err.message || "Unable to delete the batch.");
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="batch-details-page">
        <div className="details-message">
          <div className="message-icon">▣</div>

          <h2>Loading Batch Details</h2>

          <p>
            Fetching the selected batch information from the MedPath Academy
            database.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="batch-details-page">
        <div className="details-message">
          <div className="message-icon error-icon">!</div>

          <h2>Unable to Load Batch</h2>

          <p>{error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={handleBack}
          >
            ← Back to Batches
          </button>
        </div>
      </div>
    );
  }

  // No batch found
  if (!batch) {
    return (
      <div className="batch-details-page">
        <div className="details-message">
          <div className="message-icon">▣</div>

          <h2>Batch Not Found</h2>

          <p>
            The selected batch does not exist in the MedPath Academy
            database.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={handleBack}
          >
            ← Back to Batches
          </button>
        </div>
      </div>
    );
  }

  const currentStudents = Number(batch.currentStudents || 0);
  const capacity = Number(batch.capacity || 0);
  const availableSeats = Math.max(capacity - currentStudents, 0);

  const facultyList = Array.isArray(batch.faculty) ? batch.faculty : [];
  const scheduleList = Array.isArray(batch.schedule) ? batch.schedule : [];

  return (
    <div className="batch-details-page">
      <div className="details-container">

        {/* Top Navigation */}
        <div className="details-topbar">
          <Link to="/admin/batches" className="back-link">
            ← Back to Batches
          </Link>
        </div>

        {/* Batch Header */}
        <div className="details-header">
          <div className="header-left">
            <span className="section-eyebrow">BATCH DETAILS</span>

            <h1>{batch.batchName || "Unnamed Batch"}</h1>

            <p className="batch-code-heading">
              Batch Code:{" "}
              <strong>{batch.batchCode || "—"}</strong>
            </p>
          </div>

          <span
            className={`status-badge status-${String(
              batch.status || "unknown"
            ).toLowerCase()}`}
          >
            {batch.status || "Unknown"}
          </span>
        </div>

        {/* Basic Information */}
        <section className="details-card">
          <div className="card-header">
            <div>
              <span className="card-eyebrow">OVERVIEW</span>
              <h2>Basic Information</h2>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Batch Name</span>
              <strong>{batch.batchName || "—"}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Batch Code</span>
              <strong>{batch.batchCode || "—"}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Course</span>
              <strong>{batch.course || "—"}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Batch Type</span>
              <strong>{batch.batchType || "—"}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Centre</span>
              <strong>{batch.centre || "—"}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Classroom</span>
              <strong>{batch.classroom || "—"}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">Start Date</span>
              <strong>{formatDate(batch.startDate)}</strong>
            </div>

            <div className="detail-item">
              <span className="detail-label">End Date</span>
              <strong>{formatDate(batch.endDate)}</strong>
            </div>
          </div>
        </section>

        {/* Enrollment Information */}
        <section className="details-card">
          <div className="card-header">
            <div>
              <span className="card-eyebrow">STUDENT MANAGEMENT</span>
              <h2>Enrollment Information</h2>
            </div>
          </div>

          <div className="enrollment-grid">
            <div className="enrollment-box">
              <span className="enrollment-icon">♙</span>
              <span className="enrollment-label">Current Students</span>
              <strong>{currentStudents}</strong>
            </div>

            <div className="enrollment-box">
              <span className="enrollment-icon">▣</span>
              <span className="enrollment-label">Total Capacity</span>
              <strong>{capacity}</strong>
            </div>

            <div className="enrollment-box">
              <span className="enrollment-icon">✓</span>
              <span className="enrollment-label">Available Seats</span>
              <strong>{availableSeats}</strong>
            </div>
          </div>
        </section>

        {/* Faculty Information */}
        <section className="details-card">
          <div className="card-header">
            <div>
              <span className="card-eyebrow">ACADEMIC TEAM</span>
              <h2>Faculty Information</h2>
            </div>
          </div>

          {facultyList.length > 0 ? (
            <div className="faculty-list">
              {facultyList.map((member, index) => (
                <div className="faculty-row" key={index}>
                  <div className="faculty-avatar">F</div>

                  <div className="faculty-info">
                    <strong>
                      {member.faculty || "Faculty Member"}
                    </strong>

                    <span>
                      {member.subject || "Subject not specified"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="not-available">
              No faculty information has been added for this batch.
            </div>
          )}

          <div className="coordinator-box">
            <span className="detail-label">Batch Coordinator</span>
            <strong>{batch.coordinator || "—"}</strong>
          </div>
        </section>

        {/* Schedule */}
        <section className="details-card">
          <div className="card-header">
            <div>
              <span className="card-eyebrow">CLASS MANAGEMENT</span>
              <h2>Batch Schedule</h2>
            </div>
          </div>

          {scheduleList.length > 0 ? (
            <div className="schedule-table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Classroom</th>
                  </tr>
                </thead>

                <tbody>
                  {scheduleList.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{item.day || "—"}</strong>
                      </td>

                      <td>{item.startTime || "—"}</td>
                      <td>{item.endTime || "—"}</td>
                      <td>{item.classroom || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="not-available">
              No schedule information has been added for this batch.
            </div>
          )}
        </section>

        {/* Notes */}
        <section className="details-card">
          <div className="card-header">
            <div>
              <span className="card-eyebrow">ADDITIONAL INFORMATION</span>
              <h2>Notes</h2>
            </div>
          </div>

          <div className="notes-box">
            {batch.notes ? (
              <p>{batch.notes}</p>
            ) : (
              <p className="empty-note">
                No additional notes have been added for this batch.
              </p>
            )}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="details-actions">
          <div className="details-actions-left">
            <button
              type="button"
              className="secondary-button"
              onClick={handleBack}
              disabled={deleting}
            >
              ← Back to Batches
            </button>
          </div>

          <div className="details-actions-right">
            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  `/admin/edit-batch?batch=${encodeURIComponent(
                    batch.batchCode
                  )}`
                )
              }
              disabled={deleting}
            >
              Edit Batch
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Batch"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminBatchDetails;