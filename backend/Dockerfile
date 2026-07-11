# Base stage for caching dependencies
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Cache dependencies separately
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Builder stage for compiling TypeScript
FROM base AS builder
COPY . .
RUN bun run build

# Production runner stage
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Copy production node_modules and built assets
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile
COPY --from=builder /app/dist ./dist

# Configure runtime environment
ENV PORT=8000
ENV NODE_ENV=production
EXPOSE 8000

# Start server using Bun
CMD ["bun", "dist/server.js"]
