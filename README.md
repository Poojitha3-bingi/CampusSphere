# Institute Hub

A full-stack institute management system with an admin dashboard for managing students, staff, and departments.

Built with **React + Vite** on the frontend and **Node.js + Express + MongoDB Atlas + Mongoose** on the backend, using **JWT** for authentication and **bcrypt** for password hashing.

---

## Features

- **Admin Authentication** — login / logout with JWT, hashed passwords, protected routes
- **Dashboard** — total students, total staff, total departments, recent registrations
- **Student Management** — add, view, edit, delete, search & filter (by department and year)
- **Staff Management** — add, view, edit, delete, search & filter (by department)
- **Department Management** — add, view, edit, delete (protected from deletion when staff/students are assigned)
- Responsive tables and forms, loading and error states, toast notifications

---

## Tech Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Frontend   | React.js, Vite, Tailwind CSS, React Router   |
| Backend    | Node.js, Express.js                          |
| Database   | MongoDB Atlas + Mongoose                     |
| Auth       | JWT (jsonwebtoken) + bcryptjs                |

---

## Project Structure

```
project/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── api/              # axios client with JWT interceptor
│   │   ├── context/          # AuthContext (login / logout / token)
│   │   ├── components/       # Layout, ProtectedRoute, Modal, ConfirmDialog, Toast, States
│   │   └── pages/            # Login, Dashboard, Students, Staff, Departments
│   ├── .env.example
│   └── package.json
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # MongoDB connection
│   │   ├── models/           # Admin, Student, Staff, Department
│   │   ├── controllers/      # auth, student, staff, department, dashboard
│   │   ├── routes/           # /api/auth, /api/students, /api/staff, /api/departments, /api/dashboard
│   │   ├── middleware/       # protect (JWT verify), errorHandler
│   │   └── utils/            # seed script (admin + sample data)
│   ├── .env.example
│   └── package.json
└── README.md
```

The frontend and backend are fully separate apps and can be run independently.

---

## Prerequisites

- Node.js v18+
- A MongoDB Atlas account (free tier works) — create a cluster and get a connection string

---

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Replace with your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/institute_hub?retryWrites=true&w=majority

JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=2d

# Initial admin (created by the seed script)
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@institute.com
ADMIN_PASSWORD=Admin@123
```

Seed the database with an admin account and sample data:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/api/health`

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

`frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Default Admin Credentials

After running `npm run seed` in the backend:

| Field    | Value                |
| -------- | -------------------- |
| Email    | admin@institute.com  |
| Password | Admin@123            |

Change these in `backend/.env` before seeding if you want different credentials. **Never hardcode credentials in the code** — they are read from environment variables only.

---

## API Endpoints

| Method | Endpoint              | Description                  | Auth |
| ------ | --------------------- | ---------------------------- | ---- |
| POST   | `/api/auth/login`     | Admin login, returns JWT     | No   |
| GET    | `/api/auth/me`        | Get current admin profile    | Yes  |
| GET    | `/api/dashboard/stats`| Dashboard statistics         | Yes  |
| GET    | `/api/students`       | List students (search/filter)| Yes  |
| POST   | `/api/students`       | Create a student             | Yes  |
| PUT    | `/api/students/:id`   | Update a student             | Yes  |
| DELETE | `/api/students/:id`   | Delete a student             | Yes  |
| GET    | `/api/staff`          | List staff (search/filter)   | Yes  |
| POST   | `/api/staff`          | Create a staff member        | Yes  |
| PUT    | `/api/staff/:id`      | Update a staff member        | Yes  |
| DELETE | `/api/staff/:id`      | Delete a staff member        | Yes  |
| GET    | `/api/departments`    | List departments             | Yes  |
| POST   | `/api/departments`    | Create a department          | Yes  |
| PUT    | `/api/departments/:id`| Update a department          | Yes  |
| DELETE | `/api/departments/:id`| Delete a department          | Yes  |

**Query parameters for listing:**
- Students: `?search=`, `?department=`, `?year=`
- Staff: `?search=`, `?department=`
- Departments: `?search=`

---

## How Authentication Works

1. Admin logs in via `POST /api/auth/login` with email + password.
2. The server verifies the password against the bcrypt hash and returns a JWT.
3. The frontend stores the token in `localStorage` and attaches it as `Authorization: Bearer <token>` to every API request via an axios interceptor.
4. The `protect` middleware on the backend verifies the JWT on every protected route.
5. On logout, the token is removed from `localStorage`.
6. If a token expires or is invalid, the interceptor redirects to the login page.

---

## Notes

- Both apps read configuration from `.env` files — copy the `.env.example` files and fill in your own values. Never commit `.env` to version control.
- The seed script clears existing data before inserting. Only run it on a fresh database or when you want to reset.
- Deleting a department is blocked if students or staff are still assigned to it — reassign them first.
- All API errors return a consistent `{ message }` JSON shape, including validation and duplicate-key errors.
