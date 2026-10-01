const API_URL = "http://localhost:5000/api";

export const loginAdmin = async (username, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed. Please try again."
    );
  }

  if (data.token) {
    localStorage.setItem(
      "medpath_admin_token",
      data.token
    );
  }

  if (data.admin) {
    localStorage.setItem(
      "medpath_admin",
      JSON.stringify(data.admin)
    );
  }

  return data;
};


export const getCurrentAdmin = async () => {
  try {
    const token = localStorage.getItem(
      "medpath_admin_token"
    );

    if (!token) {
      return null;
    }

    const response = await fetch(
      `${API_URL}/admin/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      await logoutAdmin();
      return null;
    }

    if (data.admin) {
      localStorage.setItem(
        "medpath_admin",
        JSON.stringify(data.admin)
      );
    }

    return data.admin;
  } catch (error) {
    console.error(
      "Get current admin error:",
      error
    );

    return null;
  }
};


export const logoutAdmin = async () => {
  const token = localStorage.getItem(
    "medpath_admin_token"
  );

  if (token) {
    try {
      await fetch(
        `${API_URL}/admin/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.warn(
        "Backend logout request failed:",
        error
      );
    }
  }

  localStorage.removeItem(
    "medpath_admin_token"
  );

  localStorage.removeItem(
    "medpath_admin"
  );
};


export const getStoredAdmin = () => {
  try {
    const admin = localStorage.getItem(
      "medpath_admin"
    );

    if (!admin) {
      return null;
    }

    return JSON.parse(admin);
  } catch (error) {
    console.error(
      "Error reading stored admin:",
      error
    );

    return null;
  }
};


export const isAdminLoggedIn = () => {
  const token = localStorage.getItem(
    "medpath_admin_token"
  );

  const admin = localStorage.getItem(
    "medpath_admin"
  );

  return Boolean(token && admin);
};


export const getAuthToken = () => {
  return localStorage.getItem(
    "medpath_admin_token"
  );
};