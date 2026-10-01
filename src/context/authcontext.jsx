import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  getStoredAdmin,
} from "../services/authservice";

// ========================================
// CREATE AUTH CONTEXT
// ========================================

const AuthContext = createContext(null);

// ========================================
// AUTH PROVIDER
// ========================================

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    return getStoredAdmin();
  });

  const [loading, setLoading] = useState(true);

  // ========================================
  // VERIFY EXISTING LOGIN ON APP START
  // ========================================

  useEffect(() => {
    const verifyAdmin = async () => {
      const storedAdmin = getStoredAdmin();

      if (!storedAdmin) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      const currentAdmin = await getCurrentAdmin();

      if (currentAdmin) {
        setAdmin(currentAdmin);
      } else {
        setAdmin(null);
      }

      setLoading(false);
    };

    verifyAdmin();
  }, []);

  // ========================================
  // LOGIN
  // ========================================

  const login = async (username, password) => {
    const data = await loginAdmin(
      username,
      password
    );

    if (data?.admin) {
      setAdmin(data.admin);
    }

    return data;
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = async () => {
    await logoutAdmin();
    setAdmin(null);
  };

  // ========================================
  // AUTH STATUS
  // ========================================

  const isAuthenticated = Boolean(admin);

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value = {
    admin,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ========================================
// CUSTOM AUTH HOOK
// ========================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
};

// ========================================
// DEFAULT EXPORT
// ========================================

export default AuthContext;