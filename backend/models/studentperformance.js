const mongoose = require("mongoose");

/* =========================================================
   ATTENDANCE RECORD
========================================================= */

const attendanceRecordSchema =
  new mongoose.Schema(
    {
      date: {
        type: Date,
        required: [
          true,
          "Attendance date is required",
        ],
      },

      status: {
        type: String,
        enum: {
          values: [
            "Present",
            "Absent",
            "Leave",
          ],
          message:
            "Attendance status must be Present, Absent or Leave",
        },
        required: [
          true,
          "Attendance status is required",
        ],
      },

      remarks: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      _id: true,
    }
  );

/* =========================================================
   TEST / MARKS RECORD
========================================================= */

const testRecordSchema =
  new mongoose.Schema(
    {
      testName: {
        type: String,
        required: [
          true,
          "Test name is required",
        ],
        trim: true,
      },

      subject: {
        type: String,
        required: [
          true,
          "Subject is required",
        ],
        trim: true,
      },

      date: {
        type: Date,
        required: [
          true,
          "Test date is required",
        ],
      },

      obtainedMarks: {
        type: Number,
        required: [
          true,
          "Obtained marks are required",
        ],
        min: [
          0,
          "Obtained marks cannot be negative",
        ],
      },

      totalMarks: {
        type: Number,
        required: [
          true,
          "Total marks are required",
        ],
        min: [
          0.01,
          "Total marks must be greater than 0",
        ],
      },

      remarks: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      _id: true,
    }
  );

/* =========================================================
   STUDENT PERFORMANCE
========================================================= */

const studentPerformanceSchema =
  new mongoose.Schema(
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: [
          true,
          "Student reference is required",
        ],
        unique: true,
      },

      attendanceRecords: {
        type: [attendanceRecordSchema],
        default: [],
      },

      testRecords: {
        type: [testRecordSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

/* =========================================================
   IMPORTANT
=========================================================

   DO NOT ADD:

   schema.pre("save", function(next) { ... })

   DO NOT ADD:

   schema.pre("validate", function(next) { ... })

   Mongoose 9 no longer passes next() to pre middleware.

   Validation for:
   - obtained <= total
   - attendance status
   - required fields

   is already handled in the API routes.
========================================================= */

/* =========================================================
   MODEL EXPORT
========================================================= */

const StudentPerformance =
  mongoose.models.StudentPerformance ||
  mongoose.model(
    "StudentPerformance",
    studentPerformanceSchema
  );

module.exports =
  StudentPerformance;