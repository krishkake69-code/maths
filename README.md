# REHMAN Classes

A premium educational coaching platform for NEET, JEE, Board Exams, and competitive Chemistry examinations.

## Project Overview

This repository contains the source code for the Attri Chemistry Classes web application. It is a modern, responsive platform built to manage educational content, student inquiries, and administrative tasks.

## Technology Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS 4, React Router 7
- **Backend:** Express (Local Development), Vercel Serverless Functions (Production)
- **Database:** Firebase Firestore (via REST API) with local JSON fallback
- **Auth:** HMAC-signed stateless tokens (admin role), bcrypt password hashing
- **Deployment:** Vercel

## Local Development Environment

### Prerequisites

Ensure the following tools are installed before beginning setup:
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository and install project dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables by duplicating the example file:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your credentials:
   ```env
   ADMIN_PASSWORD=your_secure_admin_password
   AUTH_SECRET=optional_signing_secret
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=firebase_service_account_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GEMINI_API_KEY=your_google_gemini_api_key
   NODE_ENV=development
   ```

### Running the Application

To start the local development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Production Build

To build the application for production locally:
```bash
npm run build
```

To start the local production server:
```bash
npm run start
```

## Deployment

The application is configured for seamless deployment on Vercel.

### Vercel Deployment Workflow

1. Push the repository to a remote Git provider (e.g., GitHub, GitLab).
2. Import the project into your Vercel Dashboard.
3. Configure the following Environment Variables in the Vercel project settings:
   - `ADMIN_PASSWORD`: Your chosen secure administrator password
   - `GEMINI_API_KEY`: Your Google Gemini API key (Required for AI integration)
   - `AUTH_SECRET`: Optional custom signing secret for session tokens
   - `FIREBASE_PROJECT_ID`: Firebase project ID (for production data persistence)
   - `FIREBASE_CLIENT_EMAIL`: Firebase service account email
   - `FIREBASE_PRIVATE_KEY`: Firebase service account private key (with escaped newlines)
4. Deploy the application.

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_PASSWORD` | Administrator authentication password | Yes |
| `GEMINI_API_KEY` | Google Gemini API integration key | Optional |
| `AUTH_SECRET` | Custom HMAC signing secret (derived from ADMIN_PASSWORD if unset) | Optional |
| `FIREBASE_PROJECT_ID` | Firebase project ID (for production data persistence) | Optional* |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | Optional* |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key | Optional* |

*Optional for local development (falls back to local JSON files), required for production persistence.

## Project Structure

```text
├── api/                      # Vercel serverless functions
│   └── index.ts              # Single Express app entry point
├── lib/                      # Shared backend libraries
│   └── firebase.ts           # Firestore REST API client
├── src/                      # React application source
│   ├── components/           # User interface components
│   ├── utils/                # Shared utilities
│   ├── main.tsx              # Application entry point
│   └── data-store.json       # Local data persistence (development)
├── scripts/                  # Utility scripts
├── public/                   # Static web assets
├── api-app.ts                # Shared Express API application
├── server.ts                 # Express server configuration (local)
├── server-utils.ts           # Shared utilities (auth, data store)
├── vercel.json               # Vercel deployment configuration
└── vite.config.ts            # Vite build configuration
```

## Application Programming Interface (API)

The application provides the following endpoints:

### Public Endpoints

| HTTP Method | Endpoint | Description | Authentication Required |
|-------------|----------|-------------|-------------------------|
| GET | `/api/health` | System health check | No |
| GET | `/api/content` | Retrieve public website content | No |
| POST | `/api/inquiries` | Submit a new student inquiry | No |
| POST | `/api/newsletter` | Subscribe to practice bulletin | No |

### Admin Endpoints

| HTTP Method | Endpoint | Description | Authentication Required |
|-------------|----------|-------------|-------------------------|
| POST | `/api/auth/login` | Administrator authentication | No |
| GET | `/api/auth/session` | Validate admin session | Yes (Admin) |
| GET | `/api/inquiries` | Retrieve all submitted inquiries | Yes (Admin) |
| PUT | `/api/inquiries/:id/read` | Modify inquiry read status | Yes (Admin) |
| DELETE | `/api/inquiries/:id` | Remove an inquiry | Yes (Admin) |
| GET | `/api/newsletter` | List newsletter subscribers | Yes (Admin) |
| PUT | `/api/content` | Update website content | Yes (Admin) |

## Data Model

### Inquiry
```typescript
{
  id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
  type: 'enroll' | 'contact';
  timestamp: string;         // ISO date
  read: boolean;
}
```

## Security Protocols

- Default fallback passwords have been removed to prevent unauthorized access.
- Admin login is **disabled entirely** when `ADMIN_PASSWORD` is not configured.
- Session tokens are HMAC-signed (SHA-256) with 7-day expiry.
- Tokens contain `role` claim (`admin`) preventing cross-role access.
- Passwords are compared using constant-time comparison (`crypto.timingSafeEqual`).
- Rate limiting on all auth and write endpoints (in-memory, resets on cold starts in serverless).
- Honeypot field (`website`) on public forms to catch bots.
- Helmet.js security headers (CSP relaxed for SPA compatibility).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- Input sanitization: control character stripping, length limits, regex validation.
- Hard caps on stored arrays (inquiries: 500, newsletter: 2000).
- Trust proxy configured only on Vercel (prevents IP spoofing).
- Firebase credentials never stored in code — only via environment variables.