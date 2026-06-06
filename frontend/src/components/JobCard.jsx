// =============================================
// components/JobCard.jsx
// A single row in the "Recent Activity" table.
// Displays: company, role, status badge, date, edit/delete actions.
//
// Props:
//   job       - job object from API
//   onEdit    - callback(job) to open edit modal
//   onDelete  - callback(jobId) to delete
// =============================================

import React from "react";

// ── Status badge config ───────────────────────────────────────────────────────
// Maps API status value → display label + CSS class
const STATUS_CONFIG = {
  Applied:             { label: "Applied",              className: "badge-applied",   dot: "#2563eb" },
  "Interview Scheduled":{ label: "Interview Scheduled", className: "badge-interview", dot: "#4338ca" },
  Selected:            { label: "Selected",             className: "badge-selected",  dot: "#166534" },
  Rejected:            { label: "Rejected",             className: "badge-rejected",  dot: "#991b1b" },
  Offered:             { label: "Offered",              className: "badge-offered",   dot: "#065f46" },
};

// ── Format date nicely ────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day:   "2-digit",
    year:  "numeric",
  });
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconEdit() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

// ── JobCard Component ─────────────────────────────────────────────────────────
export default function JobCard({ job, onEdit, onDelete }) {
  const statusInfo = STATUS_CONFIG[job.status] || STATUS_CONFIG["Applied"];

  return (
    <tr
      className="transition-colors"
      style={{ borderBottom: "1px solid #e2e7ff" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f3ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Company & Role */}
      <td className="py-4 px-6">
        <p className="text-sm font-semibold" style={{ color: "#131b2e" }}>
          {job.company}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#737686" }}>
          {job.role}
        </p>
      </td>

      {/* Status Badge */}
      <td className="py-4 px-6">
        <span className={`badge ${statusInfo.className}`}>
          {/* Colored dot */}
          <span
            className="rounded-full flex-shrink-0"
            style={{ width: 6, height: 6, background: statusInfo.dot }}
          />
          {statusInfo.label}
        </span>
      </td>

      {/* Date Applied */}
      <td className="py-4 px-6">
        <span className="text-sm" style={{ color: "#434655" }}>
          {formatDate(job.date || job.applicationDate || job.createdAt)}
        </span>
      </td>

      {/* Actions: Edit + Delete */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-2 justify-end">
          {/* Edit button */}
          <button
            onClick={() => onEdit(job)}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 32, height: 32, color: "#434655" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#eaedff";
              e.currentTarget.style.color = "#004ac6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#434655";
            }}
            title="Edit application"
          >
            <IconEdit />
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(job._id)}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 32, height: 32, color: "#434655" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fee2e2";
              e.currentTarget.style.color = "#991b1b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#434655";
            }}
            title="Delete application"
          >
            <IconTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}
