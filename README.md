# EverTruck Logistics Monorepo 🇲🇦 (EverTruck Logistique SARL)

> **Entreprise Marocaine de Logistique B2B & Transport d'Équipements Professionnels**  
> **Siège Social :** Casablanca Technopark, Route de Nouaceur, Casablanca, Maroc (`Africa/Casablanca`)  
> **Identifiants Légaux Marocains :** ICE: `002984729000045` | RC: `482910` (Casablanca) | IF: `5289104`  
> **Contact :** +212 (0)5 22 89 40 00 | contact@evertruck.ma | Date Format: `DD/MM/YYYY` | Devise: `MAD` (Dirham Marocain)

EverTruck is an advanced, production-ready B2B logistics and corporate fleet management web application specifically tailored to the **Moroccan market and national/international transport operations**. The platform has been architected as a clean, scalable monorepo running on Docker Compose with independent services for Frontend, Backend API, MySQL database, Redis cache, and Nginx reverse proxy.

## Spécialisations Métier & Services Principalement Couverts au Maroc
EverTruck se spécialise dans le transport d'équipements et d'actifs professionnels pour les entreprises publiques et privées :
- **Mobilier de Bureau & Aménagement Corporate (Office Furniture Transportation)** : Transfert sécurisé de postes de travail, tables de réunion, cloisons et fauteuils de bureau sur Casablanca, Rabat et Tanger.
- **Matériel Informatique & Sensible (IT Equipment Transportation)** : Transport d'armoires serveurs, baies informatiques, stations de travail, écrans et matériels réseaux avec camions capitonnés et suspenseurs pneumatiques.
- **Déménagement d'Entreprise (Business Relocation)** : Prise en charge intégrale des transferts de sièges sociaux, agences bancaires et centres d'appels à travers le Royaume.
- **Transport d'Archives & Documents (Archive & Document Transportation)** : Acheminement confidentiel, traçable et scellé de fonds d'archives et dossiers juridiques/comptables.
- **Logistique Corporate & Distribution (Corporate Logistics, Warehousing & Distribution)** : Stockage dans nos plateformes logistiques sécurisées de Casablanca (Sidi Maârouf), Tanger Med Logistics Hub, et Marrakech (Sidi Ghanem).
- **Livraison Sécurisée d'Équipements Professionnels (Secure Delivery)** : Assurance ad-valorem (jusqu'à 5 000 000 MAD) et suivi GPS en temps réel.
- **Transport National & International** : Liaisons quotidiennes entre les grands pôles marocaine (`Casablanca`, `Rabat`, `Tanger Med`, `Marrakech`, `Agadir`, `Fès`, `Oujda`, `Kenitra`) et expéditions internationales (Europe via Tanger Med / Algeciras et Afrique de l'Ouest via Guerguerat).

---

## Architecture Overview

```
evertruck/
├── frontend/             # React 19 + TypeScript + Vite + Tailwind CSS + tRPC Client (MAD / DD/MM/YYYY)
├── backend/              # Hono + tRPC Server + Drizzle ORM + MySQL & Redis Client (TVA 20%, Routes Maroc)
├── database/             # MySQL initialization scripts, migrations, and backups
├── nginx/                # Nginx reverse proxy routing, compression, caching & security
├── docker-compose.yml    # Local development container orchestration
├── docker-compose.prod.yml # Ubuntu VPS production container orchestration
├── .env                  # Root environment variables
└── README.md             # System documentation
```

### Communication Flow
- **Nginx Reverse Proxy**: Receives all incoming HTTP/HTTPS requests on ports `80` and `443`.
  - `/` -> Routed to the `frontend` container (Port 3000).
  - `/api/*` -> Routed to the `backend` container (Port 4000).
- **Frontend**: Communicates **exclusively** with the Backend API over `/api/trpc`. There is zero direct database or cache access from the frontend.
- **Backend**: Communicates exclusively with **MySQL** (Port 3306) for persistent data and **Redis** (Port 6379) for high-speed caching and session checks.
- **Network Isolation**: All containers reside inside a custom Docker bridge network (`evertruck-network`). Only Nginx exposes ports to the external host system.

---

## Containers & Services

| Service | Container Name | Image / Build | Internal Port | External Port | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **nginx** | `evertruck-nginx` | `nginx:1.25-alpine` | 80, 443 | 80, 443 | Reverse proxy, SSL termination, Gzip, security headers |
| **frontend** | `evertruck-frontend` | `node:20-alpine` (multi-stage) | 3000 | None | React UI, Vite static server, animations, responsive layouts |
| **backend** | `evertruck-backend` | `node:20-alpine` (multi-stage) | 4000 | None | Hono API, tRPC router, Drizzle ORM, authentication |
| **mysql** | `evertruck-mysql`| `mysql:8.0` | 3306 | None | Persistent relational database storing fleet, shipments, users |
| **redis** | `evertruck-redis` | `redis:7-alpine` | 6379 | None | High-speed in-memory cache and session store |

---

## Networks & Volumes

### Dedicated Bridge Network
All containers are connected via `evertruck-network`. Containers communicate using DNS service names (`mysql`, `redis`, `backend`, `frontend`). `localhost` is never used inside containers.

### Persistent Named Volumes
- `mysql_data`: Persists all MySQL database tables, migrations, and transaction logs across container restarts.
- `redis_data`: Persists Redis snapshots and cache data across restarts.

---

## Environment Variables

Environment configuration is modularized into dedicated files:
1. **Root (`/.env`)**: Orchestration credentials (`MYSQL_USER`, `MYSQL_PASSWORD`, `REDIS_PASSWORD`).
2. **Backend (`/backend/.env`)**: Server configuration (`PORT=4000`, `DATABASE_URL`, `REDIS_URL`, `APP_ID`, `APP_SECRET`).
3. **Frontend (`/frontend/.env`)**: Client configuration (`VITE_API_URL=/api`, `VITE_APP_TITLE=EverTruck`).

> [!IMPORTANT]
> Never commit actual production passwords or secret keys to version control. Use `.env.production` templates when deploying to your VPS.

---

## Local Development

To start the complete application locally with automated healthchecks and live containers:

```bash
# Build and start all services in detached mode
docker compose up --build -d

# Check container health and status
docker compose ps

# View real-time logs for all services
docker compose logs -f
```

Once started:
- **Web Application**: Access at [http://localhost](http://localhost)
- **API Endpoint**: Access at [http://localhost/api/trpc/ping](http://localhost/api/trpc/ping)

---

## Production Deployment (Ubuntu VPS)

To deploy on a production Ubuntu VPS without modifying source code:

1. Clone the repository onto your VPS:
   ```bash
   git clone https://github.com/yourusername/evertruck.git
   cd evertruck
   ```
2. Configure production environment variables:
   ```bash
   cp .env.production .env
   cp backend/.env.production backend/.env
   cp frontend/.env.production frontend/.env
   ```
3. Launch the production stack using the production Docker Compose configuration:
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

### Production Optimizations Included:
- **Multi-stage Docker builds**: Compiles TypeScript and Vite assets in ephemeral builder stages, copying only production artifacts into minimal alpine runner images.
- **Resource Limits**: Configures memory and CPU constraints for predictable server stability.
- **Automatic Restart Policy**: Configured with `restart: always` on all services.
- **Security Headers & Compression**: Nginx enforces CSP, HSTS, X-Frame-Options, and Gzip compression.

---

## Docker Commands Cheat Sheet

```bash
# Stop all containers without deleting volumes
docker compose down

# Stop and remove containers AND delete persistent database volumes (CAUTION)
docker compose down -v

# Restart only the backend container after a config change
docker compose restart backend

# Execute a shell inside the running MySQL container
docker compose exec mysql mysql -u evertruck -psecurepassword123 evertruck_db

# Run database seed script inside backend container
docker compose exec backend npm run db:seed
```

---

## Troubleshooting

### 1. Database Connection Refused
- **Cause**: Backend container started before MySQL finished initializing.
- **Solution**: The included Docker Compose file uses `condition: service_healthy` to prevent this. If issues persist, check database health:
  ```bash
  docker compose logs mysql
  ```

### 2. Port 80 / 443 Already in Use
- **Cause**: Another service (like Apache or a host Nginx instance) is occupying web ports.
- **Solution**: Stop the conflicting host service or change external port mappings in `docker-compose.yml` (e.g., `8080:80`).

### 3. Permission Errors on Linux/VPS
- **Cause**: Docker volume mount permissions conflicting with non-root container users.
- **Solution**: Ensure volume directories are accessible or let Docker manage named volumes automatically.
