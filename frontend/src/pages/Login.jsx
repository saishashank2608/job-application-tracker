// =============================================
// pages/Login.jsx
// Login page — matches the screenshot design.
//
// State:
//   form      - { email, password } controlled inputs
//   error     - error message string from API
//   loading   - boolean to disable button during API call
//
// On submit:
//   1. Calls POST /api/auth/login via loginUser()
//   2. Saves JWT token + user name to localStorage
//   3. Navigates to dashboard on success
// =============================================

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";

// ── Icon helpers ──────────────────────────────────────────────────────────────
function IconMail() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#737686" strokeWidth={1.8}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#737686" strokeWidth={1.8}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();

  // ── useState: controlled form fields ──
  const [form, setForm] = useState({ email: "", password: "" });

  // ── useState: UI state for API feedback ──
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Generic change handler for all inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  }

  // ── Form submission ──────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API call: POST /api/auth/login
      const data = await loginUser({ email: form.email, password: form.password });

      // Save JWT token and user info to localStorage
      localStorage.setItem("token",    data.token);
      localStorage.setItem("userName", data.user?.name || data.user?.email || "User");

      // Navigate to dashboard
      navigate("/");
    } catch (err) {
      // Show the error message from the backend (or a fallback)
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#f2f3ff" }}
    >
      {/* ── Auth Card ── */}
      <div
        className="w-full animate-fade-in-up"
        style={{
          maxWidth: 400,
          background: "#ffffff",
          border: "1px solid #c3c6d7",
          borderRadius: "1rem",
          padding: "40px 36px",
          boxShadow: "0 4px 24px rgba(0,74,198,0.07)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex items-center justify-center rounded-2xl mb-4"
            style={{ width: 52, height: 52, background: "#2563eb" }}
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <h1 className="headline-lg" style={{ color: "#131b2e" }}>
            CareerTrack
          </h1>
          <p className="body-md mt-1" style={{ color: "#737686" }}>
            Welcome back. Log in to your workspace.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <IconMail />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-input form-input-icon"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium" style={{ color: "#131b2e" }}>
                Password
              </label>
              <a href="#" className="text-xs font-medium" style={{ color: "#2563eb" }}>
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <IconLock />
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input form-input-icon"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
            style={{
              padding: "12px",
              fontSize: "15px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
            {!loading && <IconArrow />}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6" style={{ borderTop: "1px solid #e2e7ff" }} />

        {/* Register link */}
        <p className="text-center text-sm" style={{ color: "#434655" }}>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold" style={{ color: "#2563eb" }}>
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
