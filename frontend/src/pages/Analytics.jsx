// =============================================
// pages/Analytics.jsx
// Analytics page — shows a visual breakdown of
// job applications by status using simple bars.
//
// State:
//   stats   - stats object from GET /api/jobs/stats
//   loading - boolean during fetch
//   error   - error string
//
// useEffect: fetches stats on mount
// =============================================

import React, { useState, useEffect } from "react";
import Sidebar   from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { getJobStats, getJobs } from "../api/api";

// ── Status config: label, color, key ─────────────────────────────────────────
const STATUS_BARS = [
  { key: "applied",           label: "Applied",              color: "#2563eb", bg: "#dbeafe" },
  { key: "interviewScheduled",label: "Interview Scheduled",  color: "#4338ca", bg: "#e0e7ff" },
  { key: "selected",          label: "Selected",             color: "#166534", bg: "#dcfce7" },
  { key: "rejected",          label: "Rejected",             color: "#991b1b", bg: "#fee2e2" },
  { key: "offered",           label: "Offered",              color: "#065f46", bg: "#d1fae5" },
];

// ── Analytics Page ────────────────────────────────────────────────────────────
export default function Analytics() {
  // ── useState: data ──
  const [stats,    setStats]    = useState(null);
  const [jobs,     setJobs]     = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  // ── useEffect: fetch data on mount ──
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsData, jobsData] = await Promise.all([getJobStats(), getJobs()]);
        setStats(statsData);
        setJobs(jobsData);
      } catch (err) {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate success rate: consider both `selected` and `offered` as successful outcomes
  const successRate =
    stats && stats.total > 0
      ? Math.round((((stats.selected || 0) + (stats.offered || 0)) / stats.total) * 100)
      : 0;

  // Max value for bar scaling
  const maxValue = stats
    ? Math.max(...STATUS_BARS.map((s) => stats[s.key] || 0), 1)
    : 1;

  return (
    <div className="flex min-h-screen flex-col md:flex-row" style={{ background: "#faf8ff" }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onAddClick={() => {}} />

      <div className="flex-1 md:ml-[232px]">
        <TopNavbar searchQuery="" onSearchChange={() => {}} onMenuClick={() => setIsSidebarOpen(true)} />

        <main style={{ paddingTop: 64 }}>
          <div style={{ padding: "32px 32px 40px" }}>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="headline-xl" style={{ color: "#131b2e" }}>
                Analytics
              </h1>
              <p className="body-md mt-1" style={{ color: "#737686" }}>
                Visualize your job search performance.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-6 px-4 py-3 rounded-lg text-sm"
                style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" }}
              >
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center" style={{ height: 300 }}>
                <div
                  style={{
                    width: 40, height: 40,
                    border: "3px solid #e2e7ff",
                    borderTop: "3px solid #2563eb",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {!loading && stats && (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">

                {/* ── Status Breakdown Bar Chart ── */}
                <div className="card" style={{ padding: "24px", gridColumn: "1 / -1" }}>
                  <h2 className="headline-md mb-6" style={{ color: "#131b2e" }}>
                    Applications by Status
                  </h2>

                  <div className="space-y-4">
                    {STATUS_BARS.map(({ key, label, color, bg }) => {
                      const count = stats[key] || 0;
                      const pct   = maxValue > 0 ? (count / maxValue) * 100 : 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium" style={{ color: "#131b2e" }}>
                              {label}
                            </span>
                            <span className="text-sm font-semibold" style={{ color }}>
                              {count}
                            </span>
                          </div>
                          {/* Bar track */}
                          <div
                            style={{
                              height: 10,
                              borderRadius: 999,
                              background: "#f2f3ff",
                              overflow: "hidden",
                            }}
                          >
                            {/* Bar fill */}
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                background: color,
                                borderRadius: 999,
                                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Summary Card ── */}
                <div className="card" style={{ padding: "24px" }}>
                  <h2 className="headline-md mb-4" style={{ color: "#131b2e" }}>
                    Summary
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: "Total Applications",   value: stats.total || 0,              color: "#131b2e" },
                      { label: "Active (Applied)",      value: stats.applied || 0,            color: "#2563eb" },
                      { label: "In Interview Stage",    value: stats.interviewScheduled || 0, color: "#4338ca" },
                      { label: "Offers / Selected",     value: stats.selected || 0,           color: "#166534" },
                      { label: "Rejected",              value: stats.rejected || 0,           color: "#991b1b" },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2"
                        style={{ borderBottom: "1px solid #f2f3ff" }}
                      >
                        <span className="body-md" style={{ color: "#434655" }}>{label}</span>
                        <span className="text-sm font-semibold" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Success Rate Card ── */}
                <div className="card flex flex-col items-center justify-center" style={{ padding: "24px" }}>
                  <h2 className="headline-md mb-6" style={{ color: "#131b2e" }}>
                    Success Rate
                  </h2>
                  {/* Circular progress */}
                  <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
                    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                      {/* Track */}
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e7ff" strokeWidth="10" />
                      {/* Progress */}
                      <circle
                        cx="60" cy="60" r="50"
                        fill="none"
                        stroke="#166534"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - successRate / 100)}`}
                        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
                      />
                    </svg>
                    {/* Center text */}
                    <div className="absolute text-center">
                      <p className="headline-lg" style={{ color: "#131b2e", lineHeight: 1 }}>
                        {successRate}%
                      </p>
                      <p className="label-md" style={{ color: "#737686", marginTop: 2 }}>
                        selected
                      </p>
                    </div>
                  </div>
                      <p className="body-sm mt-4 text-center" style={{ color: "#737686", maxWidth: 180 }}>
                    {(stats.selected || 0) + (stats.offered || 0)} selected/offered out of {stats.total || 0} total applications
                  </p>
                </div>

                {/* ── Recent Jobs List ── */}
                {jobs.length > 0 && (
                  <div className="card" style={{ padding: "24px", gridColumn: "1 / -1" }}>
                    <h2 className="headline-md mb-4" style={{ color: "#131b2e" }}>
                      All Applications
                    </h2>
                    <div className="space-y-2">
                      {jobs.slice(0, 8).map((job) => {
                        const normStatus = (job.status || "").toString().toLowerCase().trim();
                        const sc =
                          STATUS_BARS.find((s) => s.label.toLowerCase() === normStatus) ||
                          STATUS_BARS.find((s) => s.key.toLowerCase() === normStatus.replace(/\s+/g, "")) ||
                          { color: "#737686", bg: "#f2f3ff", label: job.status };
                        return (
                          <div
                            key={job._id}
                            className="flex items-center justify-between py-2"
                            style={{ borderBottom: "1px solid #f2f3ff" }}
                          >
                            <div>
                              <span className="text-sm font-semibold" style={{ color: "#131b2e" }}>
                                {job.company}
                              </span>
                              <span className="text-sm ml-2" style={{ color: "#737686" }}>
                                · {job.role}
                              </span>
                            </div>
                            <span
                              className="badge text-xs"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {job.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!loading && !stats && !error && (
              <div className="flex items-center justify-center" style={{ height: 300 }}>
                <p style={{ color: "#737686" }}>No data available yet. Add some applications first.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
