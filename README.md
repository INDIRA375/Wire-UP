# WireUP — Home Services Booking & Service Management

A production-leaning full-stack web app for booking and managing home services. Built with a minimal and elegant UI inspired by modern whitespace-first products.

## Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS + React Hooks
- **Backend:** Node.js + Express (MVC-style foldering)
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT-based authentication + bcrypt password hashing
- **Icons:** Lucide React
- **Deployment:** Render-ready configuration (`render.yaml`)

## Features

- Landing page with:
  - Big service search with autocomplete
  - Auto location detection (Geolocation API)
  - Category grid cards with iconography and soft hover transitions
- Authentication:
  - Register/Login with role (`user` / `admin`)
  - JWT issuance and protected routes
- User dashboard:
  - Service booking form (date/time/location)
  - Auto-filled location
  - Booking status table with badges (`pending`, `confirmed`, `completed`)
- Admin dashboard:
  - Sidebar layout
  - Booking search/filter by status
  - Inline status updates
- UX quality:
  - API loading skeletons
  - Toast notifications
  - Centralized API error handling

## Project Structure

```
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
├── frontend
│   ├── app
│   ├── components
│   └── lib
└── render.yaml
```

## Local Setup

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Configure environment variables:

- `backend/.env` from `backend/.env.example`
- `frontend/.env.local` from `frontend/.env.example`

3. Run both servers:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## API Endpoints (REST)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/bookings` (protected user)
- `GET /api/bookings/my` (protected user)
- `GET /api/admin/bookings` (protected admin)
- `PATCH /api/admin/bookings/:id/status` (protected admin)

## Deployment Notes (Render)

- Use `render.yaml` for service provisioning.
- Set environment variables in Render dashboard.
- Ensure MongoDB Atlas network access allows Render outbound IPs.
