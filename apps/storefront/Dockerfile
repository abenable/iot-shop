# Next.js Storefront Dockerfile
# Multi-stage build for production optimization

# Stage 1: Dependencies
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:24-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables
ARG VENDURE_SHOP_API_URL
ARG VENDURE_CHANNEL_TOKEN
ARG NEXT_PUBLIC_SITE_URL
ARG REVALIDATION_SECRET
ARG NEXT_PUBLIC_DEFAULT_CURRENCY

ENV VENDURE_SHOP_API_URL=${VENDURE_SHOP_API_URL}
ENV VENDURE_CHANNEL_TOKEN=${VENDURE_CHANNEL_TOKEN}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV REVALIDATION_SECRET=${REVALIDATION_SECRET}
ENV NEXT_PUBLIC_DEFAULT_CURRENCY=${NEXT_PUBLIC_DEFAULT_CURRENCY}

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

# Start the application
CMD ["node", "server.js"]
