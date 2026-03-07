# 🗓️ LeaveFlow — Leave Management System

A full-stack MVP Leave Management Web Application built with Vue 3, Node.js/Express, and MongoDB Atlas. Employees can apply for leave and employers can approve or reject requests in real time.

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication with 7-day token expiry
- Passwords hashed with bcryptjs
- Tokens stored in `localStorage`
- Role-based access control (Employee / Employer)
- Route guards on both frontend (Vue Router) and backend (middleware)

### 👤 Employee
- **Apply for Leave** — Choose leave type, date range, and provide a reason
- **Live duration calculator** — See how many days you're requesting
- **My Requests** — View all your submitted requests with status tracking
- Stats overview: Total, Pending, Approved, Rejected counts

### 🏢 Employer
- **Dashboard** — View all employees' leave requests in a sortable table
- **Approve / Reject** with a single click
- **Filter by status** — All, Pending, Approved, Rejected tabs
- Toast notifications on action completion
- Employee avatars with name + email

---

## 🛠️ Tech Stack

| Layer      | Technology                                 |
|------------|--------------------------------------------|
| Frontend   | Vue 3 (Composition API), Vite              |
| Styling    | Tailwind CSS, DM Sans + DM Serif fonts     |
| HTTP       | Axios (with request/response interceptors) |
| Routing    | Vue Router 4                               |
| Backend    | Node.js, Express.js                        |
| Auth       | JWT (jsonwebtoken), bcryptjs               |
| Database   | MongoDB Atlas via Mongoose ODM             |
| Env Config | dotenv                                     |

---

## 📁 Folder Structure

```
leave-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   └── leaveController.js    # Apply, View, Approve/Reject
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verify, role guards
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, role)
│   │   └── Leave.js              # Leave schema (type, dates, reason, status)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   └── leaveRoutes.js        # /api/leaves/*
│   ├── server.js                 # Express app entry point
│   └── .env                      # Environment variables
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── main.css          # Global Tailwind + custom styles
    │   ├── pages/
    │   │   ├── LoginPage.vue
    │   │   ├── RegisterPage.vue
    │   │   ├── ApplyLeavePage.vue
    │   │   ├── MyLeavesPage.vue
    │   │   ├── EmployerDashboard.vue
    │   │   └── NotFound.vue
    │   ├── router/
    │   │   └── index.js          # Vue Router with guards
    │   ├── services/
    │   │   ├── api.js            # Axios instance + service calls
    │   │   └── auth.js           # Auth composable (state + methods)
    │   ├── App.vue               # Root component with navbar
    │   └── main.js               # App entry point
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
CLIENT_URL=http://localhost:5173
```

### Getting a MongoDB Atlas URI
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string and replace `<password>` with your DB password
5. Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/leaveflow?retryWrites=true&w=majority`

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)

### 1. Clone / Download the project

```bash
cd leave-app
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
# Edit .env with your MONGO_URI and JWT_SECRET

# Start development server
npm run dev
# OR for production:
npm start
```

The backend will start on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

> **Note:** The Vite dev server proxies `/api` calls to `http://localhost:5000` automatically — no CORS issues during development.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Access  | Description             |
|--------|----------------------|---------|-------------------------|
| POST   | `/api/auth/register` | Public  | Register new user       |
| POST   | `/api/auth/login`    | Public  | Login and get JWT token |
| GET    | `/api/auth/me`       | Private | Get current user info   |

**Register body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "password": "password123",
  "role": "employee"
}
```

**Login body:**
```json
{
  "email": "jane@company.com",
  "password": "password123"
}
```

**Success response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123...",
    "name": "Jane Smith",
    "email": "jane@company.com",
    "role": "employee"
  }
}
```

---

### Leave Management

| Method | Endpoint            | Access   | Description                     |
|--------|---------------------|----------|---------------------------------|
| POST   | `/api/leaves`       | Employee | Submit a new leave request      |
| GET    | `/api/leaves/my`    | Employee | Get your own leave requests     |
| GET    | `/api/leaves`       | Employer | Get all employees' requests     |
| PATCH  | `/api/leaves/:id`   | Employer | Approve or reject a request     |

**Apply for Leave body:**
```json
{
  "leaveType": "Sick Leave",
  "startDate": "2024-02-10",
  "endDate": "2024-02-12",
  "reason": "Feeling unwell, need rest"
}
```

**Approve/Reject body:**
```json
{
  "status": "Approved"
}
```

**All requests require:** `Authorization: Bearer <token>` header

---

## 🔒 Role-Based Access

| Route           | Employee | Employer |
|-----------------|----------|----------|
| `/apply-leave`  | ✅       | ❌       |
| `/my-leaves`    | ✅       | ❌       |
| `/dashboard`    | ❌       | ✅       |

Unauthorized access redirects to the appropriate page.

---

## 🎨 UI Screenshots

### Login Page
- Clean authentication form with show/hide password toggle
- Amber accent color on dark slate background

### Register Page
- Visual role selector (Employee / Employer toggle cards)
- Clear visual feedback for selected role

### Apply Leave (Employee)
- Visual leave type selector with emoji icons
- Live duration calculator showing number of days
- Success state with navigation options

### My Requests (Employee)
- Stats cards: Total, Pending, Approved, Rejected
- Full request table with color-coded status badges

### Employer Dashboard
- Stats overview cards with icons
- Filter tabs (All / Pending / Approved / Rejected)
- Employee avatars with name and email
- Approve / Reject action buttons (only on Pending requests)
- Toast notifications on action

---

## 🔧 Validation

### Frontend
- All fields required before submission
- End date cannot be before start date
- Password minimum 6 characters
- Start date cannot be in the past

### Backend
- Mongoose schema validation
- Custom date validation in controller
- Status enum validation on approve/reject
- Already-processed leaves cannot be changed again

---

## 📝 HTTP Response Codes

| Code | Meaning                              |
|------|--------------------------------------|
| 200  | OK — request succeeded               |
| 201  | Created — resource created           |
| 400  | Bad Request — validation error       |
| 401  | Unauthorized — invalid/missing token |
| 403  | Forbidden — wrong role               |
| 404  | Not Found — resource not found       |
| 500  | Internal Server Error                |

---

## 🧪 Quick Test Flow

1. **Register as Employee** → `jane@co.com` / `password123` / Employee
2. **Apply for Leave** → Select Sick Leave, pick dates, add reason
3. **View My Requests** → See the Pending request
4. **Register as Employer** → `boss@co.com` / `password123` / Employer
5. **Dashboard** → See Jane's request
6. **Click Approve** → Status updates instantly with toast notification
7. **Back to Jane's account** → Request now shows Approved ✅

---

## 📦 Dependencies

### Backend
```
express        — Web framework
mongoose       — MongoDB ODM
jsonwebtoken   — JWT auth
bcryptjs       — Password hashing
cors           — Cross-origin requests
dotenv         — Environment variables
nodemon        — Dev auto-reload (devDependency)
```

### Frontend
```
vue            — UI framework
vue-router     — Client-side routing
axios          — HTTP client
vite           — Build tool + dev server
tailwindcss    — Utility CSS framework
@vitejs/plugin-vue — Vite Vue plugin
```

---

## 🏗️ Future Enhancements

- Email notifications on leave status change
- Leave balance tracking (days remaining per type)
- Calendar view of team leaves
- Comment/notes when rejecting
- Admin super-user role
- Export leaves to CSV/PDF
- Pagination on large datasets
