import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./adminstudentdetails.css";
import apiRequest from "../../services/apiService";
import StudentPerformance from "./adminstudentperformance";

const EMPTY_FORM = {
  studentId: "",
  name: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  parentName: "",
  relationship: "",
  parentMobile: "",
  parentEmail: "",
  emergencyContact: "",
  className: "",
  course: "",
  batch: "",
  centre: "",
  admissionDate: "",
  enrollmentType: "",
  status: "active",
  source: "",
  assignedStaff: "",
  notes: "",
};

function AdminStudentDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL se aane wala ID
  const studentId = searchParams.get("student");

  const [student, setStudent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  // =========================================================
  // RESOLVED STUDENT ID
  // =========================================================
  //
  // Performance / Update / Delete ke liye:
  // 1. MongoDB _id
  // 2. Custom studentId
  // 3. URL student ID
  //
  // Jo pehle available hoga, woh use hoga.
  //
  const apiStudentId =
    student?._id ||
    student?.studentId ||
    studentId ||
    "";

  // =========================================================
  // HELPERS
  // =========================================================

  const getValue = (...values) => {
    const value = values.find(
      (item) =>
        item !== undefined &&
        item !== null &&
        String(item).trim() !== ""
    );

    return value !== undefined ? value : "—";
  };

  const formatDateForInput = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value).slice(0, 10);
    }

    return date.toISOString().slice(0, 10);
  };

  const formatDateForDisplay = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-IN");
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "inactive":
        return "Inactive";

      case "completed":
        return "Completed";

      case "dropped":
        return "Dropped";

      default:
        return "Active";
    }
  };

  const buildFormFromStudent = (data) => ({
    studentId:
      data.studentId ||
      data._id ||
      "",

    name:
      data.name ||
      data.studentName ||
      "",

    dob: formatDateForInput(
      data.dob ||
        data.dateOfBirth
    ),

    gender:
      data.gender ||
      "",

    email:
      data.email ||
      data.studentEmail ||
      "",

    phone:
      data.phone ||
      data.mobile ||
      "",

    address:
      data.address ||
      "",

    parentName:
      data.parentName ||
      "",

    relationship:
      data.relationship ||
      "",

    parentMobile:
      data.parentMobile ||
      "",

    parentEmail:
      data.parentEmail ||
      "",

    emergencyContact:
      data.emergencyContact ||
      "",

    className:
      data.className ||
      data.studentClass ||
      "",

    course:
      data.course ||
      "",

    batch:
      data.batch ||
      data.batchName ||
      "",

    centre:
      data.centre ||
      data.center ||
      data.centerName ||
      "",

    admissionDate:
      formatDateForInput(
        data.admissionDate
      ),

    enrollmentType:
      data.enrollmentType ||
      "",

    status:
      data.status ||
      "active",

    source:
      data.source ||
      "",

    assignedStaff:
      data.assignedStaff ||
      "",

    notes:
      data.notes ||
      "",
  });

  // =========================================================
  // FETCH STUDENT
  // =========================================================

  const fetchStudent = async () => {
    if (!studentId) {
      setError("Student ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSaveMessage("");

      const data = await apiRequest(
        `/students/${encodeURIComponent(
          studentId
        )}`
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch student details."
        );
      }

      const studentData =
        data.student || data;

      if (
        !studentData ||
        typeof studentData !== "object"
      ) {
        throw new Error(
          "Invalid student data received."
        );
      }

      setStudent(studentData);
      setForm(
        buildFormFromStudent(
          studentData
        )
      );
    } catch (err) {
      console.error(
        "Error fetching student:",
        err
      );

      setError(
        err?.message ||
          "Unable to load student details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  // =========================================================
  // FORM HANDLING
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSaveMessage("");
  };

  const startEditing = () => {
    if (!student) return;

    setForm(
      buildFormFromStudent(student)
    );

    setEditing(true);
    setError("");
    setSaveMessage("");
  };

  const cancelEditing = () => {
    if (!student) return;

    setForm(
      buildFormFromStudent(student)
    );

    setEditing(false);
    setError("");
    setSaveMessage("");
  };

  // =========================================================
  // SAVE STUDENT
  // =========================================================

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Student name is required."
      );
      return;
    }

    if (!form.phone.trim()) {
      setError(
        "Mobile number is required."
      );
      return;
    }

    if (!form.parentName.trim()) {
      setError(
        "Parent name is required."
      );
      return;
    }

    if (!form.relationship.trim()) {
      setError(
        "Relationship is required."
      );
      return;
    }

    if (!form.parentMobile.trim()) {
      setError(
        "Parent mobile number is required."
      );
      return;
    }

    if (!form.className.trim()) {
      setError(
        "Class is required."
      );
      return;
    }

    if (!form.course.trim()) {
      setError(
        "Course is required."
      );
      return;
    }

    if (!form.batch.trim()) {
      setError(
        "Batch is required."
      );
      return;
    }

    if (!form.centre.trim()) {
      setError(
        "Centre is required."
      );
      return;
    }

    if (!form.admissionDate) {
      setError(
        "Admission date is required."
      );
      return;
    }

    if (!form.enrollmentType.trim()) {
      setError(
        "Enrollment type is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSaveMessage("");

      const data = await apiRequest(
        `/students/${encodeURIComponent(
          apiStudentId
        )}`,
        {
          method: "PUT",

          body: JSON.stringify({
            name:
              form.name.trim(),

            dob:
              form.dob,

            gender:
              form.gender,

            email:
              form.email.trim(),

            phone:
              form.phone.trim(),

            address:
              form.address.trim(),

            parentName:
              form.parentName.trim(),

            relationship:
              form.relationship.trim(),

            parentMobile:
              form.parentMobile.trim(),

            parentEmail:
              form.parentEmail.trim(),

            emergencyContact:
              form.emergencyContact.trim(),

            className:
              form.className.trim(),

            course:
              form.course.trim(),

            batch:
              form.batch.trim(),

            centre:
              form.centre.trim(),

            admissionDate:
              form.admissionDate,

            enrollmentType:
              form.enrollmentType.trim(),

            status:
              form.status,

            source:
              form.source.trim(),

            assignedStaff:
              form.assignedStaff.trim(),

            notes:
              form.notes.trim(),
          }),
        }
      );

      if (!data.success) {
        const validationMessage =
          Array.isArray(data.errors) &&
          data.errors.length
            ? data.errors.join(" ")
            : "";

        throw new Error(
          validationMessage ||
            data.message ||
            "Failed to update student."
        );
      }

      const updatedStudent =
        data.student || data;

      setStudent(updatedStudent);

      setForm(
        buildFormFromStudent(
          updatedStudent
        )
      );

      setEditing(false);

      setSaveMessage(
        "Student details updated successfully."
      );

      window.setTimeout(() => {
        setSaveMessage("");
      }, 4000);
    } catch (err) {
      console.error(
        "Error updating student:",
        err
      );

      setError(
        err?.message ||
          "Unable to update student."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const handleDelete = async () => {
    if (!student) return;

    const studentName =
      student.name ||
      student.studentName ||
      "this student";

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${studentName}?\n\nThis action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSaveMessage("");

      const data = await apiRequest(
        `/students/${encodeURIComponent(
          apiStudentId
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to delete student."
        );
      }

      window.alert(
        "Student deleted successfully."
      );

      navigate(
        "/admin/students",
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(
        "Error deleting student:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete student."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // INPUT RENDERER
  // =========================================================

  const inputClass =
    "student-edit-input";

  const labelClass =
    "student-edit-label";

  const renderInput = (
    label,
    name,
    {
      type = "text",
      placeholder = "",
      required = false,
      options = null,
      fullWidth = false,
      disabled = false,
    } = {}
  ) => (
    <div
      className="student-edit-field"
      style={
        fullWidth
          ? {
              gridColumn:
                "1 / -1",
            }
          : undefined
      }
    >
      <label
        className={labelClass}
        htmlFor={name}
      >
        {label}
        {required ? " *" : ""}
      </label>

      {options ? (
        <select
          id={name}
          name={name}
          className={inputClass}
          value={form[name] || ""}
          onChange={handleChange}
          required={required}
          disabled={disabled}
        >
          <option value="">
            Select {label}
          </option>

          {options.map(
            (option) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {
                  option.label
                }
              </option>
            )
          )}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          className={inputClass}
          value={form[name] || ""}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          disabled={disabled}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={inputClass}
          value={form[name] || ""}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="student-details-page">
        <div className="student-details-message">
          <div className="student-details-loader" />

          <p>
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR WITHOUT STUDENT
  // =========================================================

  if (error && !student) {
    return (
      <div className="student-details-page">
        <div className="student-details-message error-message">
          <h2>
            Unable to Load Student
          </h2>

          <p>{error}</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent:
                "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="student-back-btn"
              onClick={() =>
                navigate(
                  "/admin/students"
                )
              }
            >
              ← Back to Students
            </button>

            <button
              type="button"
              className="student-back-btn"
              onClick={
                fetchStudent
              }
            >
              ↻ Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // STUDENT NOT FOUND
  // =========================================================

  if (!student) {
    return (
      <div className="student-details-page">
        <div className="student-details-message">
          <h2>
            Student Not Found
          </h2>

          <button
            type="button"
            className="student-back-btn"
            onClick={() =>
              navigate(
                "/admin/students"
              )
            }
          >
            ← Back to Students
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // DISPLAY VALUES
  // =========================================================

  const studentName = getValue(
    student.name,
    student.studentName,
    "Unnamed Student"
  );

  const studentIdDisplay =
    getValue(
      student.studentId,
      student._id
    );

  const status =
    student.status || "active";

  const initials = String(
    studentName
  )
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0)
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="student-details-page">
      <div className="student-details-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="student-details-header">
          <div>
            <button
              type="button"
              className="student-back-btn"
              onClick={() =>
                navigate(
                  "/admin/students"
                )
              }
              disabled={
                saving ||
                deleting
              }
            >
              ← Back to Students
            </button>

            <h1>
              Student Details
            </h1>

            <p>
              {editing
                ? "Update the complete information of this student."
                : "View and manage the complete information of this student."}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "10px",
              flexWrap:
                "wrap",
              justifyContent:
                "flex-end",
            }}
          >
            {!editing && (
              <>
                <button
                  type="button"
                  onClick={
                    startEditing
                  }
                  disabled={
                    deleting
                  }
                  style={{
                    border:
                      "none",
                    borderRadius:
                      "10px",
                    padding:
                      "11px 18px",
                    background:
                      "#0b82d8",
                    color:
                      "#fff",
                    fontWeight:
                      700,
                    cursor:
                      deleting
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  ✏️ Edit Student
                </button>

                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  disabled={
                    deleting
                  }
                  style={{
                    border:
                      "none",
                    borderRadius:
                      "10px",
                    padding:
                      "11px 18px",
                    background:
                      deleting
                        ? "#d99a9a"
                        : "#c93c3c",
                    color:
                      "#fff",
                    fontWeight:
                      700,
                    cursor:
                      deleting
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {deleting
                    ? "Deleting..."
                    : "🗑 Delete Student"}
                </button>
              </>
            )}

            {editing && (
              <>
                <button
                  type="button"
                  onClick={
                    cancelEditing
                  }
                  disabled={
                    saving
                  }
                  style={{
                    border:
                      "1px solid #d8dee8",
                    borderRadius:
                      "10px",
                    padding:
                      "11px 18px",
                    background:
                      "#fff",
                    color:
                      "#27364b",
                    fontWeight:
                      700,
                    cursor:
                      saving
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="student-edit-form"
                  disabled={
                    saving
                  }
                  style={{
                    border:
                      "none",
                    borderRadius:
                      "10px",
                    padding:
                      "11px 18px",
                    background:
                      saving
                        ? "#8bb9d8"
                        : "#0b82d8",
                    color:
                      "#fff",
                    fontWeight:
                      700,
                    cursor:
                      saving
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : "✓ Save Changes"}
                </button>
              </>
            )}

            <span
              className={`student-status-badge status-${status}`}
            >
              {getStatusLabel(
                status
              )}
            </span>
          </div>
        </div>

        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        {saveMessage && (
          <div
            role="status"
            style={{
              margin:
                "0 0 18px",
              padding:
                "12px 15px",
              borderRadius:
                "10px",
              background:
                "#eaf8f0",
              color:
                "#18794e",
              border:
                "1px solid #bde5cd",
              fontWeight:
                600,
            }}
          >
            ✓ {saveMessage}
          </div>
        )}

        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {error && student && (
          <div
            role="alert"
            style={{
              margin:
                "0 0 18px",
              padding:
                "12px 15px",
              borderRadius:
                "10px",
              background:
                "#fff1f1",
              color:
                "#b42318",
              border:
                "1px solid #f2c2c2",
              fontWeight:
                600,
            }}
          >
            {error}
          </div>
        )}

        {/* =====================================================
            PROFILE
        ===================================================== */}

        <div className="student-profile-card">
          <div className="student-avatar">
            {initials || "ST"}
          </div>

          <div className="student-profile-info">
            <h2>
              {studentName}
            </h2>

            <p>
              Student ID:{" "}
              {studentIdDisplay}
            </p>
          </div>
        </div>

        {/* =====================================================
            EDIT MODE
        ===================================================== */}

        {editing ? (
          <form
            id="student-edit-form"
            onSubmit={
              handleSave
            }
            noValidate
          >

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section className="student-info-section">
              <h2>
                Personal Information
              </h2>

              <div
                className="student-edit-grid"
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "18px",
                }}
              >
                {renderInput(
                  "Student ID",
                  "studentId",
                  {
                    placeholder:
                      "Student ID",
                    disabled:
                      true,
                  }
                )}

                {renderInput(
                  "Full Name",
                  "name",
                  {
                    required:
                      true,
                    placeholder:
                      "Enter student's full name",
                  }
                )}

                {renderInput(
                  "Email Address",
                  "email",
                  {
                    type:
                      "email",
                    placeholder:
                      "student@example.com",
                  }
                )}

                {renderInput(
                  "Mobile Number",
                  "phone",
                  {
                    type:
                      "tel",
                    required:
                      true,
                    placeholder:
                      "Enter mobile number",
                  }
                )}

                {renderInput(
                  "Date of Birth",
                  "dob",
                  {
                    type:
                      "date",
                  }
                )}

                {renderInput(
                  "Gender",
                  "gender",
                  {
                    options: [
                      {
                        value:
                          "Male",
                        label:
                          "Male",
                      },
                      {
                        value:
                          "Female",
                        label:
                          "Female",
                      },
                      {
                        value:
                          "Other",
                        label:
                          "Other",
                      },
                    ],
                  }
                )}

                {renderInput(
                  "Address",
                  "address",
                  {
                    placeholder:
                      "Enter complete address",
                    fullWidth:
                      true,
                  }
                )}

                {renderInput(
                  "Parent / Guardian Name",
                  "parentName",
                  {
                    required:
                      true,
                    placeholder:
                      "Enter parent/guardian name",
                  }
                )}

                {renderInput(
                  "Relationship",
                  "relationship",
                  {
                    required:
                      true,
                    placeholder:
                      "Father / Mother / Guardian",
                  }
                )}

                {renderInput(
                  "Parent Mobile",
                  "parentMobile",
                  {
                    type:
                      "tel",
                    required:
                      true,
                    placeholder:
                      "Enter parent mobile",
                  }
                )}

                {renderInput(
                  "Parent Email",
                  "parentEmail",
                  {
                    type:
                      "email",
                    placeholder:
                      "parent@example.com",
                  }
                )}

                {renderInput(
                  "Emergency Contact",
                  "emergencyContact",
                  {
                    type:
                      "tel",
                    placeholder:
                      "Emergency contact number",
                  }
                )}
              </div>
            </section>

            {/* =================================================
                ACADEMIC INFORMATION
            ================================================= */}

            <section className="student-info-section">
              <h2>
                Academic Information
              </h2>

              <div
                className="student-edit-grid"
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "18px",
                }}
              >
                {renderInput(
                  "Class",
                  "className",
                  {
                    required:
                      true,
                    placeholder:
                      "e.g. Class 12",
                  }
                )}

                {renderInput(
                  "Course",
                  "course",
                  {
                    required:
                      true,
                    placeholder:
                      "e.g. NEET",
                  }
                )}

                {renderInput(
                  "Batch",
                  "batch",
                  {
                    required:
                      true,
                    placeholder:
                      "e.g. NEET 2.0 - A",
                  }
                )}

                {renderInput(
                  "Centre",
                  "centre",
                  {
                    required:
                      true,
                    placeholder:
                      "Enter centre",
                  }
                )}

                {renderInput(
                  "Admission Date",
                  "admissionDate",
                  {
                    type:
                      "date",
                    required:
                      true,
                  }
                )}

                {renderInput(
                  "Enrollment Type",
                  "enrollmentType",
                  {
                    required:
                      true,
                    placeholder:
                      "e.g. Regular / Scholarship",
                  }
                )}

                {renderInput(
                  "Status",
                  "status",
                  {
                    options: [
                      {
                        value:
                          "active",
                        label:
                          "Active",
                      },
                      {
                        value:
                          "pending",
                        label:
                          "Pending",
                      },
                      {
                        value:
                          "inactive",
                        label:
                          "Inactive",
                      },
                      {
                        value:
                          "completed",
                        label:
                          "Completed",
                      },
                      {
                        value:
                          "dropped",
                        label:
                          "Dropped",
                      },
                    ],
                  }
                )}

                {renderInput(
                  "Source",
                  "source",
                  {
                    placeholder:
                      "e.g. Website / Walk-in / Referral",
                  }
                )}

                {renderInput(
                  "Assigned Staff",
                  "assignedStaff",
                  {
                    placeholder:
                      "Enter assigned staff",
                  }
                )}

                {renderInput(
                  "Notes",
                  "notes",
                  {
                    type:
                      "textarea",
                    placeholder:
                      "Add internal notes about the student",
                    fullWidth:
                      true,
                  }
                )}
              </div>
            </section>

            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                gap: "12px",
                marginTop:
                  "20px",
                paddingBottom:
                  "30px",
              }}
            >
              <button
                type="button"
                onClick={
                  cancelEditing
                }
                disabled={
                  saving
                }
                style={{
                  border:
                    "1px solid #d8dee8",
                  borderRadius:
                    "10px",
                  padding:
                    "12px 20px",
                  background:
                    "#fff",
                  color:
                    "#27364b",
                  fontWeight:
                    700,
                  cursor:
                    saving
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saving
                }
                style={{
                  border:
                    "none",
                  borderRadius:
                    "10px",
                  padding:
                    "12px 22px",
                  background:
                    saving
                      ? "#8bb9d8"
                      : "#0b82d8",
                  color:
                    "#fff",
                  fontWeight:
                    700,
                  cursor:
                    saving
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {saving
                  ? "Saving Changes..."
                  : "✓ Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          /* =====================================================
             VIEW MODE
             ===================================================== */

          <>
            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section className="student-info-section">
              <h2>
                Personal Information
              </h2>

              <div className="student-info-grid">

                <div className="student-info-item">
                  <span>
                    Student ID
                  </span>

                  <strong>
                    {studentIdDisplay}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Full Name
                  </span>

                  <strong>
                    {studentName}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Email Address
                  </span>

                  <strong>
                    {getValue(
                      student.email,
                      student.studentEmail
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Mobile Number
                  </span>

                  <strong>
                    {getValue(
                      student.phone,
                      student.mobile
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Date of Birth
                  </span>

                  <strong>
                    {formatDateForDisplay(
                      student.dob ||
                        student.dateOfBirth
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Gender
                  </span>

                  <strong>
                    {getValue(
                      student.gender
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Address
                  </span>

                  <strong>
                    {getValue(
                      student.address
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Parent / Guardian
                  </span>

                  <strong>
                    {getValue(
                      student.parentName
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Relationship
                  </span>

                  <strong>
                    {getValue(
                      student.relationship
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Parent Mobile
                  </span>

                  <strong>
                    {getValue(
                      student.parentMobile
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Parent Email
                  </span>

                  <strong>
                    {getValue(
                      student.parentEmail
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Emergency Contact
                  </span>

                  <strong>
                    {getValue(
                      student.emergencyContact
                    )}
                  </strong>
                </div>

              </div>
            </section>

            {/* =================================================
                ACADEMIC INFORMATION
            ================================================= */}

            <section className="student-info-section">
              <h2>
                Academic Information
              </h2>

              <div className="student-info-grid">

                <div className="student-info-item">
                  <span>
                    Class
                  </span>

                  <strong>
                    {getValue(
                      student.className,
                      student.studentClass
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Course
                  </span>

                  <strong>
                    {getValue(
                      student.course
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Batch
                  </span>

                  <strong>
                    {getValue(
                      student.batch,
                      student.batchName
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Centre
                  </span>

                  <strong>
                    {getValue(
                      student.centre,
                      student.centerName,
                      student.center
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Admission Date
                  </span>

                  <strong>
                    {formatDateForDisplay(
                      student.admissionDate
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Enrollment Type
                  </span>

                  <strong>
                    {getValue(
                      student.enrollmentType
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Status
                  </span>

                  <strong>
                    {getStatusLabel(
                      status
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Source
                  </span>

                  <strong>
                    {getValue(
                      student.source
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Assigned Staff
                  </span>

                  <strong>
                    {getValue(
                      student.assignedStaff
                    )}
                  </strong>
                </div>

                <div className="student-info-item">
                  <span>
                    Notes
                  </span>

                  <strong>
                    {getValue(
                      student.notes
                    )}
                  </strong>
                </div>

              </div>
            </section>

            {/* =================================================
                PERFORMANCE & ATTENDANCE
            ================================================= */}

            <StudentPerformance
              key={String(
                apiStudentId
              )}
              studentId={
                apiStudentId
              }
            />

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                gap: "12px",
                flexWrap:
                  "wrap",
                marginTop:
                  "20px",
                paddingBottom:
                  "30px",
              }}
            >
              <button
                type="button"
                onClick={
                  startEditing
                }
                disabled={
                  deleting
                }
                style={{
                  border:
                    "none",
                  borderRadius:
                    "10px",
                  padding:
                    "12px 20px",
                  background:
                    "#0b82d8",
                  color:
                    "#fff",
                  fontWeight:
                    700,
                  cursor:
                    deleting
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                ✏️ Edit Student
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  deleting
                }
                style={{
                  border:
                    "none",
                  borderRadius:
                    "10px",
                  padding:
                    "12px 20px",
                  background:
                    deleting
                      ? "#d99a9a"
                      : "#c93c3c",
                  color:
                    "#fff",
                  fontWeight:
                    700,
                  cursor:
                    deleting
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {deleting
                  ? "Deleting..."
                  : "🗑 Delete Student"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminStudentDetails;