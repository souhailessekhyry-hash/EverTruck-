# EverTruck Frontend Service (`/frontend`)

This service delivers the interactive user interface for EverTruck Logistics, built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **tRPC**. It features vibrant colors, dark modes, glassmorphism, responsive dashboard layouts, and smooth animations using Framer Motion and GSAP.

---

## Directory Structure

```
frontend/
├── public/          # Static logos, favicon, and illustration assets
├── src/             # Application UI source code
│   ├── components/  # Reusable UI navigation, modals, and layout wrappers
│   ├── pages/       # Route components (Dashboard, Fleet, Blog, Tracking, etc.)
│   ├── providers/   # React Query and tRPC client initialization
│   ├── lib/         # UI utilities and styling helpers
│   ├── App.tsx      # Root application routing tree
│   └── main.tsx     # DOM rendering entry point
├── Dockerfile       # Local development container (Vite dev server on port 3000)
├── Dockerfile.prod  # Production container (compiled static bundle on port 3000)
├── index.html       # HTML entry document
├── tailwind.config.js # Design system tokens and custom animations
└── vite.config.ts   # Vite bundler configuration
```

---

## Architecture & Communication

- **Internal Port**: `3000` (Exposed exclusively inside `evertruck-network`)
- **API Communication**: All backend requests are sent to `/api/trpc/*`, which Nginx transparently proxies to the backend container (`evertruck-backend:4000`).
- **Type Safety**: The tRPC client imports the exact `AppRouter` type definition from `@backend/router`, ensuring end-to-end type safety across network boundaries without duplicating API schemas.

> [!IMPORTANT]
> **No Direct Database Access**: The frontend container never connects to PostgreSQL or Redis directly. It communicates strictly with the Backend API.

---

## Local Development

To run or build the frontend independently outside Docker:

```bash
# Install dependencies
npm install

# Start Vite development server on http://localhost:3000
npm run dev

# Build production bundle into /dist
npm run build

# Preview production build locally
npm run preview
```
