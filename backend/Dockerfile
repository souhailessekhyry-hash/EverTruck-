# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

# Stage 2: Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backenduser

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./

# Copy .env so dotenv/config can load DATABASE_URL for drizzle-kit
COPY backend/.env ./.env

USER backenduser
EXPOSE 4000

CMD ["sh", "-c", "npx drizzle-kit push && npx tsx db/seed.ts && npm start"]
