const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Student Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    dob: String,
    gender: String,

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: String,

    // Parent / Guardian Information
    parentName: {
      type: String,
      required: true,
      trim: true,
    },

    relationship: {
      type: String,
      required: true,
    },

    parentMobile: {
      type: String,
      required: true,
      trim: true,
    },

    parentEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    // Academic & Enrollment
    className: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
    },

    batch: {
      type: String,
      required: true,
    },

    centre: {
      type: String,
      required: true,
    },

    admissionDate: {
      type: String,
      required: true,
    },

    enrollmentType: {
      type: String,
      required: true,
    },

    // Admin Information
    status: {
      type: String,
      enum: [
        "active",
        "pending",
        "inactive",
        "completed",
        "dropped",
      ],
      default: "active",
    },

    source: {
      type: String,
      default: "",
    },

    assignedStaff: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    // Automatically manages createdAt and updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);