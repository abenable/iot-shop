# Vendure Server Dockerfile
# Using Node.js 24.14.1 (same as local development)
# Based on: https://docs.vendure.io/current/core/deployment/using-docker

FROM node:24-alpine

# Install dependencies required for native modules (bcrypt, etc.)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "start:server"]
