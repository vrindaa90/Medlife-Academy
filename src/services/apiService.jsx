const API_URL = "http://localhost:5000/api";

/*
  Authenticated API request helper
  Automatically attaches the logged-in admin JWT.
*/

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("medpath_admin_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("medpath_admin_token");
      localStorage.removeItem("medpath_admin");

      window.location.href = "/admin/login";

      throw new Error("Your session has expired. Please login again.");
    }

    throw new Error(
      data.message || "Something went wrong with the request."
    );
  }

  return data;
};

export default apiRequest;