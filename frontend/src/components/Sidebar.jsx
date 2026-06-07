// =============================================
// components/Sidebar.jsx
// Fixed left sidebar with navigation links.
// Highlights the active route using useLocation.
// Also has the "+ Add Application" button at bottom.
// =============================================

import React from "react";
import { useLocation, Link } from "react-router-dom";

// ── Icon components (inline SVGs, no extra library) ───────────────────────────

function IconDashboard() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4"  />
      <line x1="6"  y1="20" x2="6"  y2="14" />
      <line x1="2"  y1="20" x2="22" y2="20" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5"  y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ── Logo mark SVG ─────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{ width: 36, height: 36, background: "#2563eb" }}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    </div>
  );
}

// ── Nav items config ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",    path: "/",          Icon: IconDashboard },
  { label: "Applications", path: "/applications", Icon: IconBriefcase },
  { label: "Analytics",   path: "/analytics",  Icon: IconChart },
];

// ── Sidebar Component ─────────────────────────────────────────────────────────
export default function Sidebar({ onAddClick, isOpen = true, onClose }) {
  // useLocation lets us know which route is currently active
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-30 md:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 bg-white border-r border-[#e2e7ff] w-full md:relative md:w-[232px] ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col h-full md:h-screen`}
      >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-5">
        <LogoMark />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#131b2e", letterSpacing: "-0.01em" }}>
            CareerTrack
          </p>
          <p className="text-xs" style={{ color: "#737686" }}>
            Job Application Tracker
          </p>
        </div>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 px-3 pt-2 space-y-0.5">
        {NAV_ITEMS.map(({ label, path, Icon }) => {
          // Check if this nav item matches the current path
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section: Settings + Add Button ── */}
      <div className="px-3 pb-5 space-y-1">
        <Link to="/settings" className="nav-link">
          <IconSettings />
          Settings
        </Link>

        <div className="pt-2">
          <hr style={{ borderColor: "#e2e7ff", marginBottom: "12px" }} />
          {/* 
            onAddClick is passed down from Dashboard.jsx.
            Clicking this opens the Add Application modal.
          */}
          <button
            onClick={onAddClick}
            className="btn-primary w-full justify-center"
            style={{ padding: "10px 16px" }}
          >
            <IconPlus />
            Add Application
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
