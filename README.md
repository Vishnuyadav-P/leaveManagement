# Leave Management System - Vercel Serverless Edition

A sophisticated leave management application built with Vue.js 3 and deployed on **Vercel serverless functions**. Employees can submit, track, and manage leave requests while employers can review, approve, or reject them with custom rejection reasons.

> **🔄 Architecture Migrated:** This project was refactored from a traditional Express.js backend on Render to **Vercel serverless functions** for zero-config deployment, auto-scaling, and reduced operational overhead.

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

| Layer         | Technology                      |
|---------------|---------------------------------|
| **Frontend**  | Vue 3, Vite, TailwindCSS        |
| **Backend**   | Node.js Serverless (Vercel)     |
| **Database**  | MongoDB Atlas                   |
| **Auth**      | JWT + bcryptjs                  |
| **Hosting**   | Vercel (Frontend & Serverless)  |
| **API Client** | Axios                          |

---

## 📁 New Serverless Architecture  

This project has been refactored to use **Vercel serverless functions** instead of a traditional Express server. Each file in `/api` automatically becomes a serverless endpoint.

```
leave-app/
├── api/                          # ⭐ Vercel serverless functions
│   ├── auth/
│   │   ├── register.js           # POST /api/auth/register
│   │   ├── login.js              # POST /api/auth/login
│   │   └── me.js                 # GET /api/auth/me
│   ├── leaves/
│   │   ├── apply.js              # POST /api/leaves/apply
│   │   ├── my.js                 # GET /api/leaves/my
│   │   ├── index.js              # GET /api/leaves
│   │   └── [id].js               # PATCH /api/leaves/[id]
│   └── health.js                 # GET /api/health
│
├── lib/
│   └── db.js                     # MongoDB connection (optimized)
│
├── models/
│   ├── User.js                   # Mongoose User schema
│   └── Leave.js                  # Mongoose Leave schema
│
├── middleware/
│   └── auth.js                   # JWT verification & authorization
│
├── frontend/                      # Vue.js SPA
│   ├── src/pages/                # Page components
│   ├── src/services/api.js       # Updated to use /api
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── vercel.json                   # Vercel deployment config
└── README.md                     # This file
```

### What Changed: Express → Serverless

| Previous | New |
|----------|-----|
| `server.js` + Express | `/api` folder + Vercel routing |
| `routes/` + `controllers/` | Single-file handlers in `/api` |
| Server process running 24/7 | Serverless functions on-demand |
| Render hosting | Vercel hosting (zero-config) |
| CORS middleware | CORS headers in each function |
| Global error handler | Per-function error handling |

---

## 🔐 Environment Variables

### Local Development

Create `.env` at **project root**:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/leave-db
JWT_SECRET=your_secret_key_32_chars_minimum
VITE_API_BASE_URL=/api
```

### Production (Vercel)

Set these in Vercel Project Settings → Environment Variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Your secret key

### How to Generate JWT_SECRET

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a **free cluster**
3. Go to **Connect** → **Drivers**
4. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
5. Paste into `MONGODB_URI`
6. **Important:** In **Network Access**, add `0.0.0.0/0` to allow Vercel IPs

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier)
- **Vercel** account (for deployment)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd leave-app

# Install all dependencies
npm install
cd frontend && npm install && cd ..
```

### 2. Setup Environment

```bash
# Create .env at project root
echo "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/leave-db" > .env
echo "JWT_SECRET=your_secret_key_here" >> .env
```

### 3. Run Locally (Development)

Open **two terminals**:

**Terminal 1: Backend**
```bash
cd backend && npm run dev
# Runs on http://localhost:5000
```

**Terminal 2: Frontend**
```bash
cd frontend && npm run dev
# Runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

### 4. Test Credentials

```
Employee:
- Email: emp@huskyvoice.ai
- Password: 123456
- Role: Employee

Employer:
- Email: emp@huskyvoice.ai  
- Password: 123456
- Role: Employer
```

---

## 🌐 Deploy to Vercel

### Prerequisites
- GitHub account with your repo
- Vercel account

### Deployment Steps

```bash
# 1. Push to GitHub
git add .
git commit -m "Serverless refactor ready for Vercel"
git push origin main

# 2. Go to vercel.com
#    → New Project
#    → Import your GitHub repo

# 3. In Project Settings → Environment Variables:
#    Add: MONGODB_URI = your_connection_string
#    Add: JWT_SECRET = your_secret_key

# 4. Click Deploy!

# Your app is now live at: https://your-project.vercel.app
```

### Verify Deployment

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Try registering
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@huskyvoice.ai","password":"123456"}'
```

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