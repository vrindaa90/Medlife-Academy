import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/authcontext";
import ProtectedRoute from "./components/auth/protectedrouter";

// Public Pages
import Home from "./pages/public/home";
import Batches from "./pages/public/batches";
import Careers from "./pages/public/careers";
import Centers from "./pages/public/centers";
import Contact from "./pages/public/contact";
import Results from "./pages/public/results";
import StudentHub from "./pages/public/StudentHub";
import ThankYou from "./pages/public/ThankYou";
import CareerApply from "./pages/public/careerapply";

// Admin Pages
import AdminLogin from "./pages/admin/adminlogin";
import AdminDashboard from "./pages/admin/admindashboard";
import AdminStudents from "./pages/admin/adminstudents";
import AdminAddStudent from "./pages/admin/adminaddstudent";
import AdminBatches from "./pages/admin/adminbatches";
import AdminAddBatch from "./pages/admin/adminaddbatch";
import AdminCareers from "./pages/admin/admincareers";
import AdminAddCareerApplicant from "./pages/admin/adminaddcareerapplicant";
import AdminCareerDetails from "./pages/admin/admincareerdetails";
import AdminQueries from "./pages/admin/adminqueries";
import AdminQueryDetails from "./pages/admin/adminquerydetails";
import AdminReport from "./pages/admin/adminreport";
import AdminSettings from "./pages/admin/adminsettings";
import AdminBatchDetails from "./pages/admin/adminbatchdetails";
import AdminBatchEdit from "./pages/admin/adminbatchedit";
import AdminStudentDetails from "./pages/admin/adminstudentdetails";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/batches"
            element={<Batches />}
          />

          <Route
            path="/careers"
            element={<Careers />}
          />

          <Route
            path="/centers"
            element={<Centers />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/results"
            element={<Results />}
          />

          <Route
            path="/student-hub"
            element={<StudentHub />}
          />
          <Route
            path="/thank-you"
            element={<ThankYou />}
          />
          <Route 
            path="/career-apply" 
            element={<CareerApply />}
          />


          {/* =========================
              ADMIN LOGIN
              PUBLIC
          ========================= */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />


          {/* =========================
              ADMIN DASHBOARD
              PROTECTED
          ========================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          {/* =========================
              STUDENTS
              PROTECTED
          ========================= */}

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <AdminStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-student"
            element={
              <ProtectedRoute>
                <AdminAddStudent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/student-details"
            element={
              <ProtectedRoute>
                <AdminStudentDetails />
              </ProtectedRoute>
            }
          />


          {/* =========================
              BATCHES
              PROTECTED
          ========================= */}

          <Route
            path="/admin/batches"
            element={
              <ProtectedRoute>
                <AdminBatches />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-batch"
            element={
              <ProtectedRoute>
                <AdminAddBatch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/batch-details"
            element={
              <ProtectedRoute>
                <AdminBatchDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/edit-batch"
            element={
              <ProtectedRoute>
                <AdminBatchEdit />
              </ProtectedRoute>
            }
          />


          {/* =========================
              CAREER APPLICATIONS
              PROTECTED
          ========================= */}

          <Route
            path="/admin/careers"
            element={
              <ProtectedRoute>
                <AdminCareers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/career-details"
            element={
              <ProtectedRoute>
                <AdminCareerDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/careers/add"
            element={
              <ProtectedRoute>
                <AdminAddCareerApplicant />
              </ProtectedRoute>
            }
          />


          {/* =========================
              QUERIES
              PROTECTED
          ========================= */}

          <Route
            path="/admin/queries"
            element={
              <ProtectedRoute>
                <AdminQueries />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/query-details"
            element={
              <ProtectedRoute>
                <AdminQueryDetails />
              </ProtectedRoute>
            }
          />


          {/* =========================
              MANAGEMENT
              PROTECTED
          ========================= */}

          <Route
            path="/admin/report"
            element={
              <ProtectedRoute>
                <AdminReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;