
const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    faculty: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      trim: true,
      default: "",
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    classroom: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
      trim: true,
    },

    batchCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    batchType: {
      type: String,
      required: true,
      trim: true,
    },

    centre: {
      type: String,
      required: true,
      trim: true,
    },

    classroom: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      default: "",
    },

    faculty: {
      type: [facultySchema],
      default: [],
    },

    coordinator: {
      type: String,
      trim: true,
      default: "",
    },

    schedule: {
      type: [scheduleSchema],
      default: [],
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    currentStudents: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Upcoming", "Completed", "Inactive"],
      default: "Active",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Batch", batchSchema);