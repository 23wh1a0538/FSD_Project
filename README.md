# AttendEase – MERN Attendance Management System

A full-stack MERN application for managing student attendance with login, registration, CRUD, ratings, and favorites.

---

## Project Structure

```
attendease/
├── backend/          → Node.js + Express + MongoDB
└── frontend/         → React + Axios + React Router
```

---

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Frontend | React, React Router, Axios      |
| Backend  | Node.js, Express.js             |
| Database | MongoDB + Mongoose              |
| Auth     | JWT + bcryptjs                  |

---

## Setup Instructions

### 1. Start MongoDB
Make sure MongoDB is running locally:
```bash
mongod
```
Or use MongoDB Atlas and update `MONGO_URI` in `backend/.env`.

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | /api/v1/auth/register | Register teacher  |
| POST   | /api/v1/auth/login    | Login teacher     |

### Attendance (Protected – requires JWT)
| Method | Endpoint                      | Description        |
|--------|-------------------------------|--------------------|
| GET    | /api/v1/attendance            | Get all records    |
| POST   | /api/v1/attendance            | Mark attendance    |
| PUT    | /api/v1/attendance/:id        | Update record      |
| DELETE | /api/v1/attendance/:id        | Delete record      |
| PUT    | /api/v1/attendance/:id/rate   | Rate a record      |
| PUT    | /api/v1/attendance/:id/favorite | Toggle favorite  |

---

## FSD Lab Experiments Covered

| Exp | Feature                          |
|-----|----------------------------------|
| 1   | Node.js server setup             |
| 2   | Admin login & registration       |
| 3   | File read/write (log operations) |
| 4   | Express REST server              |
| 5   | MongoDB collections              |
| 6   | CRUD operations with Mongoose    |
| 7   | MongoDB query (filter, sort)     |
| 8   | React attendance form            |
| 9   | Form validation                  |
| 10  | Fetch data with Axios            |
| 11  | Full stack integration           |
| 12  | Rating feature                   |
| 13  | Favorites feature                |
| 14  | React Router navigation          |

---

## Environment Variables (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendease
JWT_SECRET=attendease_secret_key_2024
NODE_ENV=development
```
