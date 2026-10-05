
const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Query management fields
    status: {
      type: String,
      enum: ["new", "contacted", "followup", "resolved"],
      default: "new",
    },

    assignedTo: {
      type: String,
      default: "Admin",
    },

    category: {
      type: String,
      default: "General Enquiry",
    },

    priority: {
      type: String,
      enum: ["Low", "Normal", "High"],
      default: "Normal",
    },

    followupDate: {
      type: String,
      default: "",
    },

    followupTime: {
      type: String,
      default: "",
    },

    notes: [
      {
        text: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model("Query", querySchema);

module.exports = Query;