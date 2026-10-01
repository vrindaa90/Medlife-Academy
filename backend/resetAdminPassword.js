const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/admin");

// 👇 PUT THE EXACT USERNAME YOU USE TO LOGIN HERE
const ADMIN_USERNAME = "YOUR_USERNAME";

// 👇 CHOOSE YOUR NEW PASSWORD HERE
const NEW_PASSWORD = "Admin@123";

async function resetAdminPassword() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://127.0.0.1:27017/Institute_Management"
    );

    console.log("MongoDB connected");

    const admin = await Admin.findOne({
      username: ADMIN_USERNAME.trim().toLowerCase(),
    });

    if (!admin) {
      console.log("❌ Admin not found.");
      console.log("Username searched:", ADMIN_USERNAME);
      await mongoose.disconnect();
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(NEW_PASSWORD, 12);

    admin.passwordHash = passwordHash;
    admin.isActive = true;

    await admin.save();

    console.log("\n✅ PASSWORD RESET SUCCESSFUL");
    console.log("--------------------------------");
    console.log("Name:", admin.name);
    console.log("Username:", admin.username);
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Active:", admin.isActive);
    console.log("New Password:", NEW_PASSWORD);
    console.log("--------------------------------\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

resetAdminPassword();