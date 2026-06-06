# CareerTrack - Job Application Tracker

CareerTrack is a full-stack MERN application designed to help users manage and track their job applications efficiently. The platform provides a centralized dashboard where users can record applications, monitor progress, and analyze their job search journey.

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes

### Job Application Management

* Add New Applications
* View All Applications
* Update Existing Applications
* Delete Applications
* Store Notes for Each Application

### Application Tracking

Track applications through different stages:

* Applied
* Interview Scheduled
* Selected
* Rejected

### Analytics Dashboard

* Total Applications Count
* Interview Count
* Selected Offers Count
* Rejected Applications Count

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js

### Database

* MongoDB
* Mongoose

## Project Structure

```text
job-application-tracker/

├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Applications

```http
GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

### Analytics

```http
GET /api/jobs/stats
```

## Installation & Setup

### Clone Repository

```bash
git clone <repository-url>
cd job-application-tracker
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Live Demo

Frontend: https://job-application-tracker-vercel.vercel.app

Backend API: https://job-application-tracker-backend-j5cx.onrender.com

GitHub Repository:
https://github.com/saishashank2608/job-application-tracker

## Environment Variables

Create a `.env` file inside the backend folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

## Future Improvements

* Search & Filter Applications
* Email Notifications
* Interview Reminder System
* Resume Upload Support
* Application Statistics Charts

## Author

**Shashank**
