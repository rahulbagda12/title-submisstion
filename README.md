# TitleSubmission — Atmiya University Project Portal

A full-stack web application for **B.C.A** and **B.Sc. I.T.** Semester 5 students to submit their project titles, partner details, and technology stack.

## Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | React 19, Vite, Tailwind CSS 4 |
| Backend  | Node.js, Express, Mongoose     |
| Database | MongoDB Atlas                  |
| Hosting  | Vercel (frontend + serverless) |

## Project Structure

```
TitleSubmission/
├── api/
│   └── index.js          # Vercel serverless function wrapper
├── backend/
│   ├── models/
│   │   └── Student.js    # Mongoose schema
│   ├── routes/
│   │   ├── admin.js      # Admin CRUD + Excel export
│   │   └── students.js   # Student submission + validation
│   ├── server.js         # Express app
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # StudentForm, AdminDashboard
│   │   ├── pages/        # Home, Admin
│   │   ├── App.jsx       # Router + layout
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   └── package.json
├── vercel.json           # Vercel deployment config
└── .gitignore
```

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup

```bash
# Clone the repo
git clone https://github.com/rahulbagda12/TitleSubmission.git
cd TitleSubmission

# Install backend dependencies
cd backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env

# Start backend (runs on port 5000)
npm run dev

# In a new terminal — install and start frontend
cd ../frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to `http://localhost:5000`.

## Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your `rahulbagda12/TitleSubmission` repo
   - Framework Preset: **Other** (the `vercel.json` handles everything)
   - Root Directory: leave as `.` (root)

3. **Set Environment Variables** in Vercel Dashboard → Settings → Environment Variables:
   | Variable   | Value                        |
   |------------|------------------------------|
   | `MONGO_URI` | `mongodb+srv://...` (your Atlas connection string) |

4. **MongoDB Atlas — Whitelist IPs**
   - Go to Atlas → Network Access → Add IP Address
   - Add `0.0.0.0/0` to allow Vercel's dynamic IPs

5. **Deploy** — Vercel auto-deploys on every push to `main`.

## Divisions

| Course       | Divisions                              |
|--------------|----------------------------------------|
| B.C.A Sem 5  | C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11 |
| B.Sc. I.T. Sem 5 | F1, F2, F3, F4, F5, F6, F7, F8     |
| Sub-Divisions | X, Y                                  |

## Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/`      | Health check |
| POST   | `/api/students` | Submit project |
| GET    | `/api/students/division/:div?subDiv=X` | List students in division |
| GET    | `/api/admin/submissions?search=...` | Search all submissions |
| PUT    | `/api/admin/submissions/:id` | Edit submission |
| DELETE | `/api/admin/submissions/:id` | Delete submission |
| GET    | `/api/admin/export` | Export to Excel |