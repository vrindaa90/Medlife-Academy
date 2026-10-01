import { useEffect, useMemo, useState } from "react";
import apiRequest from "../../services/apiService";
import "./adminstudentperformance.css";

const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Botany",
  "Zoology",
];

const TEST_PATTERNS = [
  "Unit Test",
  "Chapter Test",
  "Part Test",
  "Periodic Test",
  "Half Yearly",
  "Full Syllabus",
  "Mock Test",
  "Other",
];

const SUBJECT_META = {
  Physics: {
    className: "physics",
  },
  Chemistry: {
    className: "chemistry",
  },
  Botany: {
    className: "botany",
  },
  Zoology: {
    className: "zoology",
  },
};

const EMPTY_ATTENDANCE = {
  date: "",
  status: "Present",
  remarks: "",
};

const EMPTY_TEST = {
  testPattern: "Unit Test",
  testName: "",
  subject: "",
  date: "",
  obtainedMarks: "",
  totalMarks: "",
  remarks: "",
};

function StudentPerformance({ studentId }) {
  const [performance, setPerformance] = useState({
    attendanceRecords: [],
    testRecords: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [attendanceForm, setAttendanceForm] = useState({
    ...EMPTY_ATTENDANCE,
  });

  const [testForm, setTestForm] = useState({
    ...EMPTY_TEST,
  });

  const [editingAttendanceId, setEditingAttendanceId] =
    useState(null);

  const [editingTestId, setEditingTestId] =
    useState(null);

  /* =========================================================
     TOAST
  ========================================================= */

  const showToast = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2800);
  };

  /* =========================================================
     FETCH PERFORMANCE
  ========================================================= */

  const fetchPerformance = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        `/students/${encodeURIComponent(
          studentId
        )}/performance`
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to load performance."
        );
      }

      setPerformance({
        attendanceRecords: Array.isArray(
          data.data?.attendanceRecords
        )
          ? data.data.attendanceRecords
          : [],

        testRecords: Array.isArray(
          data.data?.testRecords
        )
          ? data.data.testRecords
          : [],
      });
    } catch (err) {
      console.error(
        "Error fetching performance:",
        err
      );

      setError(
        err?.message ||
          "Unable to load performance data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  /* =========================================================
     ATTENDANCE STATS
  ========================================================= */

  const attendanceStats = useMemo(() => {
    const records =
      performance.attendanceRecords || [];

    const present = records.filter(
      (item) => item.status === "Present"
    ).length;

    const absent = records.filter(
      (item) => item.status === "Absent"
    ).length;

    const leave = records.filter(
      (item) => item.status === "Leave"
    ).length;

    const total = records.length;

    const percentage =
      total > 0
        ? (present / total) * 100
        : 0;

    return {
      total,
      present,
      absent,
      leave,
      percentage:
        Math.round(percentage * 10) / 10,
    };
  }, [performance.attendanceRecords]);

  /* =========================================================
     MARKS STATS
  ========================================================= */

  const marksStats = useMemo(() => {
    const records =
      performance.testRecords || [];

    const percentages = records
      .filter(
        (record) =>
          Number(record.totalMarks) > 0
      )
      .map(
        (record) =>
          (Number(record.obtainedMarks) /
            Number(record.totalMarks)) *
          100
      );

    if (!percentages.length) {
      return {
        totalTests: records.length,
        average: 0,
        highest: 0,
      };
    }

    const average =
      percentages.reduce(
        (sum, value) => sum + value,
        0
      ) / percentages.length;

    return {
      totalTests: records.length,
      average:
        Math.round(average * 10) / 10,
      highest:
        Math.round(
          Math.max(...percentages) * 10
        ) / 10,
    };
  }, [performance.testRecords]);

  /* =========================================================
     SUBJECT PERFORMANCE
  ========================================================= */

  const subjectPerformance = useMemo(() => {
    return SUBJECTS.map((subject) => {
      const records = (
        performance.testRecords || []
      ).filter(
        (record) =>
          String(record.subject || "").trim() ===
          subject
      );

      const percentages = records
        .filter(
          (record) =>
            Number(record.totalMarks) > 0
        )
        .map(
          (record) =>
            (Number(record.obtainedMarks) /
              Number(record.totalMarks)) *
            100
        );

      const average = percentages.length
        ? percentages.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / percentages.length
        : 0;

      return {
        subject,
        tests: records.length,
        percentage:
          Math.round(average * 10) / 10,
      };
    });
  }, [performance.testRecords]);

  const overallSubjectAverage = useMemo(() => {
    const available =
      subjectPerformance.filter(
        (item) => item.tests > 0
      );

    if (!available.length) return 0;

    const average =
      available.reduce(
        (sum, item) =>
          sum + item.percentage,
        0
      ) / available.length;

    return Math.round(average * 10) / 10;
  }, [subjectPerformance]);

  /* =========================================================
     PIE / DONUT SEGMENTS
  ========================================================= */

  const subjectDonut = useMemo(() => {
    const total = subjectPerformance.reduce(
      (sum, item) =>
        sum + item.percentage,
      0
    );

    let current = 0;

    return subjectPerformance.map(
      (item, index) => {
        const angle =
          total > 0
            ? (item.percentage / total) *
              360
            : 0;

        const startAngle = current;
        const endAngle =
          current + angle;

        current = endAngle;

        return {
          ...item,
          index,
          startAngle,
          endAngle,
        };
      }
    );
  }, [subjectPerformance]);

  const polarToCartesian = (
    cx,
    cy,
    radius,
    angle
  ) => {
    const radians =
      ((angle - 90) * Math.PI) / 180;

    return {
      x:
        cx +
        radius * Math.cos(radians),

      y:
        cy +
        radius * Math.sin(radians),
    };
  };

  const describeArc = (
    cx,
    cy,
    radius,
    startAngle,
    endAngle
  ) => {
    if (
      endAngle - startAngle >=
      359.99
    ) {
      return [
        "M",
        cx,
        cy - radius,
        "A",
        radius,
        radius,
        0,
        1,
        1,
        cx,
        cy + radius,
        "A",
        radius,
        radius,
        0,
        1,
        1,
        cx,
        cy - radius,
      ].join(" ");
    }

    const start =
      polarToCartesian(
        cx,
        cy,
        radius,
        endAngle
      );

    const end =
      polarToCartesian(
        cx,
        cy,
        radius,
        startAngle
      );

    const largeArc =
      endAngle - startAngle <=
      180
        ? 0
        : 1;

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArc,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  /* =========================================================
     ATTENDANCE FORM
  ========================================================= */

  const handleAttendanceChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setAttendanceForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const resetAttendanceForm = () => {
    setAttendanceForm({
      ...EMPTY_ATTENDANCE,
    });

    setEditingAttendanceId(null);
    setError("");
  };

  const handleAttendanceSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!attendanceForm.date) {
      setError(
        "Attendance date is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing =
        Boolean(editingAttendanceId);

      const endpoint = isEditing
        ? `/students/${encodeURIComponent(
            studentId
          )}/performance/attendance/${editingAttendanceId}`
        : `/students/${encodeURIComponent(
            studentId
          )}/performance/attendance`;

      const data = await apiRequest(
        endpoint,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          body: JSON.stringify(
            attendanceForm
          ),
        }
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to save attendance."
        );
      }

      setPerformance({
        attendanceRecords:
          data.data?.attendanceRecords || [],

        testRecords:
          data.data?.testRecords || [],
      });

      resetAttendanceForm();

      showToast(
        isEditing
          ? "Attendance updated successfully."
          : "Attendance added successfully."
      );
    } catch (err) {
      console.error(
        "Attendance save error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  const editAttendance = (
    record
  ) => {
    setAttendanceForm({
      date: String(
        record.date || ""
      ).slice(0, 10),

      status:
        record.status ||
        "Present",

      remarks:
        record.remarks ||
        "",
    });

    setEditingAttendanceId(
      record._id
    );

    setError("");
  };

  const deleteAttendance =
    async (recordId) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this attendance record?"
        )
      ) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        const data =
          await apiRequest(
            `/students/${encodeURIComponent(
              studentId
            )}/performance/attendance/${recordId}`,
            {
              method: "DELETE",
            }
          );

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Failed to delete attendance."
          );
        }

        setPerformance({
          attendanceRecords:
            data.data?.attendanceRecords || [],

          testRecords:
            data.data?.testRecords || [],
        });

        if (
          editingAttendanceId ===
          recordId
        ) {
          resetAttendanceForm();
        }

        showToast(
          "Attendance deleted successfully."
        );
      } catch (err) {
        console.error(
          "Attendance delete error:",
          err
        );

        setError(
          err?.message ||
            "Unable to delete attendance."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =========================================================
     TEST FORM
  ========================================================= */

  const handleTestChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setTestForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const resetTestForm = () => {
    setTestForm({
      ...EMPTY_TEST,
    });

    setEditingTestId(null);
    setError("");
  };

  const handleTestSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !testForm.testPattern ||
      !testForm.testName.trim() ||
      !testForm.subject ||
      !testForm.date
    ) {
      setError(
        "Please fill all required test fields."
      );
      return;
    }

    const obtained = Number(
      testForm.obtainedMarks
    );

    const total = Number(
      testForm.totalMarks
    );

    if (
      !Number.isFinite(obtained) ||
      !Number.isFinite(total) ||
      total <= 0 ||
      obtained < 0 ||
      obtained > total
    ) {
      setError(
        "Please enter valid marks. Obtained marks cannot exceed total marks."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing =
        Boolean(editingTestId);

      const endpoint = isEditing
        ? `/students/${encodeURIComponent(
            studentId
          )}/performance/tests/${editingTestId}`
        : `/students/${encodeURIComponent(
            studentId
          )}/performance/tests`;

      const payload = {
        testPattern:
          testForm.testPattern,

        testName:
          testForm.testName.trim(),

        subject:
          testForm.subject,

        date:
          testForm.date,

        obtainedMarks:
          obtained,

        totalMarks:
          total,

        remarks:
          testForm.remarks.trim(),
      };

      const data = await apiRequest(
        endpoint,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          body:
            JSON.stringify(payload),
        }
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to save marks."
        );
      }

      setPerformance({
        attendanceRecords:
          data.data?.attendanceRecords || [],

        testRecords:
          data.data?.testRecords || [],
      });

      resetTestForm();

      showToast(
        isEditing
          ? "Marks updated successfully."
          : "Marks added successfully."
      );
    } catch (err) {
      console.error(
        "Marks save error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save marks."
      );
    } finally {
      setSaving(false);
    }
  };

  const editTest = (record) => {
    setTestForm({
      testPattern:
        record.testPattern ||
        "Unit Test",

      testName:
        record.testName ||
        "",

      subject:
        SUBJECTS.includes(
          record.subject
        )
          ? record.subject
          : "",

      date: String(
        record.date || ""
      ).slice(0, 10),

      obtainedMarks:
        record.obtainedMarks ?? "",

      totalMarks:
        record.totalMarks ?? "",

      remarks:
        record.remarks || "",
    });

    setEditingTestId(
      record._id
    );

    setError("");
  };

  const deleteTest =
    async (recordId) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this marks record?"
        )
      ) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        const data =
          await apiRequest(
            `/students/${encodeURIComponent(
              studentId
            )}/performance/tests/${recordId}`,
            {
              method: "DELETE",
            }
          );

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Failed to delete marks."
          );
        }

        setPerformance({
          attendanceRecords:
            data.data?.attendanceRecords || [],

          testRecords:
            data.data?.testRecords || [],
        });

        if (
          editingTestId ===
          recordId
        ) {
          resetTestForm();
        }

        showToast(
          "Marks deleted successfully."
        );
      } catch (err) {
        console.error(
          "Marks delete error:",
          err
        );

        setError(
          err?.message ||
            "Unable to delete marks."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =========================================================
     MARKSHEET
  ========================================================= */

  const downloadMarksheet = () => {
    const records = [
      ...(performance.testRecords || []),
    ]
      .filter(
        (record) =>
          Number(record.totalMarks) > 0
      )
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );

    if (!records.length) {
      showToast(
        "Add at least one test before downloading the marksheet."
      );
      return;
    }

    const studentElement =
      document.querySelector(
        ".student-details-page"
      );

    const studentName =
      studentElement?.querySelector(
        ".student-profile-info h2"
      )?.textContent?.trim() ||
      "Student";

    const subjectRows = SUBJECTS.map(
      (subject) => {
        const values = records
          .filter(
            (record) =>
              record.subject ===
              subject
          )
          .map(
            (record) =>
              (Number(
                record.obtainedMarks
              ) /
                Number(
                  record.totalMarks
                )) *
              100
          );

        const average = values.length
          ? values.reduce(
              (sum, value) =>
                sum + value,
              0
            ) / values.length
          : 0;

        return {
          subject,
          tests: values.length,
          average:
            Math.round(
              average * 10
            ) / 10,
        };
      }
    );

    const available =
      subjectRows.filter(
        (item) => item.tests
      );

    const overall =
      available.length
        ? Math.round(
            (available.reduce(
              (sum, item) =>
                sum + item.average,
              0
            ) /
              available.length) *
              10
          ) / 10
        : 0;

    const testRows = records
      .map((record) => {
        const percentage =
          (Number(
            record.obtainedMarks
          ) /
            Number(
              record.totalMarks
            )) *
          100;

        return `
          <tr>
            <td>${record.testPattern || "Other"}</td>
            <td>${record.testName || "—"}</td>
            <td>${record.subject || "—"}</td>
            <td>${formatDate(record.date)}</td>
            <td>${record.obtainedMarks}/${record.totalMarks}</td>
            <td>${Math.round(percentage * 10) / 10}%</td>
            <td>${record.remarks || "—"}</td>
          </tr>
        `;
      })
      .join("");

    const subjectTable = subjectRows
      .map(
        (item) => `
          <tr>
            <td>${item.subject}</td>
            <td>${item.tests}</td>
            <td>${item.tests ? `${item.average}%` : "—"}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open(
      "",
      "_blank",
      "width=1000,height=800"
    );

    if (!printWindow) {
      showToast(
        "Please allow pop-ups to download the marksheet."
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MedPath Marksheet - ${studentName}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 28px;
              background: #f4f8fb;
              color: #26394d;
              font-family: Arial, sans-serif;
            }

            .sheet {
              max-width: 950px;
              margin: auto;
              background: #fff;
              border: 1px solid #dce7ef;
              border-radius: 14px;
              overflow: hidden;
            }

            .sheet-header {
              padding: 28px 32px;
              background: linear-gradient(
                135deg,
                #073b68,
                #0b82d8
              );
              color: #fff;
            }

            .academy {
              font-size: 23px;
              font-weight: 800;
            }

            .subtitle {
              margin-top: 5px;
              font-size: 10px;
              letter-spacing: 1px;
              opacity: .85;
            }

            .title {
              margin-top: 20px;
              font-size: 24px;
              font-weight: 800;
            }

            .student-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              padding: 22px 32px;
              background: #f7fafc;
              border-bottom: 1px solid #e4ebf1;
            }

            .student-box {
              padding: 12px;
              background: #fff;
              border: 1px solid #e1eaf0;
              border-radius: 8px;
            }

            .student-box span {
              display: block;
              color: #8795a4;
              font-size: 8px;
              font-weight: 700;
              text-transform: uppercase;
            }

            .student-box strong {
              display: block;
              margin-top: 4px;
              color: #26394d;
              font-size: 12px;
            }

            .section {
              padding: 24px 32px;
            }

            .section h2 {
              margin: 0 0 13px;
              color: #073b68;
              font-size: 15px;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              margin-bottom: 24px;
            }

            .summary-box {
              padding: 15px;
              border: 1px solid #e1e9ef;
              border-radius: 9px;
              background: #fbfdff;
            }

            .summary-box span {
              display: block;
              color: #8795a4;
              font-size: 8px;
              font-weight: 700;
              text-transform: uppercase;
            }

            .summary-box strong {
              display: block;
              margin-top: 5px;
              color: #203247;
              font-size: 19px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th {
              padding: 10px;
              background: #f2f6f9;
              color: #6e7e8f;
              text-align: left;
              font-size: 8px;
              text-transform: uppercase;
            }

            td {
              padding: 10px;
              color: #42566a;
              border-bottom: 1px solid #edf2f5;
              font-size: 9px;
            }

            .overall {
              margin-top: 20px;
              padding: 16px;
              text-align: center;
              border-radius: 9px;
              background: #eef8fc;
              border: 1px solid #d6eaf2;
            }

            .overall span {
              display: block;
              color: #75879a;
              font-size: 9px;
            }

            .overall strong {
              display: block;
              margin-top: 4px;
              color: #0b73b7;
              font-size: 25px;
            }

            .footer {
              padding: 16px 32px;
              border-top: 1px solid #e4ebf0;
              color: #8896a3;
              font-size: 8px;
              text-align: center;
            }

            @media print {
              body {
                padding: 0;
                background: #fff;
              }

              .sheet {
                border: none;
                border-radius: 0;
                max-width: none;
              }
            }
          </style>
        </head>

        <body>

          <div class="sheet">

            <div class="sheet-header">
              <div class="academy">
                MedPath Academy
              </div>

              <div class="subtitle">
                NEET UG · STUDENT PERFORMANCE RECORD
              </div>

              <div class="title">
                Academic Marksheet
              </div>
            </div>

            <div class="student-grid">

              <div class="student-box">
                <span>Student</span>
                <strong>${studentName}</strong>
              </div>

              <div class="student-box">
                <span>Student ID</span>
                <strong>${studentId || "—"}</strong>
              </div>

              <div class="student-box">
                <span>Total Tests</span>
                <strong>${records.length}</strong>
              </div>

              <div class="student-box">
                <span>Generated On</span>
                <strong>
                  ${new Date().toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </strong>
              </div>

            </div>

            <div class="section">

              <h2>
                Performance Summary
              </h2>

              <div class="summary">

                <div class="summary-box">
                  <span>Total Tests</span>
                  <strong>${records.length}</strong>
                </div>

                <div class="summary-box">
                  <span>Highest Score</span>
                  <strong>${marksStats.highest}%</strong>
                </div>

                <div class="summary-box">
                  <span>Overall Average</span>
                  <strong>${overall}%</strong>
                </div>

              </div>

              <h2>
                Subject-wise Performance
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Tests</th>
                    <th>Average</th>
                  </tr>
                </thead>

                <tbody>
                  ${subjectTable}
                </tbody>
              </table>

              <div class="overall">
                <span>
                  Overall Subject Performance
                </span>

                <strong>
                  ${overall}%
                </strong>
              </div>

            </div>

            <div class="section">

              <h2>
                Test & Marks Records
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Pattern</th>
                    <th>Test</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Marks</th>
                    <th>%</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  ${testRows}
                </tbody>
              </table>

            </div>

            <div class="footer">
              Generated from MedPath Academy Student Performance Tracker.
            </div>

          </div>

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 400);
            };
          <\/script>

        </body>
      </html>
    `);

    printWindow.document.close();

    showToast(
      "Marksheet opened. Choose Save as PDF."
    );
  };

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value);
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="performance-section">
        <div className="performance-loading">
          Loading performance data...
        </div>
      </section>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="performance-section">

      {/* HEADER */}

      <div className="performance-header">

        <div className="performance-heading-copy">

          <span className="performance-eyebrow">
            Academic Tracker
          </span>

          <h2>
            Performance & Attendance
          </h2>

          <p>
            Track NEET subject-wise
            performance, test scores
            and attendance from one
            place.
          </p>

        </div>

        <div className="performance-header-actions">

          <button
            type="button"
            className="marksheet-btn"
            onClick={downloadMarksheet}
            disabled={
              !performance.testRecords.length
            }
          >
            ↓ Download Marksheet
          </button>

          <div className="performance-header-badge">
            NEET UG · Admin Managed
          </div>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="performance-error">
          <span>!</span>
          <div>{error}</div>
        </div>
      )}

      {/* KPI */}

      <div className="performance-stats-grid">

        <div className="performance-stat-card total">
          <div className="performance-stat-top">
            <span>Total Days</span>
            <div className="stat-icon">◷</div>
          </div>
          <strong>
            {attendanceStats.total}
          </strong>
          <small>
            Attendance records
          </small>
        </div>

        <div className="performance-stat-card present">
          <div className="performance-stat-top">
            <span>Present</span>
            <div className="stat-icon">✓</div>
          </div>
          <strong>
            {attendanceStats.present}
          </strong>
          <small>
            Days attended
          </small>
        </div>

        <div className="performance-stat-card absent">
          <div className="performance-stat-top">
            <span>Absent</span>
            <div className="stat-icon">!</div>
          </div>
          <strong>
            {attendanceStats.absent}
          </strong>
          <small>
            Days missed
          </small>
        </div>

        <div className="performance-stat-card leave">
          <div className="performance-stat-top">
            <span>Leave</span>
            <div className="stat-icon">L</div>
          </div>
          <strong>
            {attendanceStats.leave}
          </strong>
          <small>
            Recorded leave
          </small>
        </div>

        <div className="performance-stat-card percentage">
          <div className="performance-stat-top">
            <span>Attendance</span>
            <div className="stat-icon">%</div>
          </div>
          <strong>
            {attendanceStats.percentage}%
          </strong>
          <small>
            Current attendance
          </small>
        </div>

        <div className="performance-stat-card marks">
          <div className="performance-stat-top">
            <span>Avg. Test %</span>
            <div className="stat-icon">↗</div>
          </div>
          <strong>
            {marksStats.average}%
          </strong>
          <small>
            Across all tests
          </small>
        </div>

      </div>

      {/* ANALYTICS */}

      <div className="performance-analytics-grid">

        {/* ATTENDANCE */}

        <div className="analytics-card">

          <div className="analytics-card-header">
            <div>
              <span className="analytics-kicker">
                Attendance
              </span>

              <h3>
                Attendance Overview
              </h3>

              <p>
                Current attendance distribution
              </p>
            </div>
          </div>

          <div className="attendance-overview-content">

            <div className="attendance-donut-wrap">
              <div
                className="attendance-donut"
                style={{
                  "--attendance-value":
                    `${attendanceStats.percentage}%`,
                }}
              >
                <div className="attendance-donut-center">
                  <strong>
                    {attendanceStats.percentage}%
                  </strong>
                  <span>
                    Attendance
                  </span>
                </div>
              </div>
            </div>

            <div className="attendance-overview-legend">

              <div className="legend-row">
                <div className="legend-label">
                  <span className="legend-dot present-dot" />
                  Present
                </div>
                <strong>
                  {attendanceStats.present}
                </strong>
              </div>

              <div className="legend-row">
                <div className="legend-label">
                  <span className="legend-dot absent-dot" />
                  Absent
                </div>
                <strong>
                  {attendanceStats.absent}
                </strong>
              </div>

              <div className="legend-row">
                <div className="legend-label">
                  <span className="legend-dot leave-dot" />
                  Leave
                </div>
                <strong>
                  {attendanceStats.leave}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* SUBJECT */}

        <div className="analytics-card subject-performance-card">

          <div className="analytics-card-header">

            <div>
              <span className="analytics-kicker">
                NEET Subjects
              </span>

              <h3>
                Subject Performance
              </h3>

              <p>
                Average percentage across recorded tests
              </p>
            </div>

            <div className="subject-overall-score">
              <strong>
                {overallSubjectAverage}%
              </strong>
              <span>
                Overall Avg.
              </span>
            </div>

          </div>

          <div className="subject-performance-content">

            <div className="subject-donut-box">

              {subjectDonut.some(
                (item) =>
                  item.percentage > 0
              ) ? (
                <svg
                  className="subject-donut-svg"
                  viewBox="0 0 220 220"
                  role="img"
                  aria-label="Subject performance"
                >

                  <circle
                    cx="110"
                    cy="110"
                    r="78"
                    fill="none"
                    stroke="#edf3f7"
                    strokeWidth="27"
                  />

                  {subjectDonut.map(
                    (item) => {
                      if (
                        item.percentage <= 0
                      ) {
                        return null;
                      }

                      return (
                        <path
                          key={item.subject}
                          d={describeArc(
                            110,
                            110,
                            78,
                            item.startAngle,
                            Math.max(
                              item.endAngle -
                                1.2,
                              item.startAngle
                            )
                          )}
                          fill="none"
                          stroke={`var(--subject-${item.index})`}
                          strokeWidth="27"
                        />
                      );
                    }
                  )}

                  <circle
                    cx="110"
                    cy="110"
                    r="59"
                    fill="#ffffff"
                  />

                </svg>
              ) : (
                <div className="subject-donut-empty">
                  <strong>—</strong>
                  <span>
                    No marks yet
                  </span>
                </div>
              )}

              <div className="subject-donut-center">
                <strong>
                  {overallSubjectAverage}%
                </strong>

                <span>
                  Subject Avg.
                </span>
              </div>

            </div>

            <div className="subject-legend">

              {subjectPerformance.map(
                (item, index) => (
                  <div
                    className={`subject-legend-row ${
                      item.tests === 0
                        ? "is-empty"
                        : ""
                    }`}
                    key={item.subject}
                  >

                    <div className="subject-legend-name">

                      <span
                        className="subject-legend-dot"
                        style={{
                          "--dot-color":
                            `var(--subject-${index})`,
                        }}
                      />

                      <div>
                        <strong>
                          {item.subject}
                        </strong>

                        <small>
                          {item.tests}{" "}
                          {item.tests === 1
                            ? "test"
                            : "tests"}
                        </small>
                      </div>

                    </div>

                    <strong className="subject-percent">
                      {item.percentage}%
                    </strong>

                  </div>
                )
              )}

            </div>

          </div>

          <div className="subject-chart-note">
            Slice size represents the relative
            share of recorded subject scores.
            The percentage shown beside each
            subject is its actual average.
          </div>

        </div>

      </div>

      {/* ATTENDANCE TREND */}

      <div className="analytics-card attendance-trend-card">

        <div className="analytics-card-header">
          <div>
            <span className="analytics-kicker">
              Attendance History
            </span>

            <h3>
              Attendance Trend
            </h3>

            <p>
              Last{" "}
              {Math.min(
                performance.attendanceRecords.length,
                12
              )}{" "}
              recorded entries
            </p>
          </div>

          <div className="trend-badge">
            Present = 100%
          </div>
        </div>

        {performance.attendanceRecords.length ? (
          <div className="attendance-chart">

            <div className="attendance-chart-y">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="attendance-chart-body">

              <div className="attendance-chart-grid">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="attendance-chart-bars">

                {performance
                  .attendanceRecords
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.date) -
                      new Date(b.date)
                  )
                  .slice(-12)
                  .map(
                    (
                      item,
                      index
                    ) => {

                      const value =
                        item.status ===
                        "Present"
                          ? 100
                          : item.status ===
                            "Leave"
                          ? 50
                          : 0;

                      return (
                        <div
                          className="attendance-chart-column"
                          key={`${item.date}-${index}`}
                          title={`${formatDate(
                            item.date
                          )} · ${item.status}`}
                        >
                          <div
                            className={`attendance-bar ${String(
                              item.status
                            ).toLowerCase()}`}
                            style={{
                              height:
                                `${Math.max(
                                  value,
                                  value ? 8 : 4
                                )}%`,
                            }}
                          />

                          <span>
                            {new Date(
                              item.date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                              }
                            )}
                          </span>
                        </div>
                      );
                    }
                  )}

              </div>

            </div>

          </div>
        ) : (
          <div className="performance-empty">
            No attendance records yet.
          </div>
        )}

      </div>

      {/* TEST PERFORMANCE */}

      <div className="analytics-card test-performance-card">

        <div className="analytics-card-header">

          <div>
            <span className="analytics-kicker">
              Tests
            </span>

            <h3>
              Test Performance
            </h3>

            <p>
              Latest test scores converted to percentage
            </p>
          </div>

          <div className="test-performance-summary">

            <div>
              <span>Tests</span>
              <strong>
                {marksStats.totalTests}
              </strong>
            </div>

            <div>
              <span>Highest</span>
              <strong>
                {marksStats.highest}%
              </strong>
            </div>

          </div>

        </div>

        {performance.testRecords.length ? (
          <div className="test-chart-list">

            {performance.testRecords
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.date) -
                  new Date(b.date)
              )
              .slice(-8)
              .map((record) => {

                const percentage =
                  Number(
                    record.totalMarks
                  ) > 0
                    ? (
                        Number(
                          record.obtainedMarks
                        ) /
                          Number(
                            record.totalMarks
                          )
                      ) *
                      100
                    : 0;

                const subjectClass =
                  SUBJECT_META[
                    record.subject
                  ]?.className ||
                  "other";

                return (
                  <div
                    className="test-chart-row"
                    key={`${record._id}-${record.date}`}
                  >

                    <div className="test-chart-label">
                      <strong>
                        {record.testName ||
                          "Test"}
                      </strong>

                      <small>
                        {record.subject ||
                          "Subject"}{" "}
                        ·{" "}
                        {record.testPattern ||
                          "Other"}
                      </small>
                    </div>

                    <div className="test-chart-track">
                      <div
                        className={`test-chart-bar ${subjectClass}`}
                        style={{
                          width:
                            `${Math.min(
                              Math.max(
                                percentage,
                                0
                              ),
                              100
                            )}%`,
                        }}
                      />
                    </div>

                    <strong className="test-chart-value">
                      {Math.round(
                        percentage * 10
                      ) / 10}
                      %
                    </strong>

                  </div>
                );
              })}

          </div>
        ) : (
          <div className="performance-empty">
            No test or marks records yet.
          </div>
        )}

      </div>

      {/* =====================================================
          ATTENDANCE FORM
      ===================================================== */}

      <div className="performance-card">

        <div className="performance-card-header">

          <div className="card-heading-with-icon">

            <span className="section-card-icon">
              ◷
            </span>

            <div>
              <h3>
                {editingAttendanceId
                  ? "Edit Attendance"
                  : "Add Attendance"}
              </h3>

              <p>
                Record student's daily attendance.
              </p>
            </div>

          </div>

          {editingAttendanceId && (
            <button
              type="button"
              className="secondary-btn"
              onClick={
                resetAttendanceForm
              }
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}

        </div>

        <form
          className="performance-form-grid attendance-form"
          onSubmit={
            handleAttendanceSubmit
          }
        >

          <div className="performance-field">
            <label>
              Date <span>*</span>
            </label>

            <input
              type="date"
              name="date"
              value={
                attendanceForm.date
              }
              onChange={
                handleAttendanceChange
              }
              required
            />
          </div>

          <div className="performance-field">
            <label>
              Status <span>*</span>
            </label>

            <select
              name="status"
              value={
                attendanceForm.status
              }
              onChange={
                handleAttendanceChange
              }
            >
              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Leave">
                Leave
              </option>
            </select>
          </div>

          <div className="performance-field performance-field-wide">
            <label>
              Remarks
            </label>

            <input
              type="text"
              name="remarks"
              value={
                attendanceForm.remarks
              }
              onChange={
                handleAttendanceChange
              }
              placeholder="Optional remark"
            />
          </div>

          <button
            className="primary-btn"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingAttendanceId
              ? "Update Attendance"
              : "Add Attendance"}
          </button>

        </form>

        <div className="records-section">

          <div className="records-section-header">

            <div>
              <h4>
                Attendance Records
              </h4>

              <p>
                View and manage attendance history.
              </p>
            </div>

            <div className="record-count">
              {performance.attendanceRecords.length}{" "}
              {performance.attendanceRecords.length === 1
                ? "record"
                : "records"}
            </div>

          </div>

          <div className="performance-table-wrap">

            {performance.attendanceRecords.length ===
            0 ? (
              <div className="performance-empty">
                No attendance records yet.
              </div>
            ) : (
              <table className="performance-table attendance-table">

                <colgroup>
                  <col className="attendance-col-date" />
                  <col className="attendance-col-status" />
                  <col className="attendance-col-remarks" />
                  <col className="attendance-col-action" />
                </colgroup>

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {performance
                    .attendanceRecords
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                    )
                    .map((record) => (
                      <tr key={record._id}>

                        <td>
                          <strong className="record-date">
                            {formatDate(
                              record.date
                            )}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`record-badge ${String(
                              record.status
                            ).toLowerCase()}`}
                          >
                            {record.status}
                          </span>
                        </td>

                        <td className="remarks-cell">
                          {record.remarks ||
                            "—"}
                        </td>

                        <td className="action-cell">
                          <div className="table-actions">

                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                editAttendance(
                                  record
                                )
                              }
                              disabled={saving}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="danger-text-btn delete-btn"
                              onClick={() =>
                                deleteAttendance(
                                  record._id
                                )
                              }
                              disabled={saving}
                            >
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          TEST FORM
      ===================================================== */}

      <div className="performance-card">

        <div className="performance-card-header">

          <div className="card-heading-with-icon">

            <span className="section-card-icon">
              ▤
            </span>

            <div>
              <h3>
                {editingTestId
                  ? "Edit Test / Marks"
                  : "Add Test / Marks"}
              </h3>

              <p>
                Store individual NEET subject performance.
              </p>
            </div>

          </div>

          {editingTestId && (
            <button
              type="button"
              className="secondary-btn"
              onClick={
                resetTestForm
              }
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}

        </div>

        <form
          className="performance-form-grid performance-test-form"
          onSubmit={
            handleTestSubmit
          }
        >

          <div className="performance-field">
            <label>
              Test Pattern <span>*</span>
            </label>

            <select
              name="testPattern"
              value={
                testForm.testPattern
              }
              onChange={
                handleTestChange
              }
              required
            >
              {TEST_PATTERNS.map(
                (pattern) => (
                  <option
                    key={pattern}
                    value={pattern}
                  >
                    {pattern}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="performance-field">
            <label>
              Test Name <span>*</span>
            </label>

            <input
              type="text"
              name="testName"
              value={
                testForm.testName
              }
              onChange={
                handleTestChange
              }
              placeholder="e.g. UT-1"
              required
            />
          </div>

          <div className="performance-field">
            <label>
              Subject <span>*</span>
            </label>

            <select
              name="subject"
              value={
                testForm.subject
              }
              onChange={
                handleTestChange
              }
              required
            >
              <option value="">
                Select Subject
              </option>

              {SUBJECTS.map(
                (subject) => (
                  <option
                    key={subject}
                    value={subject}
                  >
                    {subject}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="performance-field">
            <label>
              Date <span>*</span>
            </label>

            <input
              type="date"
              name="date"
              value={
                testForm.date
              }
              onChange={
                handleTestChange
              }
              required
            />
          </div>

          <div className="performance-field">
            <label>
              Obtained Marks <span>*</span>
            </label>

            <input
              type="number"
              name="obtainedMarks"
              value={
                testForm.obtainedMarks
              }
              onChange={
                handleTestChange
              }
              min="0"
              step="0.01"
              placeholder="e.g. 78"
              required
            />
          </div>

          <div className="performance-field">
            <label>
              Total Marks <span>*</span>
            </label>

            <input
              type="number"
              name="totalMarks"
              value={
                testForm.totalMarks
              }
              onChange={
                handleTestChange
              }
              min="1"
              step="0.01"
              placeholder="e.g. 100"
              required
            />
          </div>

          <div className="performance-field performance-field-wide">
            <label>
              Remarks
            </label>

            <input
              type="text"
              name="remarks"
              value={
                testForm.remarks
              }
              onChange={
                handleTestChange
              }
              placeholder="Optional remark"
            />
          </div>

          <button
            className="primary-btn"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingTestId
              ? "Update Marks"
              : "Add Marks"}
          </button>

        </form>

        {/* TEST RECORDS */}

        <div className="records-section">

          <div className="records-section-header">

            <div>
              <h4>
                Test & Marks Records
              </h4>

              <p>
                View and manage test performance history.
              </p>
            </div>

            <div className="record-count">
              {performance.testRecords.length}{" "}
              {performance.testRecords.length === 1
                ? "record"
                : "records"}
            </div>

          </div>

          <div className="performance-table-wrap">

            {performance.testRecords.length ===
            0 ? (
              <div className="performance-empty">
                No test or marks records yet.
              </div>
            ) : (
              <table className="performance-table marks-records-table">

                <colgroup>
                  <col className="marks-col-pattern" />
                  <col className="marks-col-test" />
                  <col className="marks-col-subject" />
                  <col className="marks-col-date" />
                  <col className="marks-col-score" />
                  <col className="marks-col-percentage" />
                  <col className="marks-col-remarks" />
                  <col className="marks-col-action" />
                </colgroup>

                <thead>
                  <tr>
                    <th>Pattern</th>
                    <th>Test</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Marks</th>
                    <th>%</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {performance
                    .testRecords
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                    )
                    .map((record) => {

                      const percentage =
                        Number(
                          record.totalMarks
                        ) > 0
                          ? (
                              Number(
                                record.obtainedMarks
                              ) /
                                Number(
                                  record.totalMarks
                                )
                            ) *
                            100
                          : 0;

                      const subjectClass =
                        SUBJECT_META[
                          record.subject
                        ]?.className;

                      return (
                        <tr
                          key={record._id}
                        >

                          <td>
                            <span className="pattern-badge">
                              {record.testPattern ||
                                "Other"}
                            </span>
                          </td>

                          <td>
                            <div className="test-record-name">
                              <strong>
                                {record.testName ||
                                  "—"}
                              </strong>
                            </div>
                          </td>

                          <td>
                            {subjectClass ? (
                              <span
                                className={`subject-badge ${subjectClass}`}
                              >
                                {record.subject}
                              </span>
                            ) : (
                              record.subject ||
                              "—"
                            )}
                          </td>

                          <td>
                            {formatDate(
                              record.date
                            )}
                          </td>

                          <td>
                            <strong className="marks-value">
                              {record.obtainedMarks}
                              /
                              {record.totalMarks}
                            </strong>
                          </td>

                          <td>
                            <span className="percentage-pill">
                              {Math.round(
                                percentage *
                                  10
                              ) / 10}
                              %
                            </span>
                          </td>

                          <td className="remarks-cell">
                            {record.remarks ||
                              "—"}
                          </td>

                          <td className="action-cell">

                            <div className="table-actions">

                              <button
                                type="button"
                                className="edit-btn"
                                onClick={() =>
                                  editTest(
                                    record
                                  )
                                }
                                disabled={saving}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="danger-text-btn delete-btn"
                                onClick={() =>
                                  deleteTest(
                                    record._id
                                  )
                                }
                                disabled={saving}
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>

      <div className="performance-future-note">

        <div>

          <strong>
            NEET performance tracker
          </strong>

          <p>
            Physics, Chemistry, Botany
            and Zoology are tracked
            separately so subject-wise
            averages and test progression
            can be monitored from the same
            performance records.
          </p>

        </div>

      </div>

      {toast && (
        <div
          className="performance-toast"
          role="status"
        >
          ✓ {toast}
        </div>
      )}

    </section>
  );
}

export default StudentPerformance;