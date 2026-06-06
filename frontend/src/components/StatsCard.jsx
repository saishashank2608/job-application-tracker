// =============================================
// components/StatsCard.jsx
// Displays a single statistic on the dashboard.
// Props:
//   label      - e.g. "Total Applications"
//   value      - e.g. 12
//   accent     - border-top color (CSS color string)
//   icon       - JSX icon element
//   sublabel   - optional small text below (e.g. "2 Rejected")
//   sublabelColor - optional color for sublabel
// =============================================

import React from "react";

export default function StatsCard({
  label,
  value,
  accent,
  icon,
  sublabel,
  sublabelColor = "#737686",
}) {
  return (
    <div
      className="card animate-fade-in-up"
      style={{
        padding: "20px 24px",
        borderTop: `3px solid ${accent || "#e2e7ff"}`,
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Icon + label row */}
      <div className="flex items-center gap-2 mb-3" style={{ color: "#737686" }}>
        {icon}
        <span className="label-md uppercase tracking-wider">{label}</span>
      </div>

      {/* Big number */}
      <p
        className="headline-xl"
        style={{ color: "#131b2e", fontWeight: 700 }}
      >
        {value ?? "—"}
      </p>

      {/* Optional sublabel (e.g. "2 Rejected") */}
      {sublabel && (
        <p className="body-sm mt-1" style={{ color: sublabelColor }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
