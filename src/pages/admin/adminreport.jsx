import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import apiRequest from "../../services/apiService";
import "./adminreport.css";

function AdminReport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("30");
  const [students, setStudents] = useState([]);
  const [queries, setQueries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const toastTimer = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const showMessage = (message) => {
    setToast(message);
    setToastVisible(true);

    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }

    toastTimer.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
    };
  }, []);

  /* =========================================================
     GENERAL HELPERS
  ========================================================= */

  const normalizeText = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return "";
      }
    }

    return String(value).trim();
  };

  const getArrayFromResponse = (response, possibleKeys = []) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    for (const key of possibleKeys) {
      if (Array.isArray(response?.[key])) {
        return response[key];
      }

      if (Array.isArray(response?.data?.[key])) {
        return response.data[key];
      }
    }

    return [];
  };

  const getDateValue = (...values) => {
    for (const value of values) {
      if (!value) continue;

      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    return null;
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const formatDate = (value) => {
    const date = getDateValue(value);

    if (!date) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value) => {
    const date = getDateValue(value);

    if (!date) {
      return "—";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStudentName = (student) => {
    return (
      normalizeText(student?.name) ||
      normalizeText(student?.studentName) ||
      "Unnamed Student"
    );
  };

  const getQueryName = (query) => {
    return (
      normalizeText(query?.name) ||
      normalizeText(query?.studentName) ||
      normalizeText(query?.fullName) ||
      normalizeText(query?.applicantName) ||
      "Unknown"
    );
  };

  const getCareerName = (career) => {
    return (
      normalizeText(career?.applicantName) ||
      normalizeText(career?.name) ||
      normalizeText(career?.fullName) ||
      "Unknown Applicant"
    );
  };

  const getStatus = (record) => {
    return normalizeText(record?.status).toLowerCase();
  };

  const getQuerySource = (query) => {
    return (
      normalizeText(query?.source) ||
      normalizeText(query?.leadSource) ||
      normalizeText(query?.querySource) ||
      "Unknown"
    );
  };

  const getCentre = (record) => {
    return (
      normalizeText(record?.centre) ||
      normalizeText(record?.center) ||
      normalizeText(record?.branch) ||
      normalizeText(record?.location) ||
      "Unknown"
    );
  };

  const getAssignedStaff = (record) => {
    return (
      normalizeText(record?.assignedStaff) ||
      normalizeText(record?.assignedTo) ||
      normalizeText(record?.counsellor) ||
      normalizeText(record?.counselor) ||
      normalizeText(record?.handledBy) ||
      ""
    );
  };

  const getRecordDate = (record) => {
    return getDateValue(
      record?.createdAt,
      record?.created_at,
      record?.admissionDate,
      record?.appliedOn,
      record?.applicationDate,
      record?.queryDate,
      record?.date,
      record?.updatedAt
    );
  };

  const getPeriodStart = (selectedPeriod) => {
    const now = new Date();

    if (selectedPeriod === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return start;
    }

    if (selectedPeriod === "year") {
      return new Date(now.getFullYear(), 0, 1);
    }

    const days = Number(selectedPeriod);

    const start = new Date(now);

    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    return start;
  };

  const isWithinPeriod = (value) => {
    const date = getDateValue(value);

    if (!date) {
      return false;
    }

    return date >= getPeriodStart(period) && date <= new Date();
  };

  /* =========================================================
     LOAD REPORT DATA
  ========================================================= */

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        studentsResponse,
        queriesResponse,
        careersResponse,
      ] = await Promise.all([
        apiRequest("/students"),
        apiRequest("/queries"),
        apiRequest("/careers"),
      ]);

      setStudents(
        getArrayFromResponse(studentsResponse, ["students"])
      );

      setQueries(
        getArrayFromResponse(queriesResponse, ["queries"])
      );

      setCareers(
        getArrayFromResponse(careersResponse, [
          "careers",
          "applicants",
        ])
      );
    } catch (err) {
      console.error("Report data error:", err);

      setError(
        err?.message ||
          "Unable to load report data. Please check the backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  /* =========================================================
     FILTERED DATA
  ========================================================= */

  const filteredData = useMemo(
    () => ({
      students: students.filter((student) =>
        isWithinPeriod(
          student?.createdAt ||
            student?.created_at ||
            student?.admissionDate ||
            student?.admission_date
        )
      ),

      queries: queries.filter((query) =>
        isWithinPeriod(
          query?.createdAt ||
            query?.created_at ||
            query?.queryDate ||
            query?.date
        )
      ),

      careers: careers.filter((career) =>
        isWithinPeriod(
          career?.createdAt ||
            career?.created_at ||
            career?.appliedOn ||
            career?.applicationDate
        )
      ),
    }),
    [students, queries, careers, period]
  );

  /* =========================================================
     REPORT STATS
  ========================================================= */

  const reportStats = useMemo(() => {
    const activeStudents = students.filter((student) =>
      ["active", "enrolled", "ongoing"].includes(
        getStatus(student)
      )
    ).length;

    const admissions = filteredData.students.filter(
      (student) => {
        const admissionDate = getDateValue(
          student?.admissionDate,
          student?.admission_date
        );

        return (
          admissionDate &&
          isWithinPeriod(admissionDate)
        );
      }
    ).length;

    const followUps = queries.filter((query) =>
      [
        "follow-up",
        "followup",
        "follow up",
        "pending",
        "contacted",
      ].includes(getStatus(query))
    ).length;

    return {
      queries: filteredData.queries.length,
      registrations: filteredData.students.length,
      admissions,
      followUps,
      careers: filteredData.careers.length,
      activeStudents,
    };
  }, [filteredData, students, queries]);

  /* =========================================================
     QUERY SOURCES
  ========================================================= */

  const querySources = useMemo(() => {
    const sourceMap = {};

    filteredData.queries.forEach((query) => {
      const source = getQuerySource(query);

      sourceMap[source] =
        (sourceMap[source] || 0) + 1;
    });

    return Object.entries(sourceMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: filteredData.queries.length
          ? Math.round(
              (count / filteredData.queries.length) *
                100
            )
          : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData.queries]);

  /* =========================================================
     ADMISSION FUNNEL
  ========================================================= */

  const admissionFunnel = useMemo(() => {
    const total = filteredData.queries.length;

    const contacted = filteredData.queries.filter(
      (query) =>
        [
          "contacted",
          "follow-up",
          "followup",
          "follow up",
          "interested",
          "converted",
          "admitted",
          "closed",
        ].includes(getStatus(query))
    ).length;

    const interested = filteredData.queries.filter(
      (query) =>
        [
          "interested",
          "converted",
          "admitted",
          "enrolled",
        ].includes(getStatus(query))
    ).length;

    const enrolled = filteredData.students.filter(
      (student) =>
        [
          "active",
          "enrolled",
          "completed",
          "ongoing",
        ].includes(getStatus(student))
    ).length;

    const stages = [
      {
        label: "Enquiries",
        value: total,
      },
      {
        label: "Contacted",
        value: contacted,
      },
      {
        label: "Interested",
        value: interested,
      },
      {
        label: "Enrolled",
        value: enrolled,
      },
    ];

    const max = Math.max(
      ...stages.map((stage) => stage.value),
      1
    );

    return stages.map((stage) => ({
      ...stage,
      width: Math.max(
        (stage.value / max) * 100,
        4
      ),
    }));
  }, [filteredData]);

  /* =========================================================
     CENTRE PERFORMANCE
  ========================================================= */

  const centrePerformance = useMemo(() => {
    const map = {};

    filteredData.queries.forEach((query) => {
      const centre = getCentre(query);

      if (!map[centre]) {
        map[centre] = {
          centre,
          queries: 0,
          registrations: 0,
          admissions: 0,
        };
      }

      map[centre].queries += 1;
    });

    filteredData.students.forEach((student) => {
      const centre = getCentre(student);

      if (!map[centre]) {
        map[centre] = {
          centre,
          queries: 0,
          registrations: 0,
          admissions: 0,
        };
      }

      map[centre].registrations += 1;

      if (
        [
          "active",
          "enrolled",
          "completed",
          "ongoing",
        ].includes(getStatus(student))
      ) {
        map[centre].admissions += 1;
      }
    });

    return Object.values(map).sort(
      (a, b) =>
        b.queries +
        b.registrations -
        (a.queries + a.registrations)
    );
  }, [filteredData]);

  /* =========================================================
     COUNSELLOR PERFORMANCE
  ========================================================= */

  const counsellorPerformance = useMemo(() => {
    const map = {};

    filteredData.queries.forEach((query) => {
      const staff = getAssignedStaff(query);

      if (!staff) {
        return;
      }

      if (!map[staff]) {
        map[staff] = {
          name: staff,
          queries: 0,
          conversions: 0,
        };
      }

      map[staff].queries += 1;

      if (
        [
          "converted",
          "admitted",
          "enrolled",
          "closed",
        ].includes(getStatus(query))
      ) {
        map[staff].conversions += 1;
      }
    });

    return Object.values(map).sort(
      (a, b) => b.queries - a.queries
    );
  }, [filteredData.queries]);

  /* =========================================================
     RECENT ACTIVITY
  ========================================================= */

  const recentActivity = useMemo(() => {
    const activities = [];

    filteredData.queries.forEach((query) => {
      const date = getRecordDate(query);

      if (date) {
        activities.push({
          type: "Query",
          title: `New enquiry from ${getQueryName(query)}`,
          date,
        });
      }
    });

    filteredData.students.forEach((student) => {
      const date = getRecordDate(student);

      if (date) {
        activities.push({
          type: "Student",
          title: `${getStudentName(student)} registered`,
          date,
        });
      }
    });

    filteredData.careers.forEach((career) => {
      const date = getRecordDate(career);

      if (date) {
        activities.push({
          type: "Career",
          title: `${getCareerName(career)} submitted an application`,
          date,
        });
      }
    });

    return activities
      .sort((a, b) => b.date - a.date)
      .slice(0, 6);
  }, [filteredData]);

  /* =========================================================
     ATTENTION REQUIRED
  ========================================================= */

  const attentionItems = useMemo(() => {
    const items = [];

    const pendingQueries = queries.filter(
      (query) =>
        [
          "pending",
          "new",
          "follow-up",
          "followup",
          "follow up",
        ].includes(getStatus(query))
    );

    if (pendingQueries.length) {
      items.push({
        type: "Queries",
        title: `${pendingQueries.length} enquiry${
          pendingQueries.length === 1
            ? ""
            : "ies"
        } require follow-up`,
        count: pendingQueries.length,
      });
    }

    const pendingCareers = careers.filter(
      (career) =>
        [
          "new",
          "review",
          "under review",
        ].includes(getStatus(career))
    );

    if (pendingCareers.length) {
      items.push({
        type: "Careers",
        title: `${pendingCareers.length} career application${
          pendingCareers.length === 1
            ? ""
            : "s"
        } awaiting review`,
        count: pendingCareers.length,
      });
    }

    const pendingStudents = students.filter(
      (student) =>
        getStatus(student) === "pending"
    );

    if (pendingStudents.length) {
      items.push({
        type: "Students",
        title: `${pendingStudents.length} student registration${
          pendingStudents.length === 1
            ? ""
            : "s"
        } are pending`,
        count: pendingStudents.length,
      });
    }

    return items;
  }, [queries, careers, students]);

  /* =========================================================
     TREND DATA
  ========================================================= */

  const trendData = useMemo(() => {
    const now = new Date();

    if (period === "today") {
      return [
        {
          label: "Today",
          queries: filteredData.queries.length,
          registrations:
            filteredData.students.length,
        },
      ];
    }

    const points = [];

    if (period === "90") {
      for (let i = 11; i >= 0; i -= 1) {
        const end = new Date(now);

        end.setDate(
          end.getDate() - i * 7
        );

        end.setHours(
          23,
          59,
          59,
          999
        );

        const start = new Date(end);

        start.setDate(
          start.getDate() - 6
        );

        start.setHours(
          0,
          0,
          0,
          0
        );

        points.push({
          label: end.toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
            }
          ),

          queries: queries.filter(
            (query) => {
              const date =
                getRecordDate(query);

              return (
                date &&
                date >= start &&
                date <= end
              );
            }
          ).length,

          registrations: students.filter(
            (student) => {
              const date =
                getRecordDate(student);

              return (
                date &&
                date >= start &&
                date <= end
              );
            }
          ).length,
        });
      }

      return points;
    }

    if (period === "year") {
      for (let i = 11; i >= 0; i -= 1) {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        );

        const start = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        );

        const end = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );

        points.push({
          label:
            date.toLocaleDateString(
              "en-IN",
              {
                month: "short",
              }
            ),

          queries: queries.filter(
            (query) => {
              const queryDate =
                getRecordDate(query);

              return (
                queryDate &&
                queryDate >= start &&
                queryDate <= end
              );
            }
          ).length,

          registrations:
            students.filter(
              (student) => {
                const studentDate =
                  getRecordDate(student);

                return (
                  studentDate &&
                  studentDate >= start &&
                  studentDate <= end
                );
              }
            ).length,
        });
      }

      return points;
    }

    const days =
      period === "7"
        ? 7
        : 30;

    for (
      let i = days - 1;
      i >= 0;
      i -= 1
    ) {
      const date = new Date(now);

      date.setDate(
        date.getDate() - i
      );

      const start = new Date(date);

      start.setHours(
        0,
        0,
        0,
        0
      );

      const end = new Date(date);

      end.setHours(
        23,
        59,
        59,
        999
      );

      points.push({
        label:
          date.toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
            }
          ),

        queries: queries.filter(
          (query) => {
            const queryDate =
              getRecordDate(query);

            return (
              queryDate &&
              queryDate >= start &&
              queryDate <= end
            );
          }
        ).length,

        registrations:
          students.filter(
            (student) => {
              const studentDate =
                getRecordDate(student);

              return (
                studentDate &&
                studentDate >= start &&
                studentDate <= end
              );
            }
          ).length,
      });
    }

    return points;
  }, [
    period,
    filteredData,
    queries,
    students,
  ]);

  /* =========================================================
     CSV DOWNLOAD
  ========================================================= */

  const csvValue = (value) => {
    let output =
      value === null ||
      value === undefined
        ? ""
        : value;

    if (typeof output === "object") {
      try {
        output =
          JSON.stringify(output);
      } catch {
        output = "";
      }
    }

    output = String(output);

    if (
      output.includes(",") ||
      output.includes('"') ||
      output.includes("\n") ||
      output.includes("\r")
    ) {
      return `"${output.replace(
        /"/g,
        '""'
      )}"`;
    }

    return output;
  };

  const downloadCsv = (
    filename,
    rows
  ) => {
    if (!Array.isArray(rows) || !rows.length) {
      showMessage("There is no data available to export.");
      return;
    }

    const csv = rows
      .map((row) =>
        row
          .map(csvValue)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const getPeriodLabel = () => {
    if (period === "today") {
      return "Today";
    }

    if (period === "year") {
      return "This Year";
    }

    return `Last ${period} Days`;
  };

  const getFileDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =========================================================
     STUDENT DOWNLOAD
  ========================================================= */

  const handleDownloadStudents = () => {
    if (
      !filteredData.students.length
    ) {
      showMessage(
        "No student records found for the selected period."
      );

      return;
    }

    const rows = [
      [
        "MedPath Academy - Student Report",
      ],

      [
        "Reporting Period",
        getPeriodLabel(),
      ],

      [
        "Generated On",
        formatDateTime(
          new Date()
        ),
      ],

      [],

      [
        "Student ID",
        "Student Name",
        "Date of Birth",
        "Gender",
        "Email",
        "Mobile",
        "Address",
        "Parent Name",
        "Relationship",
        "Parent Mobile",
        "Parent Email",
        "Emergency Contact",
        "Class",
        "Course",
        "Batch",
        "Centre",
        "Admission Date",
        "Enrollment Type",
        "Status",
        "Source",
        "Assigned Staff",
        "Notes",
      ],

      ...filteredData.students.map(
        (student) => [
          student?.studentId ||
            student?._id ||
            "",

          getStudentName(student),

          formatDate(
            student?.dob
          ),

          student?.gender ||
            "",

          student?.email ||
            student?.studentEmail ||
            "",

          student?.phone ||
            student?.mobile ||
            "",

          student?.address ||
            "",

          student?.parentName ||
            "",

          student?.relationship ||
            "",

          student?.parentMobile ||
            "",

          student?.parentEmail ||
            "",

          student?.emergencyContact ||
            "",

          student?.className ||
            student?.studentClass ||
            "",

          student?.course ||
            "",

          student?.batch ||
            "",

          student?.centre ||
            student?.center ||
            "",

          formatDate(
            student?.admissionDate
          ),

          student?.enrollmentType ||
            "",

          student?.status ||
            "",

          student?.source ||
            "",

          student?.assignedStaff ||
            "",

          student?.notes ||
            "",
        ]
      ),
    ];

    downloadCsv(
      `medpath-students-${getFileDate()}.csv`,
      rows
    );

    showMessage(
      "Student report downloaded."
    );
  };

  /* =========================================================
     QUERY DOWNLOAD
  ========================================================= */

  const handleDownloadQueries = () => {
    if (
      !filteredData.queries.length
    ) {
      showMessage(
        "No query records found for the selected period."
      );

      return;
    }

    const rows = [
      [
        "MedPath Academy - Query Report",
      ],

      [
        "Reporting Period",
        getPeriodLabel(),
      ],

      [
        "Generated On",
        formatDateTime(
          new Date()
        ),
      ],

      [],

      [
        "Query ID",
        "Name",
        "Email",
        "Phone",
        "Course",
        "Centre",
        "Source",
        "Status",
        "Assigned Staff",
        "Query Date",
        "Follow-up Date",
        "Message",
        "Notes",
      ],

      ...filteredData.queries.map(
        (query) => [
          query?.queryId ||
            query?._id ||
            "",

          getQueryName(query),

          query?.email ||
            "",

          query?.phone ||
            query?.mobile ||
            "",

          query?.course ||
            "",

          query?.centre ||
            query?.center ||
            "",

          getQuerySource(query),

          query?.status ||
            "",

          getAssignedStaff(
            query
          ),

          formatDate(
            query?.queryDate ||
              query?.createdAt ||
              query?.date
          ),

          formatDate(
            query?.followUpDate ||
              query?.followupDate
          ),

          query?.message ||
            query?.query ||
            query?.description ||
            "",

          query?.notes ||
            query?.adminNotes ||
            "",
        ]
      ),
    ];

    downloadCsv(
      `medpath-queries-${getFileDate()}.csv`,
      rows
    );

    showMessage(
      "Query report downloaded."
    );
  };

  /* =========================================================
     CAREER DOWNLOAD
  ========================================================= */

  const getResumeValue = (
    career
  ) => {
    return (
      career?.resume ||
      career?.resumeUrl ||
      career?.resumeURL ||
      career?.resumeLink ||
      career?.cv ||
      career?.cvUrl ||
      ""
    );
  };

  const getResumeUrl = (resume) => {
    if (!resume) {
      return "";
    }

    const value = String(resume).trim();

    if (!value) {
      return "";
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (value.startsWith("//")) {
      return `${window.location.protocol}${value}`;
    }

    // Career uploads are served by the Express backend at /uploads.
    // Keep this configurable for deployment while preserving localhost.
    const configuredApiUrl =
      window.__MEDPATH_API_URL__ ||
      "http://medlife-academy.onrender.com";

    const apiOrigin = String(
      configuredApiUrl
    ).replace(/\/api\/?$/i, "");

    try {
      return new URL(
        value.startsWith("/")
          ? value
          : `/${value}`,
        apiOrigin
      ).href;
    } catch {
      return value;
    }
  };

  const handleDownloadCareers =
    () => {
      if (
        !filteredData.careers
          .length
      ) {
        showMessage(
          "No career applicants found for the selected period."
        );

        return;
      }

      const rows = [
        [
          "MedPath Academy - Career Applicant Report",
        ],

        [
          "Reporting Period",
          getPeriodLabel(),
        ],

        [
          "Generated On",
          formatDateTime(
            new Date()
          ),
        ],

        [],

        [
          "Applicant ID",
          "Applicant Name",
          "Email",
          "Phone",
          "Experience",
          "Company",
          "Designation",
          "Address",
          "Position",
          "Department",
          "Applied On",
          "Source",
          "Preferred Location",
          "Resume",
          "Status",
          "Interview Status",
          "Interview Date",
          "Interviewer",
          "Interview Mode",
          "Admin Notes",
        ],

        ...filteredData.careers.map(
          (career) => [
            career?._id ||
              career?.applicantId ||
              "",

            getCareerName(
              career
            ),

            career?.email ||
              "",

            career?.phone ||
              "",

            career?.experience ||
              "",

            career?.company ||
              "",

            career?.designation ||
              "",

            career?.address ||
              "",

            career?.position ||
              "",

            career?.department ||
              "",

            formatDate(
              career?.appliedOn ||
                career?.applicationDate ||
                career?.createdAt
            ),

            career?.source ||
              "",

            career?.preferredLocation ||
              "",

            getResumeUrl(
              getResumeValue(career)
            ),

            career?.status ||
              "",

            career?.interviewStatus ||
              "",

            formatDate(
              career?.interviewDate
            ),

            career?.interviewer ||
              "",

            career?.interviewMode ||
              "",

            career?.adminNotes ||
              "",
          ]
        ),
      ];

      downloadCsv(
        `medpath-career-applicants-${getFileDate()}.csv`,
        rows
      );

      showMessage(
        "Career applicant report downloaded."
      );
    };

  /* =========================================================
     COMPLETE REPORT
  ========================================================= */

  const handleExport = () => {
    try {
      const rows = [
        [
          "MEDPATH ACADEMY - COMPLETE REPORT",
        ],

        [
          "Reporting Period",
          getPeriodLabel(),
        ],

        [
          "Generated On",
          formatDateTime(
            new Date()
          ),
        ],

        [],

        ["SUMMARY"],

        [
          "Metric",
          "Value",
        ],

        [
          "Queries Received",
          reportStats.queries,
        ],

        [
          "New Registrations",
          reportStats.registrations,
        ],

        [
          "New Admissions",
          reportStats.admissions,
        ],

        [
          "Follow-ups",
          reportStats.followUps,
        ],

        [
          "Career Applications",
          reportStats.careers,
        ],

        [
          "Active Students",
          reportStats.activeStudents,
        ],

        [],

        ["QUERY SOURCES"],

        [
          "Source",
          "Queries",
          "Percentage",
        ],

        ...querySources.map(
          (item) => [
            item.name,
            item.count,
            `${item.percentage}%`,
          ]
        ),

        [],

        ["ADMISSION FUNNEL"],

        [
          "Stage",
          "Count",
        ],

        ...admissionFunnel.map(
          (item) => [
            item.label,
            item.value,
          ]
        ),

        [],

        ["CENTRE PERFORMANCE"],

        [
          "Centre",
          "Queries",
          "Registrations",
          "Admissions",
        ],

        ...centrePerformance.map(
          (item) => [
            item.centre,
            item.queries,
            item.registrations,
            item.admissions,
          ]
        ),

        [],

        ["COUNSELLOR PERFORMANCE"],

        [
          "Counsellor",
          "Queries",
          "Conversions",
        ],

        ...counsellorPerformance.map(
          (item) => [
            item.name,
            item.queries,
            item.conversions,
          ]
        ),

        [],

        ["STUDENTS"],

        [
          "Student ID",
          "Name",
          "Email",
          "Phone",
          "Course",
          "Batch",
          "Centre",
          "Admission Date",
          "Status",
        ],

        ...filteredData.students.map(
          (student) => [
            student?.studentId ||
              student?._id ||
              "",

            getStudentName(
              student
            ),

            student?.email ||
              "",

            student?.phone ||
              student?.mobile ||
              "",

            student?.course ||
              "",

            student?.batch ||
              "",

            student?.centre ||
              student?.center ||
              "",

            formatDate(
              student?.admissionDate
            ),

            student?.status ||
              "",
          ]
        ),

        [],

        ["CAREER APPLICANTS"],

        [
          "Applicant ID",
          "Name",
          "Email",
          "Phone",
          "Position",
          "Department",
          "Applied On",
          "Status",
          "Resume",
        ],

        ...filteredData.careers.map(
          (career) => [
            career?._id ||
              career?.applicantId ||
              "",

            getCareerName(
              career
            ),

            career?.email ||
              "",

            career?.phone ||
              "",

            career?.position ||
              "",

            career?.department ||
              "",

            formatDate(
              career?.appliedOn ||
                career?.applicationDate ||
                career?.createdAt
            ),

            career?.status ||
              "",

            getResumeUrl(
              getResumeValue(career)
            ),
          ]
        ),

        [],

        ["QUERIES"],

        [
          "Query ID",
          "Name",
          "Email",
          "Phone",
          "Course",
          "Centre",
          "Source",
          "Status",
          "Assigned Staff",
          "Date",
        ],

        ...filteredData.queries.map(
          (query) => [
            query?.queryId ||
              query?._id ||
              "",

            getQueryName(query),

            query?.email ||
              "",

            query?.phone ||
              query?.mobile ||
              "",

            query?.course ||
              "",

            query?.centre ||
              query?.center ||
              "",

            getQuerySource(
              query
            ),

            query?.status ||
              "",

            getAssignedStaff(
              query
            ),

            formatDate(
              query?.queryDate ||
                query?.createdAt ||
                query?.date
            ),
          ]
        ),
      ];

      downloadCsv(
        `medpath-complete-report-${getFileDate()}.csv`,
        rows
      );

      showMessage(
        "Complete report downloaded."
      );
    } catch (err) {
      console.error(
        "Export error:",
        err
      );

      showMessage(
        "Unable to export the report."
      );
    }
  };

  /* =========================================================
     RESUME
  ========================================================= */

  const handleResumeDownload =
    async (career) => {
      const resume =
        getResumeValue(career);

      if (!resume) {
        showMessage(
          "No resume file/link is available for this applicant."
        );

        return;
      }

      const resumeUrl = getResumeUrl(resume);

      if (!resumeUrl) {
        showMessage(
          "The resume link is not valid."
        );
        return;
      }

      try {
        const response = await fetch(
          resumeUrl
        );

        if (!response.ok) {
          throw new Error(
            `Resume download failed (${response.status}).`
          );
        }

        const blob = await response.blob();
        const blobUrl =
          URL.createObjectURL(blob);

        const anchor =
          document.createElement("a");

        const rawName =
          String(
            career?.name ||
              career?.fullName ||
              career?.applicantName ||
              getCareerName(career) ||
              "career-applicant"
          )
            .trim()
            .replace(/[^a-z0-9]+/gi, "-")
            .replace(/^-+|-+$/g, "") ||
          "career-applicant";

        const urlPath =
          new URL(
            resumeUrl,
            window.location.href
          ).pathname;

        const extensionMatch =
          urlPath.match(/\.(pdf|docx?|PDF|DOCX?)$/);

        const extension =
          extensionMatch
            ? `.${extensionMatch[1].toLowerCase()}`
            : ".pdf";

        anchor.href = blobUrl;
        anchor.download = `${rawName}-resume${extension}`;
        anchor.style.display = "none";

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        window.setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 100);

        showMessage(
          "Resume downloaded successfully."
        );
      } catch (error) {
        console.error(
          "Resume download error:",
          error
        );

        // Fallback for external resume links or servers that block
        // programmatic downloads.
        window.open(
          resumeUrl,
          "_blank",
          "noopener,noreferrer"
        );

        showMessage(
          "Opening the resume link instead."
        );
      }
    };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout =
    async () => {
      try {
        await logout();

        navigate(
          "/admin/login",
          {
            replace: true,
          }
        );
      } catch (err) {
        console.error(
          "Logout error:",
          err
        );

        navigate(
          "/admin/login",
          {
            replace: true,
          }
        );
      }
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="report-page">
      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "show" : ""
        }`}
        onClick={() =>
          setSidebarOpen(false)
        }
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-logo">
            M
          </div>

          <div className="brand-copy">
            <div className="brand-name">
              MedPath Academy
            </div>

            <div className="brand-subtitle">
              ADMIN PANEL
            </div>
          </div>
        </div>

        <nav
          className="sidebar-nav"
          aria-label="Admin navigation"
        >
          <div className="nav-label">
            Main Menu
          </div>

          <Link
            className="nav-item"
            to="/admin/dashboard"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="nav-icon">
              ▦
            </span>

            <span>
              Dashboard
            </span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/queries"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="nav-icon">
              ⌁
            </span>

            <span>
              Queries
            </span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/students"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="nav-icon">
              ♙
            </span>

            <span>
              Students
            </span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/batches"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="nav-icon">
              ▤
            </span>

            <span>
              Batches
            </span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/careers"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="nav-icon">
              ◉
            </span>

            <span>
              Career Applications
            </span>
          </Link>

          <div className="nav-label management-label">
            Management
          </div>

          <Link
            className="nav-item active"
            to="/admin/report"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="nav-icon">
              ▥
            </span>

            <span>
              Reports
            </span>
          </Link>

          <Link
            className="nav-item"
            to="/admin/settings"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="nav-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">
              AD
            </div>

            <div className="admin-profile-copy">
              <div className="admin-name">
                Admin
              </div>

              <div className="admin-role">
                <span className="online-dot" />
                Super Administrator
              </div>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="logout-icon">
              ↪
            </span>

            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open navigation"
            >
              ☰
            </button>

            <div className="topbar-copy">
              <div className="page-title">
                Reports &amp; Analytics
              </div>

              <div className="page-subtitle">
                Track academy activity,
                enquiries,
                registrations and
                admissions
              </div>
            </div>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
            >
              ♢
            </button>

            <button
              type="button"
              className="icon-button"
              aria-label="Admin profile"
            >
              ◉
            </button>
          </div>
        </header>

        <section className="content">
          <div className="page-intro">
            <div className="intro-copy">
              <div className="eyebrow">
                Reporting &amp; Analytics
              </div>

              <h1 className="intro-heading">
                Academy Overview
              </h1>

              <p className="intro-text">
                Live reporting based on
                your current academy
                records.
              </p>
            </div>

            <div className="report-actions">
              <select
                className="date-select"
                value={period}
                onChange={(event) =>
                  setPeriod(
                    event.target.value
                  )
                }
                aria-label="Report period"
              >
                <option value="today">
                  Today
                </option>

                <option value="7">
                  Last 7 Days
                </option>

                <option value="30">
                  Last 30 Days
                </option>

                <option value="90">
                  Last 90 Days
                </option>

                <option value="year">
                  This Year
                </option>
              </select>

              <button
                type="button"
                className="action-button"
                onClick={
                  loadReportData
                }
                disabled={loading}
              >
                <span className="button-icon">
                  ↻
                </span>

                {loading
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={
                  handleExport
                }
                disabled={
                  loading || !!error
                }
              >
                <span className="button-icon">
                  ↓
                </span>

                Export Report
              </button>
            </div>
          </div>

          {error && (
            <div className="panel error-panel">
              <div className="error-content">
                <div className="empty-state-icon error-icon">
                  !
                </div>

                <div className="error-copy">
                  <h3>
                    Unable to load report
                    data
                  </h3>

                  <p>
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    loadReportData
                  }
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="panel loading-panel">
              <div className="empty-panel-state wide">
                <div className="loading-spinner" />

                <h3>
                  Loading reports...
                </h3>

                <p>
                  Fetching the latest
                  students, enquiries and
                  career application data.
                </p>
              </div>
            </div>
          ) : !error ? (
            <>
              {/* =================================================
                  DOWNLOAD CENTRE
              ================================================= */}

              <div className="download-panel panel">
                <div className="panel-header">
                  <div>
                    <div className="section-kicker">
                      Data Export
                    </div>

                    <div className="panel-heading">
                      Download Academy Data
                    </div>

                    <div className="panel-description">
                      Download detailed
                      records for the
                      selected reporting
                      period.
                    </div>
                  </div>

                  <div className="period-badge">
                    {getPeriodLabel()}
                  </div>
                </div>

                <div className="download-grid">
                  <button
                    type="button"
                    className="download-card"
                    onClick={
                      handleDownloadStudents
                    }
                  >
                    <span className="download-card-icon">
                      ♙
                    </span>

                    <span className="download-card-copy">
                      <strong>
                        Students
                      </strong>

                      <small>
                        {formatNumber(
                          filteredData
                            .students
                            .length
                        )}{" "}
                        records
                      </small>
                    </span>

                    <span className="download-arrow">
                      ↓
                    </span>
                  </button>

                  <button
                    type="button"
                    className="download-card"
                    onClick={
                      handleDownloadQueries
                    }
                  >
                    <span className="download-card-icon">
                      ⌁
                    </span>

                    <span className="download-card-copy">
                      <strong>
                        Queries
                      </strong>

                      <small>
                        {formatNumber(
                          filteredData
                            .queries
                            .length
                        )}{" "}
                        records
                      </small>
                    </span>

                    <span className="download-arrow">
                      ↓
                    </span>
                  </button>

                  <button
                    type="button"
                    className="download-card"
                    onClick={
                      handleDownloadCareers
                    }
                  >
                    <span className="download-card-icon">
                      ◉
                    </span>

                    <span className="download-card-copy">
                      <strong>
                        Career Applicants
                      </strong>

                      <small>
                        {formatNumber(
                          filteredData
                            .careers
                            .length
                        )}{" "}
                        records
                      </small>
                    </span>

                    <span className="download-arrow">
                      ↓
                    </span>
                  </button>

                  <button
                    type="button"
                    className="download-card featured"
                    onClick={
                      handleExport
                    }
                  >
                    <span className="download-card-icon">
                      ▣
                    </span>

                    <span className="download-card-copy">
                      <strong>
                        Complete Report
                      </strong>

                      <small>
                        Summary + detailed
                        records
                      </small>
                    </span>

                    <span className="download-arrow">
                      ↓
                    </span>
                  </button>
                </div>

                {filteredData.careers.some(
                  (career) =>
                    getResumeValue(
                      career
                    )
                ) && (
                  <div className="resume-section">
                    <div className="resume-section-header">
                      <div>
                        <div className="resume-title">
                          Career Applicant
                          Resumes
                        </div>

                        <div className="resume-subtitle">
                          Open the available
                          resume files/links
                          from the selected
                          period.
                        </div>
                      </div>

                      <span className="resume-count">
                        {
                          filteredData
                            .careers
                            .filter(
                              (
                                career
                              ) =>
                                getResumeValue(
                                  career
                                )
                            )
                            .length
                        }
                      </span>
                    </div>

                    <div className="resume-list">
                      {filteredData
                        .careers
                        .filter(
                          (career) =>
                            getResumeValue(
                              career
                            )
                        )
                        .slice(0, 10)
                        .map(
                          (career) => (
                            <div
                              className="resume-item"
                              key={
                                career?._id ||
                                career?.applicantId ||
                                getCareerName(
                                  career
                                )
                              }
                            >
                              <div className="resume-person">
                                <span className="resume-avatar">
                                  {getCareerName(
                                    career
                                  )
                                    .slice(
                                      0,
                                      1
                                    )
                                    .toUpperCase()}
                                </span>

                                <div>
                                  <strong>
                                    {getCareerName(
                                      career
                                    )}
                                  </strong>

                                  <span>
                                    {career?.position ||
                                      "Career Applicant"}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="small-action-button"
                                onClick={() =>
                                  handleResumeDownload(
                                    career
                                  )
                                }
                              >
                                ↓ Resume
                              </button>
                            </div>
                          )
                        )}
                    </div>

                    {filteredData.careers.filter(
                      (career) =>
                        getResumeValue(
                          career
                        )
                    ).length > 10 && (
                      <p className="resume-note">
                        Showing the first 10
                        available resumes.
                        The Career
                        Applicants CSV
                        contains the resume
                        link for every
                        applicant.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* =================================================
                  STATS
              ================================================= */}

              <div className="stats-grid">
                {[
                  [
                    "Queries Received",
                    "⌁",
                    reportStats.queries,
                  ],
                  [
                    "New Registrations",
                    "♙",
                    reportStats.registrations,
                  ],
                  [
                    "New Admissions",
                    "✓",
                    reportStats.admissions,
                  ],
                  [
                    "Follow-ups",
                    "◷",
                    reportStats.followUps,
                  ],
                  [
                    "Career Applications",
                    "◉",
                    reportStats.careers,
                  ],
                  [
                    "Active Students",
                    "♧",
                    reportStats.activeStudents,
                  ],
                ].map(
                  ([
                    label,
                    icon,
                    value,
                  ]) => (
                    <div
                      className="stat-card"
                      key={label}
                    >
                      <div className="stat-top">
                        <span className="stat-label">
                          {label}
                        </span>

                        <span className="stat-icon">
                          {icon}
                        </span>
                      </div>

                      <div className="stat-number">
                        {formatNumber(
                          value
                        )}
                      </div>

                      <div className="stat-change">
                        <span className="stat-dot" />
                        {getPeriodLabel()}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* =================================================
                  TREND + SOURCES
              ================================================= */}

              <div className="chart-grid">
                <div className="panel trend-panel">
                  <div className="panel-header">
                    <div>
                      <div className="section-kicker">
                        Activity
                      </div>

                      <div className="panel-heading">
                        Query &amp;
                        Registration Trend
                      </div>

                      <div className="panel-description">
                        Activity for the
                        selected reporting
                        period.
                      </div>
                    </div>

                    <div className="chart-legend">
                      <span>
                        <i className="legend-dot query" />
                        Queries
                      </span>

                      <span>
                        <i className="legend-dot registration" />
                        Registrations
                      </span>
                    </div>
                  </div>

                  <div className="trend-scroll">
                    <div
                      className="trend-chart"
                      style={{
                        minWidth:
                          trendData.length >
                          12
                            ? `${Math.max(
                                trendData.length *
                                  38,
                                760
                              )}px`
                            : "100%",
                      }}
                    >
                      {trendData.map(
                        (
                          item,
                          index
                        ) => {
                          const max =
                            Math.max(
                              ...trendData.map(
                                (
                                  point
                                ) =>
                                  Math.max(
                                    point.queries,
                                    point.registrations
                                  )
                              ),
                              1
                            );

                          const queryHeight =
                            Math.max(
                              (item.queries /
                                max) *
                                135,
                              item.queries
                                ? 8
                                : 3
                            );

                          const registrationHeight =
                            Math.max(
                              (item.registrations /
                                max) *
                                135,
                              item.registrations
                                ? 8
                                : 3
                            );

                          return (
                            <div
                              className="trend-item"
                              key={`${item.label}-${index}`}
                            >
                              <div
                                className="trend-value-area"
                                title={`Queries: ${item.queries} | Registrations: ${item.registrations}`}
                              >
                                <div
                                  className="trend-bar query"
                                  style={{
                                    height: `${queryHeight}px`,
                                  }}
                                />

                                <div
                                  className="trend-bar registration"
                                  style={{
                                    height: `${registrationHeight}px`,
                                  }}
                                />
                              </div>

                              <span className="trend-label">
                                {item.label}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <div className="section-kicker">
                        Sources
                      </div>

                      <div className="panel-heading">
                        Query Sources
                      </div>

                      <div className="panel-description">
                        Distribution of
                        enquiries by source.
                      </div>
                    </div>
                  </div>

                  {querySources.length ? (
                    <div className="source-list">
                      {querySources
                        .slice(0, 8)
                        .map(
                          (
                            source
                          ) => (
                            <div
                              className="source-row"
                              key={
                                source.name
                              }
                            >
                              <div className="source-meta">
                                <span>
                                  {
                                    source.name
                                  }
                                </span>

                                <strong>
                                  {
                                    source.count
                                  }{" "}
                                  <em>
                                    (
                                    {
                                      source.percentage
                                    }
                                    %)
                                  </em>
                                </strong>
                              </div>

                              <div className="progress-track">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${source.percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  ) : (
                    <div className="empty-panel-state compact">
                      <div className="empty-state-icon">
                        ◌
                      </div>

                      <h3>
                        No source data
                      </h3>

                      <p>
                        Source distribution
                        will appear when
                        enquiries are
                        available.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
                  FUNNEL + COUNSELLORS
              ================================================= */}

              <div className="bottom-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <div className="section-kicker">
                        Conversion
                      </div>

                      <div className="panel-heading">
                        Admission Funnel
                      </div>

                      <div className="panel-description">
                        Track the journey
                        from enquiry to
                        enrolment.
                      </div>
                    </div>
                  </div>

                  {admissionFunnel.some(
                    (stage) =>
                      stage.value > 0
                  ) ? (
                    <div className="funnel-list">
                      {admissionFunnel.map(
                        (
                          stage
                        ) => (
                          <div
                            className="funnel-row"
                            key={
                              stage.label
                            }
                          >
                            <div className="funnel-meta">
                              <span>
                                {
                                  stage.label
                                }
                              </span>

                              <strong>
                                {
                                  stage.value
                                }
                              </strong>
                            </div>

                            <div className="funnel-track">
                              <div
                                className="funnel-fill"
                                style={{
                                  width: `${stage.width}%`,
                                }}
                              >
                                {stage.value >
                                  0 && (
                                  <span>
                                    {
                                      stage.label
                                    }
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="empty-panel-state">
                      <div className="empty-state-icon">
                        ⌁
                      </div>

                      <h3>
                        No funnel data yet
                      </h3>

                      <p>
                        The admission funnel
                        will populate from
                        enquiry and student
                        records.
                      </p>
                    </div>
                  )}
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <div className="section-kicker">
                        Team
                      </div>

                      <div className="panel-heading">
                        Counsellor
                        Performance
                      </div>

                      <div className="panel-description">
                        Enquiries handled
                        and conversions
                        where assigned
                        staff data exists.
                      </div>
                    </div>
                  </div>

                  {counsellorPerformance.length ? (
                    <div className="table-wrap">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>
                              Counsellor
                            </th>

                            <th>
                              Queries
                            </th>

                            <th>
                              Conversions
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {counsellorPerformance
                            .slice(
                              0,
                              6
                            )
                            .map(
                              (
                                item
                              ) => (
                                <tr
                                  key={
                                    item.name
                                  }
                                >
                                  <td>
                                    <span className="person-cell">
                                      <span className="person-avatar">
                                        {item.name
                                          .slice(
                                            0,
                                            1
                                          )
                                          .toUpperCase()}
                                      </span>

                                      {
                                        item.name
                                      }
                                    </span>
                                  </td>

                                  <td className="numeric-cell">
                                    {
                                      item.queries
                                    }
                                  </td>

                                  <td className="numeric-cell">
                                    <span className="conversion-pill">
                                      {
                                        item.conversions
                                      }
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-panel-state">
                      <div className="empty-state-icon">
                        ♙
                      </div>

                      <h3>
                        No counsellor
                        data
                      </h3>

                      <p>
                        Counsellor
                        performance will
                        appear when queries
                        have assigned staff
                        information.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
                  CENTRE PERFORMANCE
              ================================================= */}

              <div className="panel centre-panel">
                <div className="panel-header">
                  <div>
                    <div className="section-kicker">
                      Centres
                    </div>

                    <div className="panel-heading">
                      Centre Performance
                    </div>

                    <div className="panel-description">
                      Compare enquiries,
                      registrations and
                      admissions across
                      centres.
                    </div>
                  </div>
                </div>

                {centrePerformance.length ? (
                  <div className="table-wrap">
                    <table className="data-table centre-table">
                      <thead>
                        <tr>
                          <th>
                            Centre
                          </th>

                          <th>
                            Queries
                          </th>

                          <th>
                            Registrations
                          </th>

                          <th>
                            Admissions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {centrePerformance.map(
                          (
                            item
                          ) => (
                            <tr
                              key={
                                item.centre
                              }
                            >
                              <td>
                                <span className="centre-name">
                                  {
                                    item.centre
                                  }
                                </span>
                              </td>

                              <td className="numeric-cell">
                                {
                                  item.queries
                                }
                              </td>

                              <td className="numeric-cell">
                                {
                                  item.registrations
                                }
                              </td>

                              <td className="numeric-cell">
                                <span className="conversion-pill">
                                  {
                                    item.admissions
                                  }
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-panel-state wide">
                    <div className="empty-state-icon">
                      ▤
                    </div>

                    <h3>
                      No centre data yet
                    </h3>

                    <p>
                      Centre-level
                      reporting will
                      populate from the
                      academy database.
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  ACTIVITY + ATTENTION
              ================================================= */}

              <div className="bottom-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <div className="section-kicker">
                        Timeline
                      </div>

                      <div className="panel-heading">
                        Recent Admin
                        Activity
                      </div>

                      <div className="panel-description">
                        Recent records
                        created in the
                        academy system.
                      </div>
                    </div>
                  </div>

                  {recentActivity.length ? (
                    <div className="activity-list">
                      {recentActivity.map(
                        (
                          activity,
                          index
                        ) => (
                          <div
                            className="activity-item"
                            key={`${activity.type}-${activity.title}-${index}`}
                          >
                            <div className="activity-icon">
                              {activity.type ===
                              "Query"
                                ? "⌁"
                                : activity.type ===
                                  "Student"
                                ? "♙"
                                : "◉"}
                            </div>

                            <div className="activity-copy">
                              <strong>
                                {
                                  activity.title
                                }
                              </strong>

                              <span>
                                {
                                  activity.type
                                }
                              </span>
                            </div>

                            <time>
                              {formatDateTime(
                                activity.date
                              )}
                            </time>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="empty-panel-state">
                      <div className="empty-state-icon">
                        ◷
                      </div>

                      <h3>
                        No recent activity
                      </h3>

                      <p>
                        Recent records will
                        appear here when
                        academy activity is
                        recorded.
                      </p>
                    </div>
                  )}
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <div className="section-kicker">
                        Action Items
                      </div>

                      <div className="panel-heading">
                        Attention Required
                      </div>

                      <div className="panel-description">
                        Items that may need
                        immediate admin
                        action.
                      </div>
                    </div>
                  </div>

                  {attentionItems.length ? (
                    <div className="attention-list">
                      {attentionItems.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            className="attention-item"
                            key={`${item.type}-${index}`}
                          >
                            <div className="attention-icon">
                              !
                            </div>

                            <div className="attention-copy">
                              <strong>
                                {
                                  item.title
                                }
                              </strong>

                              <span>
                                {
                                  item.type
                                }
                              </span>
                            </div>

                            <span className="attention-count">
                              {
                                item.count
                              }
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="empty-panel-state">
                      <div className="empty-state-icon success-icon">
                        ✓
                      </div>

                      <h3>
                        Nothing requires
                        attention
                      </h3>

                      <p>
                        There are no
                        pending items
                        based on the
                        current academy
                        records.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </section>
      </main>

      <div
        className={`toast ${
          toastVisible ? "show" : ""
        }`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}

export default AdminReport;