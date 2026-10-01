import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import "./adminlogin.css";

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await login(username.trim(), password);

      // Remember only the username/email.
      // Never store the password in localStorage.
      if (rememberMe) {
        localStorage.setItem(
          "medpath_remembered_username",
          username.trim()
        );
      } else {
        localStorage.removeItem(
          "medpath_remembered_username"
        );
      }

      // If the user was redirected to login from another
      // protected page, send them back there.
      const redirectPath =
        location.state?.from?.pathname ||
        "/admin/dashboard";

      navigate(redirectPath, { replace: true });
    } catch (error) {
      setError(
        error?.message ||
          "Invalid username or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.alert(
      "Please contact the MedPath Academy administrator to reset your password."
    );
  };

  return (
    <div className="admin-login-page">

      {/* Background decoration */}
      <div className="admin-login-glow glow-one"></div>
      <div className="admin-login-glow glow-two"></div>

      {/* =========================
          LOGIN CARD
      ========================== */}
      <main className="admin-login-card">

        {/* =========================
            BRAND
        ========================== */}
        <div className="admin-login-brand">

          <div className="admin-login-logo">
            M
          </div>

          <div className="admin-login-brand-text">
            <div className="admin-login-brand-name">
              MedPath Academy
            </div>

            <div className="admin-login-brand-label">
              ADMIN PANEL
            </div>
          </div>

        </div>


        {/* =========================
            HEADER
        ========================== */}
        <div className="admin-login-header">

          <div className="admin-login-badge">
            SECURE ADMIN ACCESS
          </div>

          <h1>
            Admin Sign In
          </h1>

          <p>
            Enter your credentials to access the
            MedPath administration panel.
          </p>

        </div>


        {/* =========================
            ERROR
        ========================== */}
        {error && (
          <div
            className="admin-login-error"
            role="alert"
          >
            <span className="admin-login-error-icon">
              !
            </span>

            <span>
              {error}
            </span>
          </div>
        )}


        {/* =========================
            LOGIN FORM
        ========================== */}
        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* Username */}
          <div className="admin-login-field">

            <label
              htmlFor="username"
              className="admin-login-label"
            >
              Username / Email
            </label>

            <div className="admin-login-input-wrap">

              <span
                className="admin-login-input-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3.5"
                    y="5"
                    width="17"
                    height="14"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="M5 7L12 12.5L19 7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username or email"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
                disabled={isLoading}
                className="admin-login-input"
              />

            </div>

          </div>


          {/* Password */}
          <div className="admin-login-field">

            <label
              htmlFor="password"
              className="admin-login-label"
            >
              Password
            </label>

            <div className="admin-login-input-wrap">

              <span
                className="admin-login-input-icon"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="4.5"
                    y="10"
                    width="15"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                disabled={isLoading}
                className="admin-login-input admin-login-password"
              />

              <button
                type="button"
                className="admin-login-password-toggle"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10.6 10.6A2 2 0 0 0 13.4 13.4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <path
                      d="M9.7 5.2C10.43 5.07 11.2 5 12 5C18 5 21.5 12 21.5 12C20.9 13.35 19.75 14.85 18.2 16.15"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <path
                      d="M6.15 6.15C4.35 7.5 3.15 9.55 2.5 12C3.5 15 6.75 19 12 19C13.05 19 14.05 18.8 14.95 18.45"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M2.5 12C3.5 9 6.75 5 12 5C17.25 5 20.5 9 21.5 12C20.5 15 17.25 19 12 19C6.75 19 3.5 15 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="2.7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                )}
              </button>

            </div>

          </div>


          {/* =========================
              OPTIONS
          ========================== */}
          <div className="admin-login-options">

            <label className="admin-login-remember">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                disabled={isLoading}
              />

              <span className="admin-login-checkbox"></span>

              <span>
                Remember me
              </span>

            </label>


            <button
              type="button"
              className="admin-login-forgot"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              Forgot password?
            </button>

          </div>


          {/* =========================
              LOGIN BUTTON
          ========================== */}
          <button
            type="submit"
            className={`admin-login-button ${
              isLoading ? "is-loading" : ""
            }`}
            disabled={isLoading}
          >

            {isLoading ? (
              <>
                <span className="admin-login-spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                Sign In to Admin Panel
                <span className="admin-login-arrow">
                  →
                </span>
              </>
            )}

          </button>

        </form>


        {/* =========================
            SECURITY NOTE
        ========================== */}
        <div className="admin-login-security">

          <div className="admin-login-security-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <strong>
              Secure Administration
            </strong>

            <span>
              Your admin access is protected.
            </span>
          </div>

        </div>


        {/* =========================
            FOOTER
        ========================== */}
        <div className="admin-login-footer">
          © 2026 MedPath Academy · Administration Portal
        </div>

      </main>

    </div>
  );
}

export default AdminLogin;