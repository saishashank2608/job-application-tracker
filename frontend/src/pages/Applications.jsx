import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import { getJobs, createJob, updateJob, deleteJob } from "../api/api";

function IconPlus() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EmptyApplications({ onAddClick }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: 360 }}>
      <div className="card animate-fade-in-up" style={{ padding: 48, textAlign: "center", maxWidth: 520 }}>
        <h2 className="headline-md mb-3" style={{ color: "#131b2e" }}>
          No applications yet
        </h2>
        <p className="body-md mb-6" style={{ color: "#737686" }}>
          Add your first application here and track it from one place.
        </p>
        <button onClick={onAddClick} className="btn-primary" style={{ padding: "10px 24px" }}>
          <IconPlus />
          Add Application
        </button>
      </div>
    </div>
  );
}

export default function Applications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const jobsData = await getJobs();
      setJobs(jobsData);
    } catch (err) {
      setError("Failed to load applications. Please refresh the page.");
      console.error("Fetch jobs error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(formData) {
    setSaving(true);
    try {
      const payload = {
        company: formData.company,
        role: formData.role,
        status: formData.status,
        applicationDate: formData.date,
        notes: formData.notes,
      };
      const newJob = await createJob(payload);
      setJobs((prev) => [newJob, ...prev]);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add application.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(formData) {
    if (!editingJob) return;
    setSaving(true);
    try {
      const payload = {
        company: formData.company,
        role: formData.role,
        status: formData.status,
        applicationDate: formData.date,
        notes: formData.notes,
      };
      const updated = await updateJob(editingJob._id, payload);
      setJobs((prev) => prev.map((job) => (job._id === updated._id ? updated : job)));
      setShowModal(false);
      setEditingJob(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update application.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(jobId) {
    if (!window.confirm("Delete this application? This cannot be undone.")) return;
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      alert("Failed to delete application.");
    }
  }

  function handleEditOpen(job) {
    setEditingJob(job);
    setShowModal(true);
  }

  function handleAddOpen() {
    setEditingJob(null);
    setShowModal(true);
  }

  function handleModalClose() {
    setEditingJob(null);
    setShowModal(false);
  }

  function handleModalSubmit(formData) {
    if (editingJob) {
      handleUpdate(formData);
    } else {
      handleAdd(formData);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    return (
      job.company?.toLowerCase().includes(q) ||
      job.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen" style={{ background: "#faf8ff" }}>
      <Sidebar onAddClick={handleAddOpen} />
      <div style={{ marginLeft: 232, flex: 1 }}>
        <TopNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main style={{ paddingTop: 64 }}>
          <div style={{ padding: "32px 32px 40px" }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="headline-xl" style={{ color: "#131b2e" }}>
                  Applications
                </h1>
                <p className="body-md mt-1" style={{ color: "#737686" }}>
                  View and manage your job applications.
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

            {error && (
              <div
                className="mb-6 px-4 py-3 rounded-lg text-sm"
                style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" }}
              >
                {error}
              </div>
            )}

            {!loading && filteredJobs.length === 0 && !error && (
              <EmptyApplications onAddClick={handleAddOpen} />
            )}

            {loading ? (
              <div className="flex items-center justify-center" style={{ height: 280 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    border: "3px solid #e2e7ff",
                    borderTop: "3px solid #2563eb",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              filteredJobs.length > 0 && (
                <div className="card" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f2f3ff" }}>
                        {['Company & Role', 'Status', 'Date Applied', 'Actions'].map((col, i) => (
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
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <JobCard
                          key={job._id}
                          job={job}
                          onEdit={handleEditOpen}
                          onDelete={handleDelete}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </main>
      </div>
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
