#!/bin/bash

# IoT Shop Deployment Script
# Usage: ./deploy.sh [command]
# Commands: build, start, stop, restart, logs, migrate, backup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Environment file not found: $ENV_FILE"
        echo "Please copy .env.example to .env and configure your settings:"
        echo "  cp .env.example .env"
        exit 1
    fi
}

build() {
    print_warning "Building Docker images..."
    docker-compose -f $COMPOSE_FILE build
    print_success "Build complete!"
}

start() {
    check_env
    print_warning "Starting IoT Shop services..."
    docker-compose -f $COMPOSE_FILE up -d
    print_success "Services started!"
    echo ""
    echo "Access your applications:"
    echo "  Storefront: http://localhost:3001"
    echo "  Admin:      http://localhost:3000/dashboard"
    echo "  API:        http://localhost:3000/shop-api"
}

stop() {
    print_warning "Stopping services..."
    docker-compose -f $COMPOSE_FILE down
    print_success "Services stopped!"
}

restart() {
    stop
    start
}

logs() {
    echo "Showing logs (Ctrl+C to exit)..."
    docker-compose -f $COMPOSE_FILE logs -f
}

migrate() {
    print_warning "Running database migrations..."
    docker-compose -f $COMPOSE_FILE exec server npx vendure migrate
    print_success "Migrations complete!"
}

populate() {
    print_warning "Populating initial data..."
    docker-compose -f $COMPOSE_FILE exec server npm run populate
    print_success "Data populated!"
}

backup() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="backup_$TIMESTAMP.sql"
    print_warning "Creating database backup: $BACKUP_FILE"
    docker-compose -f $COMPOSE_FILE exec -T database pg_dump -U postgres vendure > "$BACKUP_FILE"
    print_success "Backup created: $BACKUP_FILE"
}

status() {
    echo "Container Status:"
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    echo "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

update() {
    print_warning "Updating application..."
    docker-compose -f $COMPOSE_FILE pull
    docker-compose -f $COMPOSE_FILE build
    docker-compose -f $COMPOSE_FILE up -d
    print_success "Update complete!"
}

# Main command handler
case "${1:-start}" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    migrate)
        migrate
        ;;
    populate)
        populate
        ;;
    backup)
        backup
        ;;
    status)
        status
        ;;
    update)
        update
        ;;
    *)
        echo "IoT Shop Deployment Script"
        echo ""
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  build      Build Docker images"
        echo "  start      Start all services (default)"
        echo "  stop       Stop all services"
        echo "  restart    Restart all services"
        echo "  logs       View service logs"
        echo "  migrate    Run database migrations"
        echo "  populate   Populate initial data"
        echo "  backup     Backup database"
        echo "  status     Check service status"
        echo "  update     Pull and rebuild images"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh build     # Build images"
        echo "  ./deploy.sh start     # Start services"
        echo "  ./deploy.sh logs      # View logs"
        exit 1
        ;;
esac
