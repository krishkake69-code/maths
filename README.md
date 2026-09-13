# Attri Chemistry Classes

A premium educational coaching platform for NEET, JEE, Board Exams, and competitive Chemistry examinations.

## Project Overview

This repository contains the source code for the Attri Chemistry Classes web application. It is a modern, responsive platform built to manage educational content, student inquiries, and administrative tasks.

## Technology Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS 4
- **Backend:** Express (Local Development), Vercel Serverless Functions (Production)
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
4. Deploy the application.

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_PASSWORD` | Administrator authentication password | Yes |
| `GEMINI_API_KEY` | Google Gemini API integration key | Optional |

## Project Structure

```text
├── api/                  # Vercel serverless functions (API routes)
│   ├── content.ts        # Content management endpoints
│   ├── inquiries.ts      # Inquiry processing endpoints
│   ├── auth.ts           # Authentication routes
│   └── health.ts         # System health check
├── src/                  # React application source
│   ├── components/       # User interface components
│   ├── utils/            # Shared utilities
│   ├── main.tsx          # Application entry point
│   └── data-store.json   # Local data persistence (development)
├── public/               # Static web assets
├── server.ts             # Express server configuration (local)
├── vercel.json           # Vercel deployment configuration
└── vite.config.ts        # Vite build configuration
```

## Application Programming Interface (API)

The application provides the following endpoints:

| HTTP Method | Endpoint | Description | Authentication Required |
|-------------|----------|-------------|-------------------------|
| GET | `/api/health` | System health check | No |
| GET | `/api/content` | Retrieve public website content | No |
| PUT | `/api/content` | Update website content | Yes (Admin) |
| POST | `/api/inquiries` | Submit a new student inquiry | No |
| GET | `/api/inquiries` | Retrieve all submitted inquiries | Yes (Admin) |
| PUT | `/api/inquiries/:id/read` | Modify inquiry read status | Yes (Admin) |
| DELETE | `/api/inquiries/:id` | Remove an inquiry | Yes (Admin) |
| POST | `/api/auth/login` | Administrator authentication | No |
| GET | `/api/auth/session` | Validate current session | Yes (Admin) |

## Security Protocols

- Default fallback passwords have been removed to prevent unauthorized access.
- Always ensure `.env` is included in `.gitignore` to prevent API key exposure.
- Authentication tokens should be rotated periodically.