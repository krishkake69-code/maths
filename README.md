# REHMAN Classes — Student Portal & Admin Management

A premium educational coaching platform for NEET, JEE, Board Exams, and competitive Chemistry examinations with a complete student portal and admin management system.

## Project Overview

This repository contains the source code for the REHMAN Classes web application. It is a modern, responsive platform built to:
- Manage educational content (courses, results, testimonials, gallery, calendar)
- Collect student inquiries/enrollments
- Manage students, attendance, marks, and schedules
- Provide a self-service student portal

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, React Router 7 |
| **Backend** | Express (Local Dev), Vercel Serverless Functions (Production) |
| **Database** | Firebase Firestore (REST API) with local JSON fallback |
| **Auth** | HMAC-signed stateless tokens, bcrypt password hashing |
| **Deployment** | Vercel |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
├─────────────────────────────────────────────────────────────┤
│  Public Landing Page (Courses, Results, Reviews, etc.)      │
│  ├─ Admin Portal Modal (Lock icon)                          │
│  │   ├─ General & Hero Settings                             │
│  │   ├─ Stats, Courses, Results, Testimonials              │
│  │   ├─ Gallery, Mailbox, Students, Attendance, Marks       │
│  │   └─ Calendar                                            │
│  └─ Student Portal Modal (User icon)                        │
│      ├─ Profile                                             │
│      ├─ Attendance Records                                  │
│      ├─ Test Marks                                          │
│      └─ Calendar Events                                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express/Vercel)                  │
├─────────────────────────────────────────────────────────────┤
│  api-app.ts — Central Express App                           │
│  ├── server-utils.ts — Auth (HMAC tokens, bcrypt), Data Store│
│  ├── lib/firebase.ts — Firestore REST Client                │
│  └── src/data-store.json — Local JSON Fallback              │
└─────────────────────────────────────────────────────────────┘
```

## Local Development Environment

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository and install project dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` with your credentials:
```env
ADMIN_PASSWORD=your_secure_admin_password
AUTH_SECRET=optional_signing_secret_64_chars
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=firebase_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```

### Running the Application

```bash
npm run dev
```
Application accessible at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start    # Production server
```

## Deployment (Vercel)

1. Push to GitHub
2. Import into Vercel Dashboard
3. Set Environment Variables:
   - `ADMIN_PASSWORD` (Required)
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (Required for production data persistence)
   - `GEMINI_API_KEY` (Optional)
   - `AUTH_SECRET` (Optional)

### Vercel Variables Table

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Administrator authentication password |
| `GEMINI_API_KEY` | Optional | Google Gemini API key |
| `AUTH_SECRET` | Optional | Custom signing secret (auto-derived if unset) |
| `FIREBASE_PROJECT_ID` | Optional* | Firestore project ID |
| `FIREBASE_CLIENT_EMAIL` | Optional* | Service account email |
| `FIREBASE_PRIVATE_KEY` | Optional* | Service account private key |

*Optional for local dev (JSON fallback), required for production persistence.

## API Endpoints

### Public Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | System health check |
| GET | `/api/content` | No | Public website content (stats, courses, results, testimonials, gallery, contact, centers) |
| POST | `/api/inquiries` | No | Submit student inquiry/contact form |
| POST | `/api/newsletter` | No | Subscribe to practice bulletin |
| GET | `/api/calendar` | No | Get calendar events (optionally by `?year=2025`) |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login → returns token |
| GET | `/api/auth/session` | Admin | Validate admin session |
| GET | `/api/inquiries` | Admin | List all inquiries |
| PUT | `/api/inquiries/:id/read` | Admin | Toggle inquiry read status |
| DELETE | `/api/inquiries/:id` | Admin | Delete inquiry |
| GET | `/api/newsletter` | Admin | List newsletter subscribers |
| PUT | `/api/content` | Admin | Update website content |

### Admin: Student Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/students` | Admin | List all students (stripped) |
| POST | `/api/admin/students` | Admin | Create new student |
| PUT | `/api/admin/students/:id` | Admin | Update student |
| DELETE | `/api/admin/students/:id` | Admin | Delete student |
| POST | `/api/admin/students/:id/password` | Admin | Set password |

### Admin: Attendance

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/attendance` | Admin | Get attendance for date/batch |
| PUT | `/api/admin/attendance` | Admin | Bulk update attendance |

### Admin: Marks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/marks?studentId=` | Admin | List marks for student |
| POST | `/api/admin/marks` | Admin | Add mark record |
| PUT | `/api/admin/marks/:id` | Admin | Update mark |
| DELETE | `/api/admin/marks/:id?studentId=` | Admin | Delete mark |

### Admin: Calendar

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/calendar` | Admin | List all calendar events |
| POST | `/api/admin/calendar` | Admin | Create event |
| PUT | `/api/admin/calendar/:id` | Admin | Update event |
| DELETE | `/api/admin/calendar/:id` | Admin | Delete event |

### Student Portal

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/student/login` | No | Student login (bcrypt verify) |
| GET | `/api/student/session` | Student | Validate student session |
| GET | `/api/student/me` | Student | Get profile, attendance, marks, calendar |

## Data Models

### Student
```typescript
{
  id: string;                    // stu_<timestamp>_<hex>
  username: string;              // Unique, lowercase, 3-40 chars
  passwordHash: string;          // bcrypt hash
  name: string;
  class: '11th' | '12th';
  batchId: 'MON_TUE_WED_11' | 'MON_TUE_WED_12' | 'FRI_SAT_SUN_11' | 'FRI_SAT_SUN_12';
  phone?: string;
  email?: string;
  subjects?: string[];
  createdAt: string;             // ISO date
  updatedAt?: string;            // ISO date
}
```

### Attendance Record (stored in data-store.json)
```typescript
{
  id: string;                    // att_<date>_<studentId>
  studentId: string;
  batchId: string;
  date: string;                  // YYYY-MM-DD
  status: 'present' | 'absent' | 'late';
  markedBy: 'admin';
  markedAt: string;              // ISO date
}
```

### Mark Record (stored in data-store.json)
```typescript
{
  id: string;                    // mk_<timestamp>_<hex>
  studentId: string;
  batchId: string;
  testName: string;
  subject: string;
  maxMarks: number;              // 1-1000
  marksObtained: number;         // 0 to maxMarks
  date: string;                  // YYYY-MM-DD
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Calendar Event (stored in data-store.json)
```typescript
{
  id: string;                    // ev_<timestamp>_<hex>
  title: string;
  description?: string;
  date: string;                  // YYYY-MM-DD
  endDate?: string;
  batchId?: string;
  class?: '11th' | '12th' | 'all';
  createdAt: string;
  updatedAt?: string;
}
```

### Student Me Response (`GET /api/student/me`)
```typescript
{
  success: true;
  student: Student;
  attendance: AttendanceRecord[];
  marks: MarkRecord[];
  calendar: CalendarEvent[];
}
```

## Security Protocols

| Feature | Implementation |
|---------|----------------|
| **Admin Auth** | HMAC-SHA256 signed, 7-day expiry tokens with `role: 'admin'` claim |
| **Student Auth** | HMAC-SHA256 signed, 12-hour expiry tokens with `role: 'student'` claim |
| **Passwords** | bcrypt hashing (10 rounds), constant-time comparison |
| **Timing Attacks** | `crypto.timingSafeEqual` for password/token verification |
| **Rate Limiting** | In-memory rate limiter (5 admin logins/15min, 15 content saves/min, 5 inquiries/10min) |
| **Student Login Throttle** | Failure-based (20 failures/15min) to prevent brute force while allowing concurrent logins |
| **Honeypot Field** | `website` field on public forms (hidden, bots fill it) |
| **Helmet.js** | Security headers (CSP relaxed for SPA compatibility) |
| **Input Sanitization** | Control char stripping, length limits, regex validation |
| **Hard Caps** | Inquiries (500), newsletter (2000), calendar (1000), student attendance (400), marks (500) |
| **Trust Proxy** | Only on Vercel (prevents IP spoofing) |

## Project Structure

```text
├── api/                      # Vercel serverless functions
│   └── index.ts              # Single Express app entry point
├── lib/                      # Backend libraries
│   └── firebase.ts           # Firestore REST API client
├── src/                      # React application source
│   ├── App.tsx               # Main application
│   ├── components/
│   │   ├── Navbar.tsx        # Navigation with Student + Admin buttons
│   │   ├── StudentPortal.tsx # Student login & dashboard (Profile/Attendance/Marks/Calendar)
│   │   ├── AdminPanel.tsx    # Admin control center
│   │   ├── admin/
│   │   │   ├── AdminStudents.tsx    # Student CRUD
│   │   │   ├── AdminAttendance.tsx  # Attendance marking
│   │   │   ├── AdminMarks.tsx       # Marks management
│   │   │   └── AdminCalendar.tsx    # Calendar events
│   │   └── (public pages)
│   ├── lib/
│   │   ├── api.ts            # Admin/student API client
│   │   └── batches.ts        # Batch constants & helpers
│   ├── types.ts              # TypeScript types
│   └── data-store.json       # Local data persistence (development)
├── api-app.ts                # Shared Express API application
├── server.ts                 # Express server (local dev)
├── server-utils.ts           # Auth & utilities
├── package.json              # Dependencies
├── vercel.json               # Vercel config
└── tsconfig.json             # TypeScript config
```

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | TypeScript type checking |
| `npm run seed:kv` | Seed Firestore from data-store.json (requires Firebase creds) |

## Batch Schedule

The system supports 4 batches:
- **MON_TUE_WED_11**: Mon-Tue-Wed | 11th Class
- **MON_TUE_WED_12**: Mon-Tue-Wed | 12th Class
- **FRI_SAT_SUN_11**: Fri-Sat-Sun | 11th Class
- **FRI_SAT_SUN_12**: Fri-Sat-Sun | 12th Class

## Testing

Create a student via Admin → Students → "Add Student", then login as that student via the User icon in the navbar.

## License & Attribution

Rehman Classes — Educational Platform by Rehman Chemistry Classes, Ghaziabad
