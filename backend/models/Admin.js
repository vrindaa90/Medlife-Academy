const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    // Admin's display name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Unique login username
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Admin email
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // NEVER store the actual password here.
    // This field will contain the bcrypt hash.
    passwordHash: {
      type: String,
      required: true,
    },

    // Allows us to support different admin levels later.
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },

    // Allows an admin account to be disabled
    // without deleting the account.
    isActive: {
      type: Boolean,
      default: true,
    },

    // Useful for the admin dashboard/security tracking.
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;