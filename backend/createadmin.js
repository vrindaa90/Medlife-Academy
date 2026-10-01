const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
require("dotenv").config();

const Admin = require("./models/Admin");

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/Institute_Management";

// Create terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask questions in terminal
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

const createAdmin = async () => {
  try {
    console.log("\n========================================");
    console.log("     MEDPATH ACADEMY - CREATE ADMIN");
    console.log("========================================\n");

    // Connect MongoDB
    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully!\n");

    // Get admin details
    const name = await askQuestion("Admin Name: ");
    const username = await askQuestion("Username: ");
    const email = await askQuestion("Email: ");
    const password = await askQuestion("Password: ");

    // Validate fields
    if (!name || !username || !email || !password) {
      console.log("\n❌ All fields are required.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      console.log("\n❌ Password must contain at least 6 characters.");
      return;
    }

    // Normalize username/email
    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { username: normalizedUsername },
        { email: normalizedEmail },
      ],
    });

    if (existingAdmin) {
      console.log(
        "\n❌ An admin with this username or email already exists."
      );
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin
    const admin = new Admin({
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    // Save to MongoDB
    await admin.save();

    console.log("\n========================================");
    console.log("      ✅ ADMIN CREATED SUCCESSFULLY");
    console.log("========================================");
    console.log(`Name     : ${admin.name}`);
    console.log(`Username : ${admin.username}`);
    console.log(`Email    : ${admin.email}`);
    console.log(`Role     : ${admin.role}`);
    console.log(`Active   : ${admin.isActive}`);
    console.log("Password : 🔐 Stored securely using bcrypt");
    console.log("========================================\n");

  } catch (error) {
    console.error("\n❌ Failed to create admin:");
    console.error(error.message);

  } finally {
    await mongoose.disconnect();
    rl.close();
  }
};

createAdmin();