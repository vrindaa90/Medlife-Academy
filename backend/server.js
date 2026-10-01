require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const studentPerformanceRoutes = require("./routes/studentperformance");

// ========================================
// IMPORT MODELS
// ========================================

const Batch = require("./models/batch");
const Query = require("./models/Query");
const Student = require("./models/student");
const CareerApplicant = require("./models/careerapplicant");
const Admin = require("./models/Admin");

// ========================================
// APP CONFIGURATION
// ========================================

const app = express();

const PORT = process.env.PORT || 5000;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/Institute_Management";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "medpath_admin_secret_change_this_later";

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// RESUME UPLOAD CONFIGURATION
// ========================================

const resumeUploadPath = path.join(
  __dirname,
  "uploads",
  "resumes"
);

// Create uploads/resumes folder automatically
if (!fs.existsSync(resumeUploadPath)) {
  fs.mkdirSync(resumeUploadPath, {
    recursive: true,
  });
}

// Multer storage configuration
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeUploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .substring(0, 80);

    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}-${baseName}${extension}`;

    cb(null, uniqueName);
  },
});

// Only PDF, DOC and DOCX files are allowed
const resumeFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const mimeTypeAllowed =
    allowedMimeTypes.includes(file.mimetype);

  const extensionAllowed =
    allowedExtensions.includes(extension);

  if (mimeTypeAllowed && extensionAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC and DOCX resume files are allowed."
      )
    );
  }
};

// Multer upload middleware
const uploadResume = multer({
  storage: resumeStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: resumeFileFilter,
});

// Serve uploaded resumes publicly
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

const authenticateAdmin = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    const admin =
      await Admin.findById(
        decoded.adminId
      ).select("-passwordHash");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          "Admin account not found.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Admin account is inactive.",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token has expired.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Authentication failed.",
    });
  }
};

// ========================================
// STUDENT PERFORMANCE APIs
// ========================================

app.use(
  "/api/students",
  authenticateAdmin,
  studentPerformanceRoutes
);

// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {
  res.send(
    "MedLife Backend is running!"
  );
});

// ========================================
// HEALTH CHECK API
// ========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "MedLife backend is running!",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// ========================================
// ADMIN AUTHENTICATION APIs
// ========================================

// ----------------------------------------
// ADMIN LOGIN
// ----------------------------------------

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const {
        username,
        email,
        password,
      } = req.body;

      const loginIdentifier = (
        username ||
        email ||
        ""
      )
        .trim()
        .toLowerCase();

      if (
        !loginIdentifier ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Username/email and password are required.",
        });
      }

      const admin =
        await Admin.findOne({
          $or: [
            {
              username:
                loginIdentifier,
            },
            {
              email:
                loginIdentifier,
            },
          ],
        });

      if (!admin) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid username/email or password.",
        });
      }

      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          message:
            "Your admin account is inactive.",
        });
      }

      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          admin.passwordHash
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid username/email or password.",
        });
      }

      admin.lastLogin =
        new Date();

      await admin.save();

      const token = jwt.sign(
        {
          adminId:
            admin._id.toString(),
          role: admin.role,
        },
        JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        success: true,
        message:
          "Login successful.",
        token,

        admin: {
          id: admin._id,
          name: admin.name,
          username:
            admin.username,
          email: admin.email,
          role: admin.role,
          isActive:
            admin.isActive,
          lastLogin:
            admin.lastLogin,
        },
      });
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server error during admin login.",
      });
    }
  }
);

// ----------------------------------------
// GET CURRENT ADMIN
// ----------------------------------------

app.get(
  "/api/admin/me",
  authenticateAdmin,
  async (req, res) => {
    try {
      res.status(200).json({
        success: true,

        admin: {
          id: req.admin._id,
          name: req.admin.name,
          username:
            req.admin.username,
          email: req.admin.email,
          role: req.admin.role,
          isActive:
            req.admin.isActive,
          lastLogin:
            req.admin.lastLogin,
        },
      });
    } catch (error) {
      console.error(
        "Error fetching current admin:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch admin information.",
      });
    }
  }
);

// ----------------------------------------
// ADMIN LOGOUT
// ----------------------------------------

app.post(
  "/api/admin/logout",
  authenticateAdmin,
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Logout successful.",
    });
  }
);

// ========================================
// BATCH APIs
// ========================================

// GET all batches

app.get(
  "/api/batches",
  async (req, res) => {
    try {
      const batches =
        await Batch.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: batches.length,
        batches,
      });
    } catch (error) {
      console.error(
        "Error fetching batches:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch batches.",
      });
    }
  }
);

// GET a single batch

app.get(
  "/api/batches/:id",
  async (req, res) => {
    try {
      const batch =
        await Batch.findById(
          req.params.id
        );

      if (!batch) {
        return res.status(404).json({
          success: false,
          message:
            "Batch not found.",
        });
      }

      res.status(200).json({
        success: true,
        batch,
      });
    } catch (error) {
      console.error(
        "Error fetching single batch:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          "Invalid batch ID.",
      });
    }
  }
);

// POST a new batch

app.post(
  "/api/batches",
  authenticateAdmin,
  async (req, res) => {
    try {
      const newBatch =
        new Batch(req.body);

      await newBatch.save();

      res.status(201).json({
        success: true,
        message:
          "Batch created successfully!",
        batch: newBatch,
      });
    } catch (error) {
      console.error(
        "Error saving batch:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "This Batch Code already exists.",
        });
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide all required batch information.",

          errors:
            Object.values(
              error.errors
            ).map(
              (item) =>
                item.message
            ),
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to create batch.",
      });
    }
  }
);

// PUT - update batch

app.put(
  "/api/batches/:batchCode",
  authenticateAdmin,
  async (req, res) => {
    try {
      const originalBatchCode =
        req.params.batchCode;

      const {
        batchName,
        batchCode,
        course,
        batchType,
        centre,
        classroom,
        startDate,
        endDate,
        faculty,
        coordinator,
        schedule,
        capacity,
        currentStudents,
        status,
        notes,
      } = req.body;

      const updatedBatch =
        await Batch.findOneAndUpdate(
          {
            batchCode:
              originalBatchCode,
          },

          {
            batchName,
            batchCode,
            course,
            batchType,
            centre,
            classroom,
            startDate,
            endDate,
            faculty,
            coordinator,
            schedule,
            capacity:
              Number(capacity),
            currentStudents:
              Number(
                currentStudents
              ),
            status,
            notes,
          },

          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedBatch) {
        return res.status(404).json({
          success: false,
          message:
            "Batch not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Batch updated successfully!",
        batch: updatedBatch,
      });
    } catch (error) {
      console.error(
        "Error updating batch:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "This Batch Code already exists.",
        });
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide valid batch information.",

          errors:
            Object.values(
              error.errors
            ).map(
              (item) =>
                item.message
            ),
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to update batch.",
      });
    }
  }
);

// DELETE batch

app.delete(
  "/api/batches/:batchCode",
  authenticateAdmin,
  async (req, res) => {
    try {
      const batchCode =
        req.params.batchCode;

      const deletedBatch =
        await Batch.findOneAndDelete({
          batchCode,
        });

      if (!deletedBatch) {
        return res.status(404).json({
          success: false,
          message:
            "Batch not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Batch deleted successfully!",
        batch: deletedBatch,
      });
    } catch (error) {
      console.error(
        "Error deleting batch:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete batch.",
      });
    }
  }
);

// ========================================
// QUERY APIs
// ========================================

// GET all contact queries

app.get(
  "/api/queries",
  authenticateAdmin,
  async (req, res) => {
    try {
      const queries =
        await Query.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: queries.length,
        queries,
      });
    } catch (error) {
      console.error(
        "Error fetching queries:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch queries.",
      });
    }
  }
);

// GET single query

app.get(
  "/api/queries/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const query =
        await Query.findById(
          req.params.id
        );

      if (!query) {
        return res.status(404).json({
          success: false,
          message:
            "Query not found.",
        });
      }

      res.status(200).json({
        success: true,
        query,
      });
    } catch (error) {
      console.error(
        "Error fetching single query:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          "Invalid query ID.",
      });
    }
  }
);

// POST contact form query

app.post(
  "/api/queries",
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        city,
        message,
      } = req.body;

      const newQuery =
        new Query({
          name,
          email,
          phone,
          city,
          message,
        });

      await newQuery.save();

      console.log(
        "New Query Saved:",
        newQuery
      );

      res.status(201).json({
        success: true,
        message:
          "Query saved successfully!",
        query: newQuery,
      });
    } catch (error) {
      console.error(
        "Error saving query:",
        error
      );

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide all required query information.",

          errors:
            Object.values(
              error.errors
            ).map(
              (item) =>
                item.message
            ),
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to save query.",
      });
    }
  }
);

// PATCH query management

app.patch(
  "/api/queries/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const allowedFields = [
        "status",
        "assignedTo",
        "category",
        "priority",
        "followupDate",
        "followupTime",
      ];

      const updates = {};

      allowedFields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            updates[field] =
              req.body[field];
          }
        }
      );

      if (
        req.body.notes !==
        undefined
      ) {
        if (
          !Array.isArray(
            req.body.notes
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Notes must be provided as an array.",
          });
        }

        updates.notes =
          req.body.notes;
      }

      if (
        Object.keys(updates)
          .length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No valid fields provided to update.",
        });
      }

      const updatedQuery =
        await Query.findByIdAndUpdate(
          req.params.id,
          {
            $set: updates,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedQuery) {
        return res.status(404).json({
          success: false,
          message:
            "Query not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Query updated successfully!",
        query: updatedQuery,
      });
    } catch (error) {
      console.error(
        "Error updating query:",
        error
      );

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide valid query information.",

          errors:
            Object.values(
              error.errors
            ).map(
              (item) =>
                item.message
            ),
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to update query.",
      });
    }
  }
);

// ========================================
// STUDENT APIs
// ========================================

// GET all students

app.get(
  "/api/students",
  authenticateAdmin,
  async (req, res) => {
    try {
      const students =
        await Student.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: students.length,
        students,
      });
    } catch (error) {
      console.error(
        "Error fetching students:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch students.",
        error: error.message,
      });
    }
  }
);

// GET one student

app.get(
  "/api/students/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } =
        req.params;

      let student = null;

      if (
        mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        student =
          await Student.findById(
            id
          );
      }

      if (!student) {
        student =
          await Student.findOne({
            studentId: id,
          });
      }

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found.",
        });
      }

      res.status(200).json({
        success: true,
        student,
      });
    } catch (error) {
      console.error(
        "Error fetching student:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch student.",
      });
    }
  }
);

// POST student

app.post(
  "/api/students",
  authenticateAdmin,
  async (req, res) => {
    try {
      const {
        studentName,
        studentId,
        dob,
        gender,
        studentEmail,
        mobile,
        address,
        parentName,
        relationship,
        parentMobile,
        parentEmail,
        emergencyContact,
        studentClass,
        course,
        batch,
        centre,
        admissionDate,
        enrollmentType,
        status,
        source,
        assignedStaff,
        notes,
      } = req.body;

      const newStudent =
        new Student({
          name: studentName,
          studentId,
          dob,
          gender,
          email: studentEmail,
          phone: mobile,
          address,
          parentName,
          relationship,
          parentMobile,
          parentEmail,
          emergencyContact,
          className:
            studentClass,
          course,
          batch,
          centre,
          admissionDate,
          enrollmentType,
          status,
          source,
          assignedStaff,
          notes,
        });

      await newStudent.save();

      console.log(
        "New Student Saved:",
        newStudent
      );

      res.status(201).json({
        success: true,
        message:
          "Student added successfully!",
        student: newStudent,
      });
    } catch (error) {
      console.error(
        "Error adding student:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "This Student ID already exists.",
        });
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide all required student information.",

          errors:
            Object.values(
              error.errors
            ).map(
              (item) =>
                item.message
            ),
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to add student.",
      });
    }
  }
);

// PUT student

app.put(
  "/api/students/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const allowedFields = [
        "name",
        "dob",
        "gender",
        "email",
        "phone",
        "address",
        "parentName",
        "relationship",
        "parentMobile",
        "parentEmail",
        "emergencyContact",
        "className",
        "course",
        "batch",
        "centre",
        "admissionDate",
        "enrollmentType",
        "status",
        "source",
        "assignedStaff",
        "notes",
      ];

      const updates = {};

      allowedFields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            updates[field] =
              req.body[field];
          }
        }
      );

      if (
        Object.keys(updates)
          .length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No valid fields provided to update.",
        });
      }

      let student = null;

      if (
        mongoose.isValidObjectId(
          id
        )
      ) {
        student =
          await Student.findById(
            id
          );
      }

      if (!student) {
        student =
          await Student.findOne({
            studentId: id,
          });
      }

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found.",
        });
      }

      Object.assign(
        student,
        updates
      );

      await student.save();

      res.status(200).json({
        success: true,
        message:
          "Student updated successfully!",
        student,
      });
    } catch (error) {
      console.error(
        "Error updating student:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "This Student ID already exists.",
        });
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide valid student information.",

          errors:
            Object.values(
              error.errors
            ).map(
              (item) =>
                item.message
            ),
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to update student.",
        error: error.message,
      });
    }
  }
);

// DELETE student

app.delete(
  "/api/students/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } =
        req.params;

      let deletedStudent =
        null;

      if (
        mongoose.isValidObjectId(
          id
        )
      ) {
        deletedStudent =
          await Student.findByIdAndDelete(
            id
          );
      }

      if (!deletedStudent) {
        deletedStudent =
          await Student.findOneAndDelete(
            {
              studentId: id,
            }
          );
      }

      if (!deletedStudent) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found.",
        });
      }

      console.log(
        "Student Deleted:",
        deletedStudent.studentId
      );

      res.status(200).json({
        success: true,
        message:
          "Student deleted successfully!",
        student: deletedStudent,
      });
    } catch (error) {
      console.error(
        "Error deleting student:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete student.",
        error: error.message,
      });
    }
  }
);

// ========================================
// CAREER APPLICANT APIs
// ========================================

// GET all career applicants

app.get(
  "/api/careers",
  authenticateAdmin,
  async (req, res) => {
    try {
      const applicants =
        await CareerApplicant.find().sort(
          {
            createdAt: -1,
          }
        );

      res.status(200).json({
        success: true,
        count: applicants.length,
        applicants,
      });
    } catch (error) {
      console.error(
        "Error fetching career applicants:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch career applications.",
        error: error.message,
      });
    }
  }
);

// GET one career applicant

app.get(
  "/api/careers/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const applicant =
        await CareerApplicant.findById(
          req.params.id
        );

      if (!applicant) {
        return res.status(404).json({
          success: false,
          message:
            "Career applicant not found.",
        });
      }

      res.status(200).json({
        success: true,
        applicant,
      });
    } catch (error) {
      console.error(
        "Error fetching career applicant:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          "Invalid career applicant ID.",
      });
    }
  }
);

// ========================================
// POST NEW CAREER APPLICATION
// ========================================
//
// PUBLIC ROUTE
//
// Accepts:
// multipart/form-data
//
// Field name for resume:
// "resume"
//
// Allowed:
// PDF / DOC / DOCX
//
// Maximum:
// 5 MB
// ========================================

app.post(
  "/api/careers",
  uploadResume.single("resume"),
  async (req, res) => {
    let uploadedFilePath =
      req.file
        ? req.file.path
        : null;

    try {
      const {
        applicantName,
        email,
        phone,
        experience,
        company,
        designation,
        address,
        position,
        department,
        appliedOn,
        source,
        preferredLocation,
      } = req.body;

      // Resume is required for public application
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload your resume.",
        });
      }

      // Build resume URL
      const resumeUrl =
        `${req.protocol}://${req.get(
          "host"
        )}/uploads/resumes/${req.file.filename}`;

      const newApplicant =
        new CareerApplicant({
          applicantName,
          email,
          phone,
          experience,
          company:
            company || "",
          designation:
            designation || "",
          address:
            address || "",
          position,
          department,
          appliedOn:
            appliedOn ||
            new Date(),
          source,
          preferredLocation,
          resume: resumeUrl,

          // Public applicants always begin as New
          status: "New",

          // Interview is controlled by admin
          interviewStatus:
            "Not Scheduled",

          interviewDate: null,
          interviewer: "",
          interviewMode: "",
          adminNotes: "",
        });

      await newApplicant.save();

      uploadedFilePath = null;

      console.log(
        "New Career Applicant Saved:",
        newApplicant.applicantName
      );

      res.status(201).json({
        success: true,
        message:
          "Career application submitted successfully!",
        applicant:
          newApplicant,
      });
    } catch (error) {
      console.error(
        "Error adding career applicant:",
        error
      );

      // Delete uploaded file if MongoDB save failed
      if (
        uploadedFilePath &&
        fs.existsSync(
          uploadedFilePath
        )
      ) {
        try {
          fs.unlinkSync(
            uploadedFilePath
          );
        } catch (deleteError) {
          console.error(
            "Error deleting uploaded resume after failure:",
            deleteError
          );
        }
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide all required career applicant information.",

          errors:
            Object.values(
              error.errors
            ).map(
              (item) =>
                item.message
            ),
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to add career applicant.",
        error: error.message,
      });
    }
  }
);

// ========================================
// PUT - UPDATE CAREER APPLICANT
// ========================================

app.put(
  "/api/careers/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const allowedFields = [
        "applicantName",
        "email",
        "phone",
        "experience",
        "company",
        "designation",
        "address",
        "position",
        "department",
        "appliedOn",
        "source",
        "preferredLocation",
        "resume",
        "status",
        "interviewStatus",
        "interviewDate",
        "interviewer",
        "interviewMode",
        "adminNotes",
      ];

      const updates = {};

      allowedFields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            updates[field] =
              req.body[field];
          }
        }
      );

      if (
        Object.keys(updates)
          .length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No valid fields provided to update.",
        });
      }

      const updatedApplicant =
        await CareerApplicant.findByIdAndUpdate(
          req.params.id,
          {
            $set: updates,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedApplicant) {
        return res.status(404).json({
          success: false,
          message:
            "Career applicant not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Career applicant updated successfully!",
        applicant:
          updatedApplicant,
      });
    } catch (error) {
      console.error(
        "Error updating career applicant:",
        error
      );

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide valid career applicant information.",

          errors:
            Object.values(
              error.errors
            ).map(
              (item) =>
                item.message
            ),
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to update career applicant.",
        error: error.message,
      });
    }
  }
);

// ========================================
// DELETE CAREER APPLICANT
// ========================================

app.delete(
  "/api/careers/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const deletedApplicant =
        await CareerApplicant.findByIdAndDelete(
          req.params.id
        );

      if (!deletedApplicant) {
        return res.status(404).json({
          success: false,
          message:
            "Career applicant not found.",
        });
      }

      // Delete associated resume file
      if (
        deletedApplicant.resume
      ) {
        try {
          const resumeUrl =
            deletedApplicant.resume;

          const uploadsMarker =
            "/uploads/";

          const markerIndex =
            resumeUrl.indexOf(
              uploadsMarker
            );

          if (
            markerIndex !== -1
          ) {
            const relativePath =
              resumeUrl.substring(
                markerIndex +
                  "/uploads/"
                    .length
              );

            const resumeFilePath =
              path.join(
                __dirname,
                "uploads",
                relativePath
              );

            if (
              fs.existsSync(
                resumeFilePath
              )
            ) {
              fs.unlinkSync(
                resumeFilePath
              );
            }
          }
        } catch (fileError) {
          console.error(
            "Error deleting career resume file:",
            fileError
          );
        }
      }

      console.log(
        "Career Applicant Deleted:",
        deletedApplicant.applicantName
      );

      res.status(200).json({
        success: true,
        message:
          "Career applicant deleted successfully!",
        applicant:
          deletedApplicant,
      });
    } catch (error) {
      console.error(
        "Error deleting career applicant:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete career applicant.",
        error: error.message,
      });
    }
  }
);

// ========================================
// MULTER ERROR HANDLER
// ========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Resume file size cannot exceed 5 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Resume upload failed.",
      });
    }

    if (
      error &&
      error.message ===
        "Only PDF, DOC and DOCX resume files are allowed."
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }

    next(error);
  }
);

// ========================================
// GENERAL ERROR HANDLER
// ========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Unhandled server error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      success: false,
      message:
        "Internal server error.",
      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
);

// ========================================
// START SERVER
// ========================================

app.listen(
  PORT,
  () => {
    console.log(
      `Server running at http://localhost:${PORT}`
    );

    console.log(
      `Resume uploads available at http://localhost:${PORT}/uploads/resumes`
    );
  }
);