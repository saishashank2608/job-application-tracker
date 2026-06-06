# CareerTrack — Frontend

A beginner-to-intermediate MERN stack frontend for tracking job applications.
Built with **React**, **React Router**, **Axios**, and **Tailwind CSS**.

---

## Folder Structure

```
src/
├── pages/
│   ├── Login.jsx          ← Login page
│   ├── Register.jsx       ← Register page
│   ├── Dashboard.jsx      ← Main dashboard (jobs list + stats)
│   └── Analytics.jsx      ← Analytics / charts page
│
├── components/
│   ├── Sidebar.jsx        ← Left sidebar navigation
│   ├── TopNavbar.jsx      ← Top search bar + user avatar
│   ├── StatsCard.jsx      ← Summary stat card
│   ├── JobCard.jsx        ← Single job row in the table
│   └── JobModal.jsx       ← Add / Edit job modal
│
├── api/
│   └── api.js             ← All Axios API calls (auth + jobs)
│
├── App.jsx                ← Router setup + PrivateRoute guard
├── index.js               ← React entry point
└── index.css              ← Tailwind base + global styles
```

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API URL

By default, the frontend talks to `http://localhost:5000`.
To change this, create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start the development server

```bash
npm start
```

The app will open at `http://localhost:3000`.

---

## Backend API Contract

The frontend expects these endpoints on the Express backend:

| Method | Endpoint              | Auth? | Description                         |
|--------|-----------------------|-------|-------------------------------------|
| POST   | /api/auth/register    | No    | Register user → returns `{ token, user }` |
| POST   | /api/auth/login       | No    | Login user → returns `{ token, user }` |
| GET    | /api/jobs             | Yes   | Get all jobs for the logged-in user |
| POST   | /api/jobs             | Yes   | Create a new job application        |
| PUT    | /api/jobs/:id         | Yes   | Update a job application by ID      |
| DELETE | /api/jobs/:id         | Yes   | Delete a job application by ID      |
| GET    | /api/jobs/stats       | Yes   | Get stats object (see below)        |

### Stats endpoint response shape

```json
{
  "total": 12,
  "applied": 5,
  "interviewScheduled": 3,
  "selected": 2,
  "rejected": 2,
  "offered": 0
}
```

### Job object shape

```json
{
  "_id": "mongo_object_id",
  "company": "Google",
  "role": "Product Designer",
  "status": "Interview Scheduled",
  "date": "2023-10-12T00:00:00.000Z",
  "notes": "Had a great call with the recruiter.",
  "createdAt": "2023-10-12T...",
  "updatedAt": "2023-10-12T..."
}
```

### Application statuses (exactly as used in frontend)

- `Applied`
- `Interview Scheduled`
- `Selected`
- `Rejected`
- `Offered`

---

## Auth

- JWT token is stored in `localStorage` as `"token"`.
- Token is sent with every protected request as `Authorization: Bearer <token>`.
- Logging out clears `localStorage` and redirects to `/login`.
- PrivateRoute in `App.jsx` protects `/` and `/analytics` — unauthenticated users are redirected to `/login`.

---

## Design System

Follows the **Kinetic Ledger** design spec:

- **Primary color:** `#2563eb` (Professional Blue)
- **Surface/Background:** `#faf8ff`
- **Typography:** Inter (body) — loaded via Google Fonts
- **Border radius:** 8px standard, 16px for modals
- **Status badges:** Soft-fill pill badges (colored bg + matching text)

---

## Key Patterns Used

1. **useState** — All form fields, loading/error states, modal open state
2. **useEffect** — Data fetching on component mount
3. **Axios** — All HTTP requests, centralized in `api/api.js`
4. **React Router v6** — `<Routes>`, `<Route>`, `useNavigate`, `useLocation`, `Link`
5. **localStorage** — JWT token persistence between page reloads
6. **Conditional rendering** — Loading skeleton, empty state, error state

---

## Interview Talking Points

- "I used `useState` to manage form fields as a single object so I only need one `handleChange` function."
- "I used `useEffect` with an empty dependency array `[]` to fetch data once on mount."
- "All API calls are centralized in `api/api.js` to keep components clean."
- "I built a `PrivateRoute` component that checks localStorage for a token before rendering."
- "I used optimistic UI updates — after adding a job, I push it to local state without re-fetching."
