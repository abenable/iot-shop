# IoT Shop Deployment Guide

## Overview

This guide covers deploying the IoT Shop using Docker. Your local Node.js version is **v24.14.1**, and the Docker setup uses the same version for consistency.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- Domain name (optional but recommended)

## Quick Start

### 1. Clone and Prepare

```bash
git clone <your-repo-url>
cd iot-shop

# Copy environment template
cp .env.example .env

# Edit .env with your production values
nano .env
```

### 2. Build and Run

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access Applications

- **Storefront**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3000/dashboard
- **Shop API**: http://localhost:3000/shop-api
- **Health Check**: http://localhost:3000/health

## Production Deployment

### Option 1: Single Server (Docker Compose)

Best for small to medium shops.

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with production values

# 2. Start services
docker-compose up -d

# 3. Run migrations (first time only)
docker-compose exec server npx vendure migrate

# 4. Populate initial data
docker-compose exec server npm run populate

# 5. View logs
docker-compose logs -f
```

### Option 2: With Nginx Reverse Proxy (Recommended)

For production with SSL and custom domain:

```bash
# 1. Configure nginx/nginx.conf with your domain

# 2. Start with nginx profile
docker-compose --profile with-nginx up -d

# 3. SSL with Let's Encrypt (optional)
# Install certbot and configure certificates
```

### Option 3: Cloud Deployment

#### Railway.app (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### DigitalOcean App Platform
```bash
# Use the Dockerfile and docker-compose.yml
# Connect your GitHub repo to DigitalOcean
# It will auto-deploy on push
```

#### AWS ECS / Google Cloud Run
```bash
# Build and push to container registry
docker build -t iot-shop-server ./apps/server
docker build -t iot-shop-storefront ./apps/storefront

# Deploy to your cloud provider
```

## Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_PASSWORD` | PostgreSQL password | `secure-password` |
| `COOKIE_SECRET` | Session cookie secret | `random-string-32-chars` |
| `SUPERADMIN_PASSWORD` | Admin password | `admin-password` |
| `S3_BUCKET` | R2/S3 bucket name | `iot-shop` |
| `S3_ACCESS_KEY_ID` | R2 access key | `your-key` |
| `S3_SECRET_ACCESS_KEY` | R2 secret key | `your-secret` |

### Database Persistence

Data is stored in Docker volumes:
- `postgres_data`: PostgreSQL database files
- `server_uploads`: Uploaded assets (if not using S3/R2)

**Backup database:**
```bash
docker-compose exec database pg_dump -U postgres vendure > backup.sql
```

**Restore database:**
```bash
docker-compose exec -T database psql -U postgres vendure < backup.sql
```

## Updating the Application

```bash
# Pull latest code
git pull

# Rebuild images
docker-compose build

# Restart services
docker-compose up -d

# Run migrations if needed
docker-compose exec server npx vendure migrate
```

## Monitoring & Health Checks

### Health Endpoints

- **Server**: `GET http://localhost:3000/health`
- **Worker**: `GET http://localhost:3020/health` (if enabled)

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f worker
docker-compose logs -f storefront
```

### Resource Usage

```bash
# Check container stats
docker stats
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs server

# Check environment
docker-compose config
```

### Database connection failed

```bash
# Check database is running
docker-compose ps

# Check database logs
docker-compose logs database
```

### Reset everything (WARNING: deletes all data)

```bash
docker-compose down -v
docker-compose up -d
```

## Security Checklist

- [ ] Change default passwords in `.env`
- [ ] Use strong `COOKIE_SECRET` (32+ random characters)
- [ ] Enable SSL/TLS with Nginx
- [ ] Configure firewall (only ports 80, 443, 3000, 3001)
- [ ] Regular backups of database
- [ ] Keep Docker images updated

## Docker vs Cloudflare Workers

You asked about Docker vs Cloudflare Workers. Here's the recommendation:

### Use Docker (Recommended for this project)

✅ **Why Docker is better for Vendure:**
- Full PostgreSQL database support
- Background job processing (worker)
- File uploads and asset storage
- No execution time limits
- Predictable costs
- Easier local development parity

❌ **Why NOT Cloudflare Workers:**
- No native PostgreSQL support (need external DB)
- 30-second execution limit (problem for background jobs)
- Limited file upload size
- More complex architecture needed

### Best of Both Worlds

Use **Docker for the backend** (Vendure server + database) and **Cloudflare for CDN**:
- Deploy server with Docker to Railway/DigitalOcean
- Use CloudFlare R2 for asset storage ✅ (already configured)
- Use CloudFlare CDN for global asset delivery

## Support

- [Vendure Docker Docs](https://docs.vendure.io/current/core/deployment/using-docker)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
