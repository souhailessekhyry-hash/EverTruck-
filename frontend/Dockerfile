# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
COPY backend/src /backend/src
COPY backend/contracts /backend/contracts

# Stage 2: Development runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=development

COPY --from=builder /app ./
COPY --from=builder /backend /backend

EXPOSE 3000

CMD ["npm", "run", "dev"]
