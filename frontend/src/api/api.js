// =============================================
// api/api.js
// All API calls are centralized here.
// The base URL points to the Express backend.
// JWT token is read from localStorage and sent
// as a Bearer token in every protected request.
// =============================================

import axios from "axios";

// Change this to your backend URL (e.g. http://localhost:5000)
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Helper: build headers with JWT token ─────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// ── AUTH ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * @param {{ name: string, email: string, password: string }} data
 */
export async function registerUser(data) {
  const res = await axios.post(`${BASE_URL}/api/auth/register`, data);
  return res.data; // { token, user }
}

/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }} data
 */
export async function loginUser(data) {
  const res = await axios.post(`${BASE_URL}/api/auth/login`, data);
  return res.data; // { token, user }
}

// ── JOBS ──────────────────────────────────────────────────────────────────────

/**
 * GET /api/jobs
 * Returns all job applications for the logged-in user.
 */
export async function getJobs() {
  const res = await axios.get(`${BASE_URL}/api/jobs`, {
    headers: authHeaders(),
  });
  return res.data; // Array of job objects
}

/**
 * POST /api/jobs
 * @param {{ company: string, role: string, status: string, date: string, notes: string }} data
 */
export async function createJob(data) {
  // Backend responds with { message, application }
  const res = await axios.post(`${BASE_URL}/api/jobs`, data, {
    headers: authHeaders(),
  });
  return res.data.application;
}

/**
 * PUT /api/jobs/:id
 * @param {string} id  - Job document _id
 * @param {object} data - Fields to update
 */
export async function updateJob(id, data) {
  // Backend responds with { message, updatedJob }
  const res = await axios.put(`${BASE_URL}/api/jobs/${id}`, data, {
    headers: authHeaders(),
  });
  return res.data.updatedJob;
}

/**
 * DELETE /api/jobs/:id
 * @param {string} id - Job document _id
 */
export async function deleteJob(id) {
  const res = await axios.delete(`${BASE_URL}/api/jobs/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
}

/**
 * GET /api/jobs/stats
 * Returns counts per status for the dashboard stats cards.
 */
export async function getJobStats() {
  const res = await axios.get(`${BASE_URL}/api/jobs/stats`, {
    headers: authHeaders(),
  });
  return res.data;
  // Expected shape:
  // { total: 12, applied: 5, interviewScheduled: 3, selected: 2, rejected: 2 }
}
