import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Check authentication while AuthContext
  // is verifying the stored JWT token.
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7fbfc",
          color: "#1f2937",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  // If admin is not authenticated,
  // redirect to the admin login page.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Admin is authenticated,
  // allow access to the protected page.
  return children;
};

export default ProtectedRoute;