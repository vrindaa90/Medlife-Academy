import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./adminaddstudent.css";
import apiRequest from "../../services/apiService";

function AdminAddStudent() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [studentStatus, setStudentStatus] = useState("active");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    dob: "",
    gender: "",
    studentEmail: "",
    mobile: "",
    address: "",
    parentName: "",
    relationship: "",
    parentMobile: "",
    parentEmail: "",
    emergencyContact: "",
    studentClass: "",
    course: "",
    batch: "",
    centre: "",
    admissionDate: "",
    enrollmentType: "",
    source: "",
    assignedStaff: "",
    notes: "",
  });

    const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData((current) => ({
      ...current,
      [id]: value,
    }));
  };

  const handlePhone = (event) => {
    const { id, value } = event.target;

    setFormData((current) => ({
      ...current,
      [id]: value.replace(/\D/g, "").slice(0, 10),
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  const goBack = () => {
    if (!saving) {
      navigate("/admin/students");
    }
  };

  const showToast = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const cleanValue = (value) => {
    if (typeof value !== "string") {
      return value;
    }

    return value.trim();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    // Basic required-field validation
    const requiredFields = [
      ["studentName", "Student name"],
      ["studentId", "Student ID"],
      ["mobile", "Mobile number"],
      ["parentName", "Parent / Guardian name"],
      ["relationship", "Relationship"],
      ["parentMobile", "Parent mobile number"],
      ["studentClass", "Class"],
      ["course", "Course"],
      ["batch", "Batch"],
      ["centre", "Centre"],
      ["admissionDate", "Admission date"],
      ["enrollmentType", "Enrollment type"],
    ];

    for (const [field, label] of requiredFields) {
      if (!String(formData[field] || "").trim()) {
        showToast(`Please enter/select ${label}.`);
        return;
      }
    }

    // Phone validation
    if (formData.mobile.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.parentMobile.length !== 10) {
      showToast("Please enter a valid 10-digit parent mobile number.");
      return;
    }

    // Emergency contact is optional, but must be valid if entered
    if (
      formData.emergencyContact &&
      formData.emergencyContact.length !== 10
    ) {
      showToast("Please enter a valid 10-digit emergency contact number.");
      return;
    }

    // Student ID validation
    const studentId = cleanValue(formData.studentId);

    if (studentId.length < 3) {
      showToast("Student ID must contain at least 3 characters.");
      return;
    }

    setSaving(true);
    setToast("");

    try {
      const payload = {
        studentName: cleanValue(formData.studentName),
        studentId,
        dob: cleanValue(formData.dob),
        gender: cleanValue(formData.gender),
        studentEmail: cleanValue(formData.studentEmail),
        mobile: cleanValue(formData.mobile),
        address: cleanValue(formData.address),
        parentName: cleanValue(formData.parentName),
        relationship: cleanValue(formData.relationship),
        parentMobile: cleanValue(formData.parentMobile),
        parentEmail: cleanValue(formData.parentEmail),
        emergencyContact: cleanValue(formData.emergencyContact),
        studentClass: cleanValue(formData.studentClass),
        course: cleanValue(formData.course),
        batch: cleanValue(formData.batch),
        centre: cleanValue(formData.centre),
        admissionDate: cleanValue(formData.admissionDate),
        enrollmentType: cleanValue(formData.enrollmentType),
        status: studentStatus,
        source: cleanValue(formData.source),
        assignedStaff: cleanValue(formData.assignedStaff),
        notes: cleanValue(formData.notes),
      };

      await apiRequest("/students", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showToast("Student added successfully!");

      window.setTimeout(() => {
        navigate("/admin/students");
      }, 1200);
    } catch (error) {
      console.error("Error adding student:", error);

      const errorMessage = error?.message || "";

      if (
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("student id") ||
        errorMessage.toLowerCase().includes("already exists")
      ) {
        showToast(
          "This Student ID already exists. Please use a unique Student ID."
        );
      } else {
        showToast(
          errorMessage || "Unable to add student. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <>
      <div
        className={`sidebar-overlay${sidebarOpen ? " show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
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
          </Link>

          <Link
            className="nav-item active"
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
            className="nav-item"
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

          <div className="online" />
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={toggleSidebar}
              type="button"
              aria-label="Open menu"
            >
              ☰
            </button>

            <button
              className="back-btn"
              onClick={goBack}
              type="button"
              aria-label="Back to students"
            >
              ←
            </button>

            <div className="page-heading">
              <h1>Add New Student</h1>
              <p>Create and manage a new student record</p>
            </div>
          </div>

          <button
            className="notification"
            type="button"
            aria-label="Notifications"
          >
            ♧
          </button>
        </header>

        <section className="content">
          <div className="intro">
            <h2>Student Registration</h2>
            <p>
              Add the student's personal, parent, academic and enrollment
              information.
            </p>
          </div>

          <form id="studentForm" onSubmit={handleSubmit}>
            <div className="form-card">
              <div className="section-header">
                <h3>Student Information</h3>
                <p>Basic identification and contact information.</p>
              </div>

              <div className="form-body">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="studentName">
                      Student Name <span className="required">*</span>
                    </label>
                    <input
                      id="studentName"
                      placeholder="Enter full name"
                      required
                      type="text"
                      value={formData.studentName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="studentId">
                      Student ID <span className="required">*</span>
                    </label>
                    <input
                      id="studentId"
                      placeholder="e.g. MP10029"
                      required
                      type="text"
                      value={formData.studentId}
                      onChange={handleChange}
                    />
                    <div className="hint">
                      Enter the unique MedPath student ID.
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="studentEmail">Student Email</label>
                    <input
                      id="studentEmail"
                      placeholder="student@gmail.com"
                      type="email"
                      value={formData.studentEmail}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="mobile">
                      Mobile Number <span className="required">*</span>
                    </label>
                    <input
                      id="mobile"
                      onChange={handlePhone}
                      maxLength="10"
                      minLength="10"
                      placeholder="10-digit mobile number"
                      required
                      type="tel"
                      value={formData.mobile}
                    />
                  </div>

                  <div className="field full">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      placeholder="Enter student's current address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="section-header">
                <h3>Parent / Guardian Information</h3>
                <p>
                  Primary contact information for communication and
                  emergencies.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="parentName">
                      Parent / Guardian Name{" "}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="parentName"
                      placeholder="Enter parent or guardian name"
                      required
                      type="text"
                      value={formData.parentName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="relationship">
                      Relationship <span className="required">*</span>
                    </label>
                    <select
                      id="relationship"
                      required
                      value={formData.relationship}
                      onChange={handleChange}
                    >
                      <option value="">Select Relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="parentMobile">
                      Parent Mobile <span className="required">*</span>
                    </label>
                    <input
                      id="parentMobile"
                      onChange={handlePhone}
                      maxLength="10"
                      minLength="10"
                      placeholder="10-digit mobile number"
                      required
                      type="tel"
                      value={formData.parentMobile}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="parentEmail">Parent Email</label>
                    <input
                      id="parentEmail"
                      placeholder="parent@gmail.com"
                      type="email"
                      value={formData.parentEmail}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="emergencyContact">
                      Emergency Contact
                    </label>
                    <input
                      id="emergencyContact"
                      onChange={handlePhone}
                      maxLength="10"
                      minLength="10"
                      placeholder="Emergency contact number"
                      type="tel"
                      value={formData.emergencyContact}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="section-header">
                <h3>Academic &amp; Enrollment</h3>
                <p>
                  Assign the student to their course, batch and centre.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="studentClass">
                      Class <span className="required">*</span>
                    </label>
                    <select
                      id="studentClass"
                      required
                      value={formData.studentClass}
                      onChange={handleChange}
                    >
                      <option value="">Select Class</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="NEET Dropper">NEET Dropper</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="course">
                      Course <span className="required">*</span>
                    </label>
                    <select
                      id="course"
                      required
                      value={formData.course}
                      onChange={handleChange}
                    >
                      <option value="">Select Course</option>
                      <option value="NEET Class 11">NEET Class 11</option>
                      <option value="NEET Class 12">NEET Class 12</option>
                      <option value="NEET 2.0">NEET 2.0</option>
                      <option value="NEET Crash Course">
                        NEET Crash Course
                      </option>
                      <option value="NEET Test Series">
                        NEET Test Series
                      </option>
                      <option value="Online NEET Preparation">
                        Online NEET Preparation
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="batch">
                      Batch <span className="required">*</span>
                    </label>
                    <select
                      id="batch"
                      required
                      value={formData.batch}
                      onChange={handleChange}
                    >
                      <option value="">Select Batch</option>
                      <option value="NEET Class 11 - Elite A">
                        NEET Class 11 - Elite A
                      </option>
                      <option value="NEET Class 11 - Regular A">
                        NEET Class 11 - Regular A
                      </option>
                      <option value="NEET Class 12 - Elite A">
                        NEET Class 12 - Elite A
                      </option>
                      <option value="NEET Class 12 - Regular A">
                        NEET Class 12 - Regular A
                      </option>
                      <option value="NEET 2.0 - A">
                        NEET 2.0 - A
                      </option>
                      <option value="Online NEET Batch">
                        Online NEET Batch
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="centre">
                      Centre <span className="required">*</span>
                    </label>
                    <select
                      id="centre"
                      required
                      value={formData.centre}
                      onChange={handleChange}
                    >
                      <option value="">Select Centre</option>
                      <option value="Rohini">Rohini</option>
                      <option value="Lajpat Nagar">Lajpat Nagar</option>
                      <option value="Dwarka">Dwarka</option>
                      <option value="Pitampura">Pitampura</option>
                      <option value="Janakpuri">Janakpuri</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="admissionDate">
                      Admission Date <span className="required">*</span>
                    </label>
                    <input
                      id="admissionDate"
                      required
                      type="date"
                      value={formData.admissionDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="enrollmentType">
                      Enrollment Type <span className="required">*</span>
                    </label>
                    <select
                      id="enrollmentType"
                      required
                      value={formData.enrollmentType}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option value="New Admission">
                        New Admission
                      </option>
                      <option value="Existing Student">
                        Existing Student
                      </option>
                      <option value="Batch Transfer">
                        Batch Transfer
                      </option>
                      <option value="Centre Transfer">
                        Centre Transfer
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="section-header">
                <h3>Admin Information</h3>
                <p>
                  Internal information used by the MedPath administration
                  team.
                </p>
              </div>

              <div className="form-body">
                <div className="form-grid">
                  <div className="field full">
                    <label>
                      Student Status <span className="required">*</span>
                    </label>

                    <div className="status-grid">
                      {[
                        ["active", "Active"],
                        ["pending", "Pending"],
                        ["inactive", "Inactive"],
                        ["completed", "Completed"],
                        ["dropped", "Dropped"],
                      ].map(([value, label]) => (
                        <div className="status-option" key={value}>
                          <input
                            checked={studentStatus === value}
                            onChange={() => setStudentStatus(value)}
                            id={value}
                            name="status"
                            type="radio"
                            value={value}
                          />
                          <label htmlFor={value}>{label}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="source">Admission Source</label>
                    <select
                      id="source"
                      value={formData.source}
                      onChange={handleChange}
                    >
                      <option value="">Select Source</option>
                      <option value="Website">Website</option>
                      <option value="Phone Enquiry">Phone Enquiry</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Referral">Referral</option>
                      <option value="Existing Student Referral">
                        Existing Student Referral
                      </option>
                      <option value="Social Media">Social Media</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Counsellor">Counsellor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="assignedStaff">
                      Assigned Counsellor / Staff
                    </label>
                    <select
                      id="assignedStaff"
                      value={formData.assignedStaff}
                      onChange={handleChange}
                    >
                      <option value="">Select Staff</option>
                      <option value="Riya Sharma">Riya Sharma</option>
                      <option value="Aman Kapoor">Aman Kapoor</option>
                      <option value="Neha Patel">Neha Patel</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div className="field full">
                    <label htmlFor="notes">Admin Notes</label>
                    <textarea
                      id="notes"
                      placeholder="Add internal notes about the student's admission, requirements, follow-ups or other relevant information..."
                      value={formData.notes}
                      onChange={handleChange}
                    />

                    <div className="hint">
                      These notes are for internal administrative use.
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
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-save"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "+ Add Student"}
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

export default AdminAddStudent;