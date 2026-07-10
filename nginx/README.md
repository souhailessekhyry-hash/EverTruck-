# EverTruck Nginx Reverse Proxy Service (`/nginx`)

This service acts as the edge API gateway and reverse proxy for EverTruck Logistics. It handles all incoming HTTP and HTTPS traffic from the outside world and routes requests securely to internal microservices over the Docker bridge network.

---

## Directory Structure

```
nginx/
├── nginx.conf       # Local development reverse proxy configuration
├── nginx.prod.conf  # Production-optimized reverse proxy configuration for VPS
├── Dockerfile       # Local Docker build
├── Dockerfile.prod  # Production Docker build
└── README.md        # Gateway documentation
```

---

## Architecture & Routing Rules

Nginx listens on ports `80` (HTTP) and `443` (HTTPS) and routes traffic based on URL path prefixes:

| Path Prefix | Target Service | Internal URL | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/*` | **Backend Service** | `http://backend:4000/api/*` | Hono tRPC API endpoints, authentication, logistics engine |
| `/` | **Frontend Service** | `http://frontend:3000/` | React single-page application, static UI, animations |
| `*.js, *.css, *.png...`| **Frontend Service** | `http://frontend:3000/*` | Static media assets with 1-year immutable caching in production |

> [!IMPORTANT]
> **Network Security**: Nginx is the **only** service in the entire Docker Compose stack that exposes ports to the host system. The frontend, backend, PostgreSQL, and Redis containers are completely hidden behind this reverse proxy.

---

## Security Headers Enabled

Both development and production configurations automatically inject industry-standard security headers:
- `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
- `X-XSS-Protection: 1; mode=block` (mitigates cross-site scripting)
- `X-Content-Type-Options: nosniff` (prevents MIME type sniffing)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` (enforces strict origin execution rules)

---

## Performance Optimizations

1. **Gzip Compression**: Compresses HTML, CSS, JavaScript, JSON, and SVG payloads up to 60-80%, significantly reducing page load times over mobile networks.
2. **Static Asset Caching**: In `nginx.prod.conf`, static files (fonts, images, compiled JS/CSS bundles) receive an `expires 1y` header with `Cache-Control: public, max-age=31536000, immutable`.
3. **WebSocket Support**: Configured with `Upgrade` and `Connection 'upgrade'` headers to support Vite Hot Module Replacement (HMR) during local development and real-time WebSocket subscriptions.
