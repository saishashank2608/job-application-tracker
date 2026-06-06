// =============================================
// pages/Register.jsx
// Registration page — matches the screenshot design (Kinetic Ledger style).
//
// State:
//   form    - { name, email, password, confirmPassword }
//   error   - validation or API error string
//   loading - boolean during API call
//
// On submit:
//   1. Validates passwords match
//   2. Calls POST /api/auth/register
//   3. Saves token + redirects to dashboard
// =============================================

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

// ── Icon helpers ──────────────────────────────────────────────────────────────
function IconUser() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#737686" strokeWidth={1.8}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

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

function IconCheck() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#737686" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
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

// ── Register Page ─────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  // ── useState: form fields ──
  const [form, setForm] = useState({
    name:            "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });

  // ── useState: UI state ──
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  // ── Form submission ──────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Client-side validation: passwords must match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // API call: POST /api/auth/register
      const data = await registerUser({
        name:     form.name,
        email:    form.email,
        password: form.password,
      });

      // Save token on successful registration
      localStorage.setItem("token",    data.token);
      localStorage.setItem("userName", data.user?.name || form.name);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "#f2f3ff" }}
    >
      {/* ── Logo above card ── */}
      <div className="flex flex-col items-center mb-6">
        <div
          className="flex items-center justify-center rounded-2xl mb-3"
          style={{ width: 52, height: 52, background: "transparent", border: "1.5px solid #c3c6d7" }}
        >
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.8}>
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <h1 className="headline-lg" style={{ color: "#004ac6" }}>
          Kinetic Ledger
        </h1>
      </div>

      {/* ── Auth Card ── */}
      <div
        className="w-full animate-fade-in-up"
        style={{
          maxWidth: 400,
          background: "#ffffff",
          border: "1px solid #c3c6d7",
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,74,198,0.07)",
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: "#2563eb" }} />

        <div style={{ padding: "32px 32px 36px" }}>
          <h2 className="headline-md text-center mb-1" style={{ color: "#131b2e" }}>
            Create your account
          </h2>
          <p className="body-sm text-center mb-6" style={{ color: "#737686" }}>
            Join Kinetic Ledger to start tracking.
          </p>

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
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><IconUser /></span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="form-input form-input-icon"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><IconMail /></span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="form-input form-input-icon"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><IconLock /></span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input form-input-icon"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><IconCheck /></span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input form-input-icon"
                  required
                  autoComplete="new-password"
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
              {loading ? "Creating account…" : "Register"}
              {!loading && <IconArrow />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5" style={{ borderTop: "1px solid #e2e7ff" }} />

          {/* Login link */}
          <p className="text-center text-sm" style={{ color: "#434655" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold" style={{ color: "#2563eb" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs" style={{ color: "#737686" }}>
        © 2024 Kinetic Ledger. All rights reserved.
      </p>
    </div>
  );
}
