// =============================================
// pages/Dashboard.jsx
// Main dashboard page. This is the heart of the app.
//
// State:
//   jobs        - array of all job applications from API
//   stats       - object with counts per status
//   loading     - boolean while fetching jobs
//   error       - error message string
//   searchQuery - string to filter jobs in the table
//   showModal   - boolean to show Add/Edit modal
//   editingJob  - null (Add mode) or job object (Edit mode)
//   saving      - boolean while POST/PUT API call is running
//
// useEffect:
//   Runs once on mount → fetches jobs and stats from API
// =============================================

import React, { useState, useEffect } from "react";

import Sidebar    from "../components/Sidebar";
import TopNavbar  from "../components/TopNavbar";
import StatsCard  from "../components/StatsCard";
import JobCard    from "../components/JobCard";
import JobModal   from "../components/JobModal";
import { getJobs, getJobStats, createJob, updateJob, deleteJob } from "../api/api";

// ── Stat card icon helpers ────────────────────────────────────────────────────
function IconFolder() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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

// ── Empty state component ─────────────────────────────────────────────────────
function EmptyState({ onAddClick }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
      <div
        className="flex flex-col items-center text-center card animate-fade-in-up"
        style={{ padding: "60px 48px", maxWidth: 460 }}
      >
        {/* Illustration icon */}
        <div
          className="flex items-center justify-center rounded-2xl mb-5"
          style={{ width: 72, height: 72, background: "#eaedff" }}
        >
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.6}>
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <path d="M9 7h6M9 11h6M9 15h4" />
            <circle cx="18" cy="18" r="4" fill="#2563eb" stroke="none" />
            <path d="M18 16v4M16 18h4" stroke="white" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="headline-md mb-2" style={{ color: "#131b2e" }}>
          No job applications added yet.
        </h3>
        <p className="body-md mb-6" style={{ color: "#737686", maxWidth: 300 }}>
          Start your journey by adding your first job application. Keep track of your progress in one place.
        </p>
        <button onClick={onAddClick} className="btn-primary" style={{ padding: "10px 24px" }}>
          <IconPlus />
          Add Application
        </button>
        <p className="body-sm mt-4" style={{ color: "#737686" }}>
          Need help?{" "}
          <a href="#" style={{ color: "#2563eb", fontWeight: 500 }}>
            Read the getting started guide.
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function Dashboard() {
  // ── useState: data ──
  const [jobs,  setJobs]  = useState([]);
  const [stats, setStats] = useState(null);

  // ── useState: UI state ──
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal,   setShowModal]   = useState(false);
  const [editingJob,  setEditingJob]  = useState(null); // null = Add mode
  const [saving,      setSaving]      = useState(false);

  // ── useEffect: fetch jobs and stats on mount ──
  // This runs once when the Dashboard component is first rendered.
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      // Fetch jobs and stats in parallel for speed
      const [jobsData, statsData] = await Promise.all([getJobs(), getJobStats()]);
      setJobs(jobsData);
      setStats(statsData);
    } catch (err) {
      setError("Failed to load applications. Please refresh the page.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ── Add application ────────────────────────────────────────────────────────
  async function handleAdd(formData) {
    setSaving(true);
    try {
      // Map frontend form fields to backend shape
      const payload = {
        company: formData.company,
        role: formData.role,
        status: formData.status,
        applicationDate: formData.date,
        notes: formData.notes,
      };

      // API call: POST /api/jobs -> returns created application object
      const newJob = await createJob(payload);
      // Optimistically update local state (no need to re-fetch)
      setJobs((prev) => [newJob, ...prev]);
      // Refresh stats
      const statsData = await getJobStats();
      setStats(statsData);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add application.");
    } finally {
      setSaving(false);
    }
  }

  // ── Update application ─────────────────────────────────────────────────────
  async function handleUpdate(formData) {
    setSaving(true);
    try {
      // Map frontend form fields to backend shape
      const payload = {
        company: formData.company,
        role: formData.role,
        status: formData.status,
        applicationDate: formData.date,
        notes: formData.notes,
      };

      // API call: PUT /api/jobs/:id -> returns updated job object
      const updated = await updateJob(editingJob._id, payload);
      // Replace updated job in local array
      setJobs((prev) => prev.map((j) => (j._id === updated._id ? updated : j)));
      // Refresh stats
      const statsData = await getJobStats();
      setStats(statsData);
      setShowModal(false);
      setEditingJob(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update application.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete application ─────────────────────────────────────────────────────
  async function handleDelete(jobId) {
    if (!window.confirm("Delete this application? This cannot be undone.")) return;
    try {
      // API call: DELETE /api/jobs/:id
      await deleteJob(jobId);
      // Remove from local state
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      // Refresh stats
      const statsData = await getJobStats();
      setStats(statsData);
    } catch (err) {
      alert("Failed to delete application.");
    }
  }

  // ── Open edit modal ────────────────────────────────────────────────────────
  function handleEditOpen(job) {
    setEditingJob(job);
    setShowModal(true);
  }

  // ── Open add modal ─────────────────────────────────────────────────────────
  function handleAddOpen() {
    setEditingJob(null);
    setShowModal(true);
  }

  // ── Close modal ────────────────────────────────────────────────────────────
  function handleModalClose() {
    setShowModal(false);
    setEditingJob(null);
  }

  // ── Modal submit dispatcher ────────────────────────────────────────────────
  function handleModalSubmit(formData) {
    if (editingJob) {
      handleUpdate(formData);
    } else {
      handleAdd(formData);
    }
  }

  // ── Filter jobs by search query ────────────────────────────────────────────
  // Client-side filter: matches company name or role
  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    return (
      job.company?.toLowerCase().includes(q) ||
      job.role?.toLowerCase().includes(q)
    );
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen" style={{ background: "#faf8ff" }}>
      {/* Sidebar */}
      <Sidebar onAddClick={handleAddOpen} />

      {/* Main content — offset by sidebar width */}
      <div style={{ marginLeft: 232, flex: 1 }}>
        {/* Top Navbar */}
        <TopNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Page content — offset by navbar height */}
        <main style={{ paddingTop: 64 }}>
          <div style={{ padding: "32px 32px 40px" }}>

            {/* ── Page Header ── */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="headline-xl" style={{ color: "#131b2e" }}>
                  Dashboard Overview
                </h1>
                <p className="body-md mt-1" style={{ color: "#737686" }}>
                  Track your recent application momentum.
                </p>
              </div>
              <button
                onClick={handleAddOpen}
                className="btn-primary"
                style={{ padding: "10px 20px", flexShrink: 0 }}
              >
                <IconPlus />
                Add Application
              </button>
            </div>

            {/* ── Stats Cards ── */}
            {!loading && stats && (
              <div className="flex flex-wrap gap-4 mb-8">
                <StatsCard
                  label="Total Applications"
                  value={stats.total}
                  accent="#737686"
                  icon={<IconFolder />}
                />
                <StatsCard
                  label="Applied"
                  value={stats.applied}
                  accent="#2563eb"
                  icon={<IconSend />}
                />
                <StatsCard
                  label="Interview Scheduled"
                  value={stats.interviewScheduled}
                  accent="#4338ca"
                  icon={<IconCalendar />}
                />
                <StatsCard
                  label="Selected"
                  value={stats.selected}
                  accent="#166534"
                  icon={<IconCheck />}
                />
                <StatsCard
                  label="Rejected"
                  value={stats.rejected}
                  accent="#991b1b"
                  icon={<IconCheck />}
                />
              </div>
            )}

            {/* ── Loading skeleton ── */}
            {loading && (
              <div className="flex gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 card"
                    style={{ height: 100, background: "#f2f3ff", animation: "pulse 1.5s infinite" }}
                  />
                ))}
              </div>
            )}

            {/* ── Error state ── */}
            {error && (
              <div
                className="mb-6 px-4 py-3 rounded-lg text-sm"
                style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" }}
              >
                {error}
              </div>
            )}

            {/* ── Empty state ── */}
            {!loading && jobs.length === 0 && !error && (
              <EmptyState onAddClick={handleAddOpen} />
            )}

            {/* ── Applications Table ── */}
            {!loading && jobs.length > 0 && (
              <div className="card">
                {/* Table header */}
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: "1px solid #e2e7ff" }}
                >
                  <h2 className="headline-md" style={{ color: "#131b2e" }}>
                    Recent Activity
                  </h2>
                  {searchQuery && (
                    <p className="body-sm" style={{ color: "#737686" }}>
                      {filteredJobs.length} result{filteredJobs.length !== 1 ? "s" : ""} for "
                      {searchQuery}"
                    </p>
                  )}
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    {/* Column headers */}
                    <thead>
                      <tr style={{ background: "#f2f3ff" }}>
                        {["Company & Role", "Status", "Date Applied", "Actions"].map(
                          (col, i) => (
                            <th
                              key={col}
                              className="label-md text-left px-6 py-3 uppercase"
                              style={{
                                color: "#737686",
                                textAlign: i === 3 ? "right" : "left",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                borderBottom: "1px solid #e2e7ff",
                              }}
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    {/* Table rows */}
                    <tbody>
                      {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                          <JobCard
                            key={job._id}
                            job={job}
                            onEdit={handleEditOpen}
                            onDelete={handleDelete}
                          />
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-12 text-center body-md"
                            style={{ color: "#737686" }}
                          >
                            No results match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Add / Edit Modal ── */}
      <JobModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editingJob}
        isLoading={saving}
      />
    </div>
  );
}
