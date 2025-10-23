# Visa Dossier App

A simple document management application for visa applications. Upload and manage visa documents (visa forms, passports, supporting documents).

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.3)
- **Frontend**: React Router 7 + TypeScript + Tailwind CSS
- **Database**: MySQL/PostgreSQL
- **UI Components**: shadcn/ui

## Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL or PostgreSQL

## Setup

### 1. API (Laravel)

```bash
cd api

# Install dependencies
composer install

# Configure environment
cp .env.example .env

# Update database credentials in .env (optional)

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Start server
php artisan serve
```

API will run on `http://127.0.0.1:8000`

### 2. Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL
cp .env.example .env

# Start dev server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Development

Run both servers simultaneously:

```bash
# Terminal 1 - API
npm run dev:api

# Terminal 2 - Frontend
npm run dev:frontend
```

## Features

- Auto-create dossier on first visit
- Upload documents (PDF, JPG, PNG up to 4MB)
- Document preview (images) or file info (PDFs)
- Delete documents
- Persistent dossier via localStorage
- Real-time validation with error messages

## What's Next

### Security (Critical)
⚠️ **API routes are currently unprotected.** Sanctum is partially configured but needs completion:
- Complete Sanctum authentication setup
- Protect API routes with `auth:sanctum` middleware
- Link dossiers to authenticated users instead of localStorage

### Potential Enhancements
- Multi-user support with user-owned dossiers
- Document approval/review workflow
- Email notifications for status updates
- Bulk document upload
