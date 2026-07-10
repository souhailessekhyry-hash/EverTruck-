# EverTruck Backend Service (`/backend`)

This service powers the core API, logistics engine, authentication, and database interactions for EverTruck Logistics. Built on top of **Hono**, **tRPC**, and **Drizzle ORM**, it provides type-safe endpoints for the frontend client while communicating securely with MySQL and Redis.

---

## Directory Structure

```
backend/
├── contracts/       # Shared TypeScript constants, error codes, and interface definitions
├── db/              # Drizzle ORM MySQL schema, relational mappings, and seeding script
├── src/             # Core API application logic
│   ├── boot.ts      # Server entrypoint and Hono HTTP initialization
│   ├── router.ts    # Main tRPC router bundling all feature modules
│   ├── context.ts   # Request context generator (auth session & headers)
│   ├── middleware.ts# tRPC authentication and role-based access control (admin/user)
│   ├── lib/         # Utilities (Redis cache client, environment validation, HTTP client)
│   ├── kimi/        # OAuth authentication and JWT session token handlers
│   └── *-router.ts  # Domain-specific tRPC routers (shipments, vehicles, invoices, etc.)
├── Dockerfile       # Multi-stage Docker build for local orchestration
├── Dockerfile.prod  # Production-optimized multi-stage Docker build for VPS
├── drizzle.config.ts# Drizzle Kit configuration targeting MySQL
└── package.json     # Server dependencies
```

---

## Architecture & Communication

- **Internal Port**: `4000` (Exposed exclusively inside `evertruck-network`)
- **API Base Path**: `/api/trpc/*`
- **Database Connection**: Connects to `evertruck-mysql:3306` via `mysql2` driver using `DATABASE_URL`.
- **Redis Connection**: Connects to `evertruck-redis:6379` via `ioredis` using `REDIS_URL`.

> [!IMPORTANT]
> **Security Rule**: The backend is isolated inside the Docker network. It never exposes port 4000 to the external host directly; all client traffic is routed through the Nginx reverse proxy on `/api/`.

---

## Development & Scripts

To work on the backend service locally (without Docker or inside container):

```bash
# Install dependencies
npm install

# Run development server with live reload
npm run dev

# Generate MySQL migrations after updating db/schema.ts
npm run db:generate

# Push schema directly to database
npm run db:push

# Seed database with test users, vehicles, and shipments
npm run db:seed
```

---

## Redis Caching Support

The backend includes a built-in Redis caching client located at `src/lib/redis.ts`. It provides helper methods for caching database queries, rate limiting, and session verification:

```ts
import { redisClient } from "@/lib/redis";

// Example usage
await redisClient.set("shipment:stats", JSON.stringify(stats), "EX", 300);
const cached = await redisClient.get("shipment:stats");
```
