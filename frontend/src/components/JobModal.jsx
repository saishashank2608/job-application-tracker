// =============================================
// components/JobModal.jsx
// Reusable modal for BOTH adding and editing a job application.
//
// Props:
//   isOpen      - boolean, controls visibility
//   onClose     - callback to close the modal
//   onSubmit    - callback(formData) called on form submit
//   initialData - null (Add mode) or job object (Edit mode)
//   isLoading   - boolean, disables submit while API call is in-flight
// =============================================

import React, { useState, useEffect } from "react";

// Available statuses (matches backend enum)
const STATUSES = [
  "Applied",
  "Interview Scheduled",
  "Selected",
  "Rejected",
  "Offered",
];

// Icon helpers
function IconBuilding() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#737686" strokeWidth={1.8}>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M8 21V10h8v11M12 7h.01" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#737686" strokeWidth={1.8}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="18" y1="6" x2="6"  y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Today's date in YYYY-MM-DD (for default date input value) ─────────────────
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// ── JobModal Component ────────────────────────────────────────────────────────
export default function JobModal({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  // ── Form state ──
  // useState holds all form fields in a single object for simplicity
  const [form, setForm] = useState({
    company: "",
    role:    "",
    status:  "Applied",
    date:    todayISO(),
    notes:   "",
  });

  // ── Populate form when editing ──
  // useEffect: when initialData changes (modal opens with a job), fill the form
  useEffect(() => {
    if (initialData) {
      setForm({
        company: initialData.company || "",
        role:    initialData.role    || "",
        status:  initialData.status  || "Applied",
        date:    initialData.date
                   ? initialData.date.split("T")[0]
                   : (initialData.applicationDate?.split("T")[0] || todayISO()),
        notes:   initialData.notes  || "",
      });
    } else {
      // Reset form when opening in Add mode
      setForm({ company: "", role: "", status: "Applied", date: todayISO(), notes: "" });
    }
  }, [initialData, isOpen]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // ── Generic input change handler ──
  // Updates the correct field in the form object
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ── Form submission ──
  function handleSubmit(e) {
    e.preventDefault();
    // Basic validation
    if (!form.company.trim() || !form.role.trim()) return;
    onSubmit(form);
  }

  const isEditMode = !!initialData;

  return (
    /* ── Overlay ── */
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      {/* ── Modal panel ── */}
      <div
        className="animate-fade-in-up"
        style={{
          background: "#ffffff",
          borderRadius: "1rem",
          width: "100%",
          maxWidth: 480,
          margin: "0 16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
        // Stop click from bubbling to overlay (which would close modal)
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid #e2e7ff" }}
        >
          <h2 className="headline-md" style={{ color: "#131b2e" }}>
            {isEditMode ? "Edit Application" : "Add New Application"}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 32, height: 32, color: "#737686" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f2f3ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <IconClose />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                Company Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <IconBuilding />
                </span>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="form-input form-input-icon"
                  required
                />
              </div>
            </div>

            {/* Job Role */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                Job Role
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <IconBriefcase />
                </span>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Developer"
                  className="form-input form-input-icon"
                  required
                />
              </div>
            </div>

            {/* Status + Date (side by side) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Status dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-input"
                  style={{ cursor: "pointer" }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Application Date */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                  Application Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Notes (optional) */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#131b2e" }}>
                Notes{" "}
                <span className="font-normal" style={{ color: "#737686" }}>
                  (Optional)
                </span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder={
                  isEditMode
                    ? "Add details about the application, interviewers, or requirements..."
                    : "Add any relevant details, links to job description, etc."
                }
                rows={4}
                className="form-input resize-none"
              />
            </div>
          </div>

          {/* ── Modal Footer ── */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4"
            style={{ borderTop: "1px solid #e2e7ff", background: "#faf8ff" }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Update Application"
                : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
