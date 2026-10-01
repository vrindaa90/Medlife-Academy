import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiRequest from "../../services/apiService";
import "./admincareerdetails.css";

function AdminCareerDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const applicantId = searchParams.get("applicant");

  const [applicant, setApplicant] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     NORMALIZE APPLICANT DATA
  ===================================================== */

  const normalizeApplicant = (data) => {
    if (!data) {
      return null;
    }

    /*
      Backend may return any of these:

      {
        success: true,
        applicant: {...}
      }

      OR

      {
        success: true,
        data: {...}
      }

      OR

      {...}
    */

    const candidate =
      data?.applicant ||
      data?.data ||
      data?.career ||
      data?.application ||
      data;

    if (
      !candidate ||
      typeof candidate !== "object" ||
      Array.isArray(candidate)
    ) {
      return null;
    }

    return candidate;
  };

  /* =====================================================
     FORM DATA BUILDER
  ===================================================== */

  const buildFormData = (data) => {
    return {
      applicantName: data?.applicantName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      experience: data?.experience || "",
      company: data?.company || "",
      designation: data?.designation || "",
      address: data?.address || "",

      position: data?.position || "",
      department: data?.department || "",
      appliedOn: data?.appliedOn || "",
      source: data?.source || "",
      preferredLocation: data?.preferredLocation || "",
      resume: data?.resume || "",

      status: data?.status || "New",
      interviewStatus:
        data?.interviewStatus || "Not Scheduled",
      interviewDate: data?.interviewDate || "",
      interviewer: data?.interviewer || "",
      interviewMode: data?.interviewMode || "",
      adminNotes: data?.adminNotes || "",
    };
  };

  /* =====================================================
     FETCH APPLICANT
  ===================================================== */

  useEffect(() => {
    const fetchApplicant = async () => {
      if (!applicantId) {
        setError("Applicant ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(
          `/careers/${encodeURIComponent(applicantId)}`
        );

        console.log(
          "Career Details API Response:",
          data
        );

        const applicantData =
          normalizeApplicant(data);

        if (!applicantData) {
          throw new Error(
            "Applicant details were not found."
          );
        }

        setApplicant(applicantData);
        setFormData(
          buildFormData(applicantData)
        );
      } catch (err) {
        console.error(
          "Error fetching applicant:",
          err
        );

        setApplicant(null);
        setError(
          err?.message ||
            "Unable to load applicant details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [applicantId]);

  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SAVE CHANGES
  ===================================================== */

  const handleSave = async () => {
    if (!applicantId) {
      setError("Applicant ID is missing.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        applicantName: formData.applicantName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        experience: formData.experience || "",
        company: formData.company || "",
        designation: formData.designation || "",
        address: formData.address || "",

        position: formData.position || "",
        department: formData.department || "",
        appliedOn: formData.appliedOn || "",
        source: formData.source || "",
        preferredLocation:
          formData.preferredLocation || "",
        resume: formData.resume || "",

        status: formData.status || "New",
        interviewStatus:
          formData.interviewStatus ||
          "Not Scheduled",
        interviewDate:
          formData.interviewDate || "",
        interviewer:
          formData.interviewer || "",
        interviewMode:
          formData.interviewMode || "",
        adminNotes:
          formData.adminNotes || "",
      };

      const data = await apiRequest(
        `/careers/${encodeURIComponent(applicantId)}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      console.log(
        "Career Update Response:",
        data
      );

      const updatedApplicant =
        normalizeApplicant(data);

      if (!updatedApplicant) {
        throw new Error(
          "Applicant was updated, but the updated data could not be read."
        );
      }

      setApplicant(updatedApplicant);
      setFormData(
        buildFormData(updatedApplicant)
      );
      setIsEditing(false);

      alert(
        "Applicant details updated successfully."
      );
    } catch (err) {
      console.error(
        "Error updating applicant:",
        err
      );

      setError(
        err?.message ||
          "Unable to update applicant details."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const handleCancelEdit = () => {
    if (!applicant) {
      return;
    }

    setFormData(buildFormData(applicant));
    setIsEditing(false);
    setError("");
  };

  /* =====================================================
     DELETE APPLICANT
  ===================================================== */

  const handleDelete = async () => {
    if (!applicantId) {
      setError("Applicant ID is missing.");
      return;
    }

    const applicantName =
      applicant?.applicantName ||
      "this applicant";

    const confirmed = window.confirm(
      `Are you sure you want to delete ${applicantName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const data = await apiRequest(
        `/careers/${encodeURIComponent(applicantId)}`,
        {
          method: "DELETE",
        }
      );

      console.log(
        "Career Delete Response:",
        data
      );

      alert(
        "Applicant deleted successfully."
      );

      navigate("/admin/careers");
    } catch (err) {
      console.error(
        "Error deleting applicant:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete applicant."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {
    navigate("/admin/careers");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="career-details-page">
        <div className="career-details-loading">
          <div className="career-loading-spinner"></div>

          <p>
            Loading applicant details...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !applicant) {
    return (
      <div className="career-details-page">
        <div className="career-details-error">
          <h2>
            Unable to Load Applicant
          </h2>

          <p>{error}</p>

          <button
            className="career-back-btn"
            onClick={handleBack}
          >
            ← Back to Career Applications
          </button>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="career-details-page">
        <div className="career-details-error">
          <h2>
            Applicant Not Found
          </h2>

          <button
            className="career-back-btn"
            onClick={handleBack}
          >
            ← Back to Career Applications
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     FIELD COMPONENT
  ===================================================== */

  const renderField = (
    label,
    name,
    type = "text",
    placeholder = ""
  ) => {
    const value =
      formData?.[name] || "";

    return (
      <div className="career-detail-field">
        <label>{label}</label>

        {isEditing ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
          />
        ) : (
          <div className="career-detail-value">
            {value || "Not provided"}
          </div>
        )}
      </div>
    );
  };

  /* =====================================================
     SELECT COMPONENT
  ===================================================== */

  const renderSelect = (
    label,
    name,
    options
  ) => {
    const value =
      formData?.[name] || "";

    /*
      Keep the current database value visible
      even if an older record uses a previous label.
    */

    const finalOptions = [...options];

    if (
      value &&
      !finalOptions.includes(value)
    ) {
      finalOptions.unshift(value);
    }

    return (
      <div className="career-detail-field">
        <label>{label}</label>

        {isEditing ? (
          <select
            name={name}
            value={value}
            onChange={handleChange}
          >
            <option value="">
              Select {label}
            </option>

            {finalOptions.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </select>
        ) : (
          <div className="career-detail-value">
            {value || "Not provided"}
          </div>
        )}
      </div>
    );
  };

  /* =====================================================
     RESUME
  ===================================================== */

  const renderResume = () => {
    const resume =
      formData?.resume || "";

    return (
      <div className="career-detail-field">
        <label>Resume</label>

        {isEditing ? (
          <input
            type="text"
            name="resume"
            value={resume}
            onChange={handleChange}
            placeholder="Enter resume URL"
          />
        ) : resume ? (
          <div className="career-detail-value">
            {String(resume).startsWith(
              "http"
            ) ? (
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2563eb",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                View Resume ↗
              </a>
            ) : (
              resume
            )}
          </div>
        ) : (
          <div className="career-detail-value">
            Resume not provided
          </div>
        )}
      </div>
    );
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="career-details-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="career-details-header">
        <div>
          <button
            className="career-back-link"
            onClick={handleBack}
          >
            ← Back to Career Applications
          </button>

          <h1>
            Career Applicant Details
          </h1>

          <p>
            View and manage applicant information
          </p>
        </div>

        <div className="career-header-actions">

          {!isEditing && (
            <button
              className="career-edit-btn"
              onClick={() =>
                setIsEditing(true)
              }
              disabled={deleting}
            >
              ✏️ Edit Applicant
            </button>
          )}

          {isEditing && (
            <>
              <button
                className="career-cancel-btn"
                onClick={
                  handleCancelEdit
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="career-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </>
          )}

          {!isEditing && (
            <button
              className="career-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? "Deleting..."
                : "🗑 Delete"}
            </button>
          )}

        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="career-inline-error">
          {error}
        </div>
      )}

      {/* =================================================
          APPLICANT SUMMARY
      ================================================= */}

      <div className="career-applicant-summary">

        <div className="career-applicant-avatar">
          {(
            formData?.applicantName ||
            "A"
          )
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="career-applicant-summary-info">

          <h2>
            {formData?.applicantName ||
              "Unnamed Applicant"}
          </h2>

          <p>
            {formData?.position ||
              "Position not specified"}
          </p>

          <span className="career-status-badge">
            {formData?.status ||
              "New"}
          </span>

        </div>
      </div>

      {/* =================================================
          APPLICANT INFORMATION
      ================================================= */}

      <section className="career-details-card">

        <div className="career-card-header">
          <div>
            <h2>
              Applicant Information
            </h2>

            <p>
              Basic information about the applicant
            </p>
          </div>
        </div>

        <div className="career-details-grid">

          {renderField(
            "Applicant Name",
            "applicantName",
            "text",
            "Enter applicant name"
          )}

          {renderField(
            "Email",
            "email",
            "email",
            "Enter email address"
          )}

          {renderField(
            "Phone",
            "phone",
            "tel",
            "Enter phone number"
          )}

          {renderField(
            "Experience",
            "experience",
            "text",
            "Enter experience"
          )}

          {renderField(
            "Current Company",
            "company",
            "text",
            "Enter company"
          )}

          {renderField(
            "Current Designation",
            "designation",
            "text",
            "Enter designation"
          )}

          <div className="career-detail-field career-full-width">
            <label>Address</label>

            {isEditing ? (
              <textarea
                name="address"
                value={
                  formData?.address || ""
                }
                onChange={handleChange}
                rows="3"
                placeholder="Enter address"
              />
            ) : (
              <div className="career-detail-value">
                {formData?.address ||
                  "Not provided"}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =================================================
          APPLICATION DETAILS
      ================================================= */}

      <section className="career-details-card">

        <div className="career-card-header">
          <div>
            <h2>
              Application Details
            </h2>

            <p>
              Information about the submitted
              application
            </p>
          </div>
        </div>

        <div className="career-details-grid">

          {renderField(
            "Position Applied For",
            "position",
            "text",
            "Enter position"
          )}

          {renderField(
            "Department",
            "department",
            "text",
            "Enter department"
          )}

          {renderField(
            "Applied On",
            "appliedOn",
            "date"
          )}

          {renderField(
            "Source",
            "source",
            "text",
            "Enter application source"
          )}

          {renderField(
            "Preferred Location",
            "preferredLocation",
            "text",
            "Enter preferred location"
          )}

          {renderResume()}

        </div>
      </section>

      {/* =================================================
          RECRUITMENT TRACKING
      ================================================= */}

      <section className="career-details-card">

        <div className="career-card-header">
          <div>
            <h2>
              Recruitment Tracking
            </h2>

            <p>
              Manage the applicant's recruitment
              progress
            </p>
          </div>
        </div>

        <div className="career-details-grid">

          {renderSelect(
            "Application Status",
            "status",
            [
              "New",
              "Under Review",
              "In Review",
              "Shortlisted",
              "Interview",
              "Offer",
              "Hired",
              "Selected",
              "Joined",
              "Rejected",
              "Withdrawn",
            ]
          )}

          {renderSelect(
            "Interview Status",
            "interviewStatus",
            [
              "Not Scheduled",
              "Scheduled",
              "Completed",
              "Cancelled",
              "Rescheduled",
            ]
          )}

          {renderField(
            "Interview Date",
            "interviewDate",
            "date"
          )}

          {renderField(
            "Interviewer",
            "interviewer",
            "text",
            "Enter interviewer name"
          )}

          {renderSelect(
            "Interview Mode",
            "interviewMode",
            [
              "In Person",
              "Online",
              "Phone",
              "Offline",
            ]
          )}

          <div className="career-detail-field career-full-width">

            <label>
              Admin Notes
            </label>

            {isEditing ? (
              <textarea
                name="adminNotes"
                value={
                  formData?.adminNotes ||
                  ""
                }
                onChange={handleChange}
                rows="5"
                placeholder="Add internal notes..."
              />
            ) : (
              <div className="career-detail-value career-notes">
                {formData?.adminNotes ||
                  "No notes added"}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* =================================================
          BOTTOM ACTIONS
      ================================================= */}

      <div className="career-bottom-actions">

        <button
          className="career-back-btn"
          onClick={handleBack}
        >
          ← Back to Applications
        </button>

        {!isEditing && (
          <>
            <button
              className="career-edit-btn"
              onClick={() =>
                setIsEditing(true)
              }
              disabled={deleting}
            >
              ✏️ Edit Applicant
            </button>

            <button
              className="career-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? "Deleting..."
                : "🗑 Delete Applicant"}
            </button>
          </>
        )}

        {isEditing && (
          <>
            <button
              className="career-cancel-btn"
              onClick={
                handleCancelEdit
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="career-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </>
        )}

      </div>

    </div>
  );
}

export default AdminCareerDetails;