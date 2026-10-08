# Docker Environment Setup and Troubleshooting

## Overview
This document provides instructions for setting up and troubleshooting the Docker environment for the CS2 Nades Telegram Mini App.

## Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Node.js and npm (for local development)

## Environment Setup

### 1. Environment Variables
The application requires several environment variables. Create a `.env` file in the root directory with the following content:

```
# Database Configuration
DB_HOST=database
DB_USER=postgres
DB_NAME=cs2_nades
DB_PASSWORD=postgres
DB_PORT=5432

# Server Configuration
PORT=3000
NODE_ENV=production

# Telegram Configuration (if needed)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username_here

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Logging Configuration
LOG_LEVEL=info
```

### 2. Docker Compose Setup
The project uses Docker Compose to manage multi-container setup with:
- PostgreSQL database
- Node.js backend service
- Nginx frontend

## Common Issues and Solutions

### Issue 1: Container Fails to Start
**Symptoms:** Containers exit immediately or fail to start

**Solution:**
1. Check container logs with: `docker-compose logs <service-name>`
2. Verify that all environment variables are correctly set
3. Ensure `.env` file exists and is properly formatted

### Issue 2: Database Connection Failures
**Symptoms:** Backend service can't connect to database

**Solution:**
1. Check if database service is healthy: `docker-compose ps`
2. Verify database credentials in `.env` file
3. Ensure `depends_on` relationships in `docker-compose.yml` are correct

### Issue 3: Port Conflicts
**Symptoms:** "Port already in use" errors

**Solution:**
1. Check if ports 3000 (backend) or 5432 (database) are in use
2. Stop conflicting services or update the port mappings
3. Use `docker-compose down` to clean up existing containers

### Issue 4: Health Check Failures
**Symptoms:** Health checks failing in Docker Compose

**Solution:**
1. Check if services are actually responding at the expected endpoints
2. Verify all routes and endpoints are correctly implemented
3. Ensure required dependencies are properly loaded

## Startup Commands

### Start All Services
```bash
docker-compose up --build
```

### Start Services in Background
```bash
docker-compose up -d
```

### View Container Status
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs <service-name>
```

### Clean Up
```bash
docker-compose down
```

## Debugging Steps

1. **Check environment variables**: Verify `.env` file exists and has correct values
2. **Check container logs**: Run `docker-compose logs` for detailed error information
3. **Verify database connection**: Test database connectivity separately
4. **Check port bindings**: Make sure ports are not in use
5. **Validate service health**: Test the health endpoints manually

## Production Considerations

- Always use `.env` files for sensitive data in production
- Implement proper security configurations
- Add monitoring and logging for production services
- Use appropriate resource limits for containers