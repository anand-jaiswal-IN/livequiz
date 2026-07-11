# Base stage for caching dependencies
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Cache dependencies separately
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Builder stage for building Next.js production files
FROM base AS builder
COPY . .

# Pass build-time environment variable arguments for Next.js compilation
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Build the Next.js production bundles
RUN bun run build

# Runner stage
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Copy built assets and runner dependencies
COPY --from=builder /app ./

# Configure runtime environment
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

# Start Next.js server in production
CMD ["bun", "run", "start"]
