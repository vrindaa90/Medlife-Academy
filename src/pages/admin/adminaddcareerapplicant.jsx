import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminaddcareerapplicant.css";
import apiRequest from "../../services/apiService";

function AdminAddCareerApplicant() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    experience: "",
    company: "",
    designation: "",
    address: "",
    position: "",
    department: "",
    appliedOn: "",
    source: "",
    preferredLocation: "",
    resume: null,
    status: "New",
    interviewStatus: "Not Scheduled",
    interviewDate: "",
    interviewer: "",
    interviewMode: "",
    adminNotes: "",
  });

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  };

  const handlePhoneChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value.replace(/\D/g, "").slice(0, 10),
    }));
  };

  const showToast = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2500);
  };

  // ========================================
  // SUBMIT CAREER APPLICANT
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
        The backend currently accepts JSON.
        Since the resume is an actual File object, we do not send
        the File object directly. The applicant information is saved
        first, while resume upload can be connected separately.
      */

      const applicantData = {
        applicantName: formData.applicantName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        experience: formData.experience,
        company: formData.company.trim(),
        designation: formData.designation.trim(),
        address: formData.address.trim(),
        position: formData.position,
        department: formData.department,
        appliedOn: formData.appliedOn,
        source: formData.source,
        preferredLocation: formData.preferredLocation,

        // Resume is not uploaded yet because the current backend
        // accepts JSON rather than multipart/form-data.
        resume: "",

        status: formData.status,
        interviewStatus: formData.interviewStatus,
        interviewDate: formData.interviewDate || null,
        interviewer: formData.interviewer,
        interviewMode: formData.interviewMode,
        adminNotes: formData.adminNotes.trim(),
      };

      const data = await apiRequest("/careers", {
        method: "POST",
        body: JSON.stringify(applicantData),
      });

      console.log("Career Applicant Saved:", data.applicant);

      showToast("Career applicant added successfully!");

      // Small delay so admin can see success toast
      setTimeout(() => {
        navigate("/admin/careers");
      }, 800);
    } catch (error) {
      console.error("Error adding career applicant:", error);

      showToast(
        error.message ||
          "Something went wrong while adding the applicant."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigate("/admin/careers");
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
            className="nav-item"
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">⌂</span>
            Dashboard
          </Link>

          <Link
            className="nav-item"
            to="/admin/queries"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">▤</span>
            Queries
            <span className="badge">42</span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/students"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">♙</span>
            Students
          </Link>

          <Link
            className="nav-item"
            to="/admin/batches"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">▦</span>
            Batches
          </Link>

          <Link
            className="nav-item active"
            to="/admin/careers"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">◉</span>
            Career Applications
          </Link>

          <Link
            className="nav-item"
            to="/admin/report"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon">◫</span>
            Reports
          </Link>

          <Link
            className="nav-item"
            to="/admin/settings"
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
              className="mobile-menu"
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <button
              className="back-btn"
              type="button"
              onClick={goBack}
              aria-label="Back to career applications"
            >
              ←
            </button>

            <div className="page-heading">
              <h1>Add Career Applicant</h1>
              <p>
                Create and manage a new applicant record
              </p>
            </div>
          </div>

          <button
            className="notification"
            type="button"
            onClick={() =>
              showToast("No new notifications")
            }
            aria-label="Notifications"
          >
            ♧
          </button>
        </header>

        <section className="content">
          <div className="intro">
            <h2>Applicant Registration</h2>

            <p>
              Record the applicant&apos;s professional
              information and recruitment progress.
            </p>
          </div>

          <form
            id="careerForm"
            onSubmit={handleSubmit}
          >
            <div className="form-card">
              <div className="section-header">
                <h3>Applicant Information</h3>
                <p>
                  Basic contact and professional
                  information.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="applicantName">
                      Applicant Name{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="applicantName"
                      name="applicantName"
                      placeholder="Enter full name"
                      required
                      type="text"
                      value={formData.applicantName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="email">
                      Gmail / Email{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      placeholder="applicant@gmail.com"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="phone">
                      Phone Number{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="experience">
                      Experience{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Experience
                      </option>
                      <option>Fresher</option>
                      <option>Less than 1 year</option>
                      <option>1 - 2 years</option>
                      <option>2 - 5 years</option>
                      <option>5 - 10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="company">
                      Current / Last Company
                    </label>

                    <input
                      id="company"
                      name="company"
                      placeholder="Enter company name"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="designation">
                      Current / Last Designation
                    </label>

                    <input
                      id="designation"
                      name="designation"
                      placeholder="Enter designation"
                      type="text"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field full">
                    <label htmlFor="address">
                      Current Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      placeholder="Enter current address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="section-header">
                <h3>Application Details</h3>

                <p>
                  Details about the role and how the
                  applicant entered the recruitment
                  pipeline.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="position">
                      Position Applied For{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      id="position"
                      name="position"
                      required
                      value={formData.position}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Position
                      </option>
                      <option>
                        NEET Physics Faculty
                      </option>
                      <option>
                        NEET Chemistry Faculty
                      </option>
                      <option>
                        NEET Biology Faculty
                      </option>
                      <option>
                        Academic Coordinator
                      </option>
                      <option>
                        Academic Counsellor
                      </option>
                      <option>
                        Centre Operations Executive
                      </option>
                      <option>
                        Digital Marketing Executive
                      </option>
                      <option>HR Executive</option>
                      <option>
                        Website &amp; IT Support Executive
                      </option>
                      <option>
                        Content &amp; Social Media Intern
                      </option>
                      <option>
                        Student Support Executive
                      </option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="department">
                      Department{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      id="department"
                      name="department"
                      required
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Department
                      </option>
                      <option>Academic</option>
                      <option>Admissions</option>
                      <option>Operations</option>
                      <option>Marketing</option>
                      <option>
                        Human Resources
                      </option>
                      <option>
                        Technology / IT
                      </option>
                      <option>
                        Student Support
                      </option>
                      <option>Management</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="appliedOn">
                      Applied On{" "}
                      <span className="required">*</span>
                    </label>

                    <input
                      id="appliedOn"
                      name="appliedOn"
                      required
                      type="date"
                      value={formData.appliedOn}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="source">
                      Application Source{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      id="source"
                      name="source"
                      required
                      value={formData.source}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Source
                      </option>
                      <option>MedPath Website</option>
                      <option>LinkedIn</option>
                      <option>Instagram</option>
                      <option>Facebook</option>
                      <option>Indeed</option>
                      <option>Naukri</option>
                      <option>
                        Employee Referral
                      </option>
                      <option>
                        External Referral
                      </option>
                      <option>Walk-in</option>
                      <option>Email</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="preferredLocation">
                      Preferred Location{" "}
                      <span className="required">*</span>
                    </label>

                    <select
                      id="preferredLocation"
                      name="preferredLocation"
                      required
                      value={formData.preferredLocation}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Location
                      </option>
                      <option>Rohini, Delhi</option>
                      <option>
                        Lajpat Nagar, Delhi
                      </option>
                      <option>Dwarka, Delhi</option>
                      <option>
                        Pitampura, Delhi
                      </option>
                      <option>
                        Janakpuri, Delhi
                      </option>
                      <option>North Delhi</option>
                      <option>South Delhi</option>
                      <option>East Delhi</option>
                      <option>West Delhi</option>
                      <option>Central Delhi</option>
                      <option>
                        Noida, Uttar Pradesh
                      </option>
                      <option>
                        Ghaziabad, Uttar Pradesh
                      </option>
                      <option>
                        Gurugram, Haryana
                      </option>
                      <option>
                        Faridabad, Haryana
                      </option>
                      <option>
                        Online / Remote
                      </option>
                      <option>
                        Open to Any Location
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="resume">
                      Resume / CV
                    </label>

                    <div className="file-upload">
                      <input
                        accept=".pdf,.doc,.docx"
                        id="resume"
                        name="resume"
                        type="file"
                        onChange={handleChange}
                      />

                      <small>
                        Accepted formats: PDF, DOC,
                        DOCX
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="section-header">
                <h3>Recruitment Tracking</h3>

                <p>
                  Track the applicant&apos;s current
                  stage and next recruitment action.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">
                  <div className="field full">
                    <label>
                      Application Status{" "}
                      <span className="required">*</span>
                    </label>

                    <div className="status-grid">
                      {[
                        "New",
                        "Under Review",
                        "Shortlisted",
                        "Interview",
                        "Offer",
                        "Hired",
                        "Rejected",
                        "Withdrawn",
                      ].map((status) => (
                        <div
                          className="status-option"
                          key={status}
                        >
                          <input
                            checked={
                              formData.status ===
                              status
                            }
                            id={`status-${status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                            name="status"
                            type="radio"
                            value={status}
                            onChange={handleChange}
                          />

                          <label
                            htmlFor={`status-${status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Interview Status
                    </label>

                    <div className="interview-grid">
                      {[
                        "Not Scheduled",
                        "Scheduled",
                        "Completed",
                      ].map((status) => (
                        <div
                          className="interview-option"
                          key={status}
                        >
                          <input
                            checked={
                              formData.interviewStatus ===
                              status
                            }
                            id={`interview-${status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                            name="interviewStatus"
                            type="radio"
                            value={status}
                            onChange={handleChange}
                          />

                          <label
                            htmlFor={`interview-${status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="interviewDate">
                      Interview Date
                    </label>

                    <input
                      id="interviewDate"
                      name="interviewDate"
                      type="date"
                      value={formData.interviewDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="interviewer">
                      Interviewer
                    </label>

                    <select
                      id="interviewer"
                      name="interviewer"
                      value={formData.interviewer}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Interviewer
                      </option>
                      <option>Riya Sharma</option>
                      <option>Aman Kapoor</option>
                      <option>Neha Patel</option>
                      <option>Admin</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="interviewMode">
                      Interview Mode
                    </label>

                    <select
                      id="interviewMode"
                      name="interviewMode"
                      value={formData.interviewMode}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Mode
                      </option>
                      <option>In Person</option>
                      <option>Online</option>
                      <option>Phone</option>
                    </select>
                  </div>

                  <div className="field full">
                    <label htmlFor="adminNotes">
                      Admin Notes
                    </label>

                    <textarea
                      id="adminNotes"
                      name="adminNotes"
                      placeholder="Add internal notes about the applicant, screening, interview or next steps..."
                      value={formData.adminNotes}
                      onChange={handleChange}
                    />

                    <div className="hint">
                      These notes are for internal
                      admin/recruitment use.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="form-actions">
                <button
                  className="btn btn-cancel"
                  onClick={goBack}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-save"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : "+ Add Applicant"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>

      {toast && (
        <div className="toast" id="toast">
          {toast}
        </div>
      )}
    </>
  );
}

export default AdminAddCareerApplicant;