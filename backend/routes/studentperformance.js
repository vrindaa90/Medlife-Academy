const express = require("express");
const mongoose = require("mongoose");

const Student = require("../models/student");
const StudentPerformance = require("../models/studentperformance");

const router = express.Router();

/* =========================================================
   FIND STUDENT
   Supports MongoDB _id and custom studentId
========================================================= */

const findStudent = async (id) => {
  const value = String(id || "").trim();

  if (!value) {
    return null;
  }

  // First try custom MedLife Student ID
  let student = await Student.findOne({
    studentId: value,
  });

  // Then try MongoDB _id
  if (
    !student &&
    mongoose.isValidObjectId(value)
  ) {
    student = await Student.findById(value);
  }

  return student;
};

/* =========================================================
   GET PERFORMANCE
========================================================= */

router.get(
  "/:id/performance",
  async (req, res) => {
    try {
      const student = await findStudent(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      let performance =
        await StudentPerformance.findOne({
          student: student._id,
        });

      if (!performance) {
        performance =
          new StudentPerformance({
            student: student._id,
            attendanceRecords: [],
            testRecords: [],
          });

        await performance.save();
      }

      return res.status(200).json({
        success: true,
        data: performance,
      });
    } catch (error) {
      console.error(
        "Get performance error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch student performance.",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   ADD ATTENDANCE
========================================================= */

router.post(
  "/:id/performance/attendance",
  async (req, res) => {
    try {
      const student = await findStudent(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const {
        date,
        status,
        remarks = "",
      } = req.body;

      if (!date) {
        return res.status(400).json({
          success: false,
          message:
            "Attendance date is required.",
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Attendance status is required.",
        });
      }

      if (
        ![
          "Present",
          "Absent",
          "Leave",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid attendance status.",
        });
      }

      const attendanceDate =
        new Date(date);

      if (
        Number.isNaN(
          attendanceDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid attendance date.",
        });
      }

      let performance =
        await StudentPerformance.findOne({
          student: student._id,
        });

      /*
       * If performance document doesn't exist,
       * create it first.
       */
      if (!performance) {
        performance =
          new StudentPerformance({
            student: student._id,
            attendanceRecords: [],
            testRecords: [],
          });
      }

      /*
       * Add attendance normally.
       */
      performance.attendanceRecords.push({
        date: attendanceDate,
        status,
        remarks:
          String(remarks || "").trim(),
      });

      await performance.save();

      return res.status(201).json({
        success: true,
        message:
          "Attendance added successfully.",
        data: performance,
      });
    } catch (error) {
      console.error(
        "ADD ATTENDANCE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          `Failed to add attendance: ${
            error.message ||
            "Unknown server error"
          }`,
        error:
          error.message ||
          "Unknown server error",
      });
    }
  }
);

/* =========================================================
   EDIT ATTENDANCE
========================================================= */

router.put(
  "/:id/performance/attendance/:recordId",
  async (req, res) => {
    try {
      const student = await findStudent(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const {
        date,
        status,
        remarks = "",
      } = req.body;

      if (!date || !status) {
        return res.status(400).json({
          success: false,
          message:
            "Date and status are required.",
        });
      }

      if (
        ![
          "Present",
          "Absent",
          "Leave",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid attendance status.",
        });
      }

      const performance =
        await StudentPerformance.findOne({
          student: student._id,
        });

      if (!performance) {
        return res.status(404).json({
          success: false,
          message:
            "Performance record not found.",
        });
      }

      const record =
        performance.attendanceRecords.id(
          req.params.recordId
        );

      if (!record) {
        return res.status(404).json({
          success: false,
          message:
            "Attendance record not found.",
        });
      }

      record.date = new Date(date);
      record.status = status;
      record.remarks =
        String(
          remarks || ""
        ).trim();

      await performance.save();

      return res.status(200).json({
        success: true,
        message:
          "Attendance updated successfully.",
        data: performance,
      });
    } catch (error) {
      console.error(
        "UPDATE ATTENDANCE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          `Failed to update attendance: ${
            error.message ||
            "Unknown server error"
          }`,
        error:
          error.message ||
          "Unknown server error",
      });
    }
  }
);

/* =========================================================
   DELETE ATTENDANCE
========================================================= */

router.delete(
  "/:id/performance/attendance/:recordId",
  async (req, res) => {
    try {
      const student = await findStudent(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const performance =
        await StudentPerformance.findOne({
          student: student._id,
        });

      if (!performance) {
        return res.status(404).json({
          success: false,
          message:
            "Performance record not found.",
        });
      }

      const record =
        performance.attendanceRecords.id(
          req.params.recordId
        );

      if (!record) {
        return res.status(404).json({
          success: false,
          message:
            "Attendance record not found.",
        });
      }

      record.deleteOne();

      await performance.save();

      return res.status(200).json({
        success: true,
        message:
          "Attendance deleted successfully.",
        data: performance,
      });
    } catch (error) {
      console.error(
        "DELETE ATTENDANCE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          `Failed to delete attendance: ${
            error.message ||
            "Unknown server error"
          }`,
        error:
          error.message ||
          "Unknown server error",
      });
    }
  }
);

/* =========================================================
   ADD MARKS
========================================================= */

router.post(
  "/:id/performance/tests",
  async (req, res) => {
    try {
      const student = await findStudent(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const {
        testName,
        subject,
        date,
        obtainedMarks,
        totalMarks,
        remarks = "",
      } = req.body;

      if (
        !testName ||
        !subject ||
        !date ||
        obtainedMarks ===
          undefined ||
        totalMarks ===
          undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Test name, subject, date, obtained marks and total marks are required.",
        });
      }

      const obtained =
        Number(obtainedMarks);

      const total =
        Number(totalMarks);

      if (
        !Number.isFinite(obtained) ||
        !Number.isFinite(total)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Marks must be valid numbers.",
        });
      }

      if (
        obtained < 0 ||
        total <= 0 ||
        obtained > total
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid marks values.",
        });
      }

      let performance =
        await StudentPerformance.findOne({
          student: student._id,
        });

      if (!performance) {
        performance =
          new StudentPerformance({
            student: student._id,
            attendanceRecords: [],
            testRecords: [],
          });
      }

      performance.testRecords.push({
        testName:
          String(testName).trim(),

        subject:
          String(subject).trim(),

        date,

        obtainedMarks:
          obtained,

        totalMarks:
          total,

        remarks:
          String(
            remarks || ""
          ).trim(),
      });

      await performance.save();

      return res.status(201).json({
        success: true,
        message:
          "Marks added successfully.",
        data: performance,
      });
    } catch (error) {
      console.error(
        "ADD MARKS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          `Failed to add marks: ${
            error.message ||
            "Unknown server error"
          }`,
        error:
          error.message ||
          "Unknown server error",
      });
    }
  }
);

/* =========================================================
   EDIT MARKS
========================================================= */

router.put(
  "/:id/performance/tests/:recordId",
  async (req, res) => {
    try {
      const student = await findStudent(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const {
        testName,
        subject,
        date,
        obtainedMarks,
        totalMarks,
        remarks = "",
      } = req.body;

      const obtained =
        Number(obtainedMarks);

      const total =
        Number(totalMarks);

      if (
        !testName ||
        !subject ||
        !date ||
        !Number.isFinite(obtained) ||
        !Number.isFinite(total) ||
        total <= 0 ||
        obtained < 0 ||
        obtained > total
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide valid test and marks details.",
        });
      }

      const performance =
        await StudentPerformance.findOne({
          student: student._id,
        });

      if (!performance) {
        return res.status(404).json({
          success: false,
          message:
            "Performance record not found.",
        });
      }

      const record =
        performance.testRecords.id(
          req.params.recordId
        );

      if (!record) {
        return res.status(404).json({
          success: false,
          message:
            "Test record not found.",
        });
      }

      record.testName =
        String(testName).trim();

      record.subject =
        String(subject).trim();

      record.date = date;

      record.obtainedMarks =
        obtained;

      record.totalMarks =
        total;

      record.remarks =
        String(
          remarks || ""
        ).trim();

      await performance.save();

      return res.status(200).json({
        success: true,
        message:
          "Marks updated successfully.",
        data: performance,
      });
    } catch (error) {
      console.error(
        "UPDATE MARKS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          `Failed to update marks: ${
            error.message ||
            "Unknown server error"
          }`,
        error:
          error.message ||
          "Unknown server error",
      });
    }
  }
);

/* =========================================================
   DELETE MARKS
========================================================= */

router.delete(
  "/:id/performance/tests/:recordId",
  async (req, res) => {
    try {
      const student = await findStudent(
        req.params.id
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const performance =
        await StudentPerformance.findOne({
          student: student._id,
        });

      if (!performance) {
        return res.status(404).json({
          success: false,
          message:
            "Performance record not found.",
        });
      }

      const record =
        performance.testRecords.id(
          req.params.recordId
        );

      if (!record) {
        return res.status(404).json({
          success: false,
          message:
            "Test record not found.",
        });
      }

      record.deleteOne();

      await performance.save();

      return res.status(200).json({
        success: true,
        message:
          "Marks deleted successfully.",
        data: performance,
      });
    } catch (error) {
      console.error(
        "DELETE MARKS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          `Failed to delete marks: ${
            error.message ||
            "Unknown server error"
          }`,
        error:
          error.message ||
          "Unknown server error",
      });
    }
  }
);

module.exports = router;