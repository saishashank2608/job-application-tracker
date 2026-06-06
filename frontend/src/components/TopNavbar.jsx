// =============================================
// components/TopNavbar.jsx
// Top navigation bar with:
//  - Search input (filters jobs client-side)
//  - Bell icon for notifications
//  - User avatar + logout button
// =============================================

import React from "react";
import { useNavigate } from "react-router-dom";

function IconSearch() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#737686" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ── TopNavbar Component ───────────────────────────────────────────────────────
export default function TopNavbar({ searchQuery, onSearchChange }) {
  const navigate = useNavigate();

  // Get user's initials from localStorage (set during login)
  const userName  = localStorage.getItem("userName") || "User";
  const initials  = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Logout: clear token and redirect to login page
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  }

  return (
    <header
      className="fixed top-0 right-0 flex items-center gap-4 px-6"
      style={{
        left: 232,              // same as sidebar width
        height: 64,
        background: "#ffffff",
        borderBottom: "1px solid #e2e7ff",
        zIndex: 10,
      }}
    >
      {/* ── Search bar ── */}
      <div className="relative flex-1 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <IconSearch />
        </span>
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input form-input-icon"
          style={{ height: 38 }}
        />
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Bell icon ── */}
      <button
        className="relative flex items-center justify-center rounded-full transition-colors"
        style={{ width: 38, height: 38, color: "#434655" }}
        aria-label="Notifications"
      >
        <IconBell />
        {/* Red dot badge */}
        <span
          className="absolute top-1.5 right-1.5 rounded-full"
          style={{ width: 8, height: 8, background: "#ba1a1a" }}
        />
      </button>

      {/* ── Divider ── */}
      <div style={{ width: 1, height: 28, background: "#e2e7ff" }} />

      {/* ── User avatar + logout ── */}
      <div className="flex items-center gap-3">
        {/* Avatar circle with initials */}
        <div
          className="flex items-center justify-center rounded-full text-xs font-semibold"
          style={{
            width: 36,
            height: 36,
            background: "#2563eb",
            color: "#ffffff",
          }}
        >
          {initials}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="text-sm font-medium transition-colors"
          style={{ color: "#434655" }}
          onMouseEnter={(e) => (e.target.style.color = "#131b2e")}
          onMouseLeave={(e) => (e.target.style.color = "#434655")}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
