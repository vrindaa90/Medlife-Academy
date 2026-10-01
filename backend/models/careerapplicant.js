const mongoose = require("mongoose");

const careerApplicantSchema = new mongoose.Schema(
  {
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    designation: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    appliedOn: {
      type: Date,
      required: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    preferredLocation: {
      type: String,
      required: true,
      trim: true,
    },

    resume: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Offer",
        "Hired",
        "Rejected",
        "Withdrawn",
      ],
      default: "New",
    },

    interviewStatus: {
      type: String,
      enum: [
        "Not Scheduled",
        "Scheduled",
        "Completed",
      ],
      default: "Not Scheduled",
    },

    interviewDate: {
      type: Date,
      default: null,
    },

    interviewer: {
      type: String,
      default: "",
      trim: true,
    },

    interviewMode: {
      type: String,
      enum: [
        "",
        "In Person",
        "Online",
        "Phone",
      ],
      default: "",
    },

    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CareerApplicant",
  careerApplicantSchema
);