# Production Docker Architecture Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the production Docker architecture for the CS2 Nades Telegram Mini App to correctly implement the desired architecture with proper separation between frontend, backend, and nginx.

**Architecture:** The architecture should separate frontend and backend concerns with Nginx acting as reverse proxy for both static assets and API calls. The structure should be: Browser → Nginx → React/Vite static frontend, Nginx → /api → Express backend, Backend → PostgreSQL.

**Tech Stack:** Docker, Docker Compose, Nginx, Node.js/Express, React/Vite, PostgreSQL

**Spec:** CS2 Nades Telegram Mini App Docker Architecture Requirements

## Global Constraints

- Backend image must only handle backend code
- Frontend image must only build React/Vite static files
- Nginx must proxy frontend and API calls correctly
- Environment variables must not be hardcoded
- Production builds must use `npm run build`, not `npm run dev`
- All services must have proper health checks

## Review Focus

- ✅ Nginx correctly proxies `/api` requests to backend
- ✅ Frontend served by Nginx 
- ✅ Backend and PostgreSQL services work correctly
- ✅ No frontend build in backend image
- ✅ Environment variables properly configured

---

### Task 1: Fix Dockerfile for Production Build

**Files:**
- Modify: `Dockerfile`

**Interfaces:**
- Consumes: None
- Produces: Production-ready backend image

- [ ] **Step 1: Write the failing test**

```bash
# Test that Dockerfile builds correctly for production 
# Run: docker build -t cs2-backend:test .
# Expected: Build succeeds without frontend build steps
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker build -t cs2-backend:test .`
Expected: If there are frontend-related commands in the Dockerfile, expect failure

- [ ] **Step 3: Implement Dockerfile to use production build**

Update `Dockerfile` to:
1. Use `npm run build` instead of `npm run build:server`
2. Remove any frontend build commands
3. Ensure only backend-specific commands exist

- [ ] **Step 4: Run test to verify it passes**

Run: `docker build -t cs2-backend:test .`
Expected: Build succeeds with no frontend build-related commands

- [ ] **Step 5: Commit**

```bash
git add Dockerfile
git commit -m "fix: update Dockerfile to use production build and remove frontend commands"
```

### Task 2: Create Proper Frontend Docker Image

**Files:**
- Create: `frontend.Dockerfile`
- Modify: `docker-compose.yml`

**Interfaces:**
- Consumes: React/Vite frontend source files
- Produces: Nginx-based frontend serving container

- [ ] **Step 1: Write the failing test**

```bash
# Test that frontend Dockerfile builds correctly
# Run: docker build -f frontend.Dockerfile -t cs2-frontend:test .
# Expected: Build succeeds with React/Vite frontend
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker build -f frontend.Dockerfile -t cs2-frontend:test .`
Expected: If frontend.Dockerfile doesn't exist or is incorrect, expect failure

- [ ] **Step 3: Implement frontend.Dockerfile to handle React/Vite build**

Create a proper multi-stage frontend Dockerfile that:
1. Builds React/Vite frontend during build stage
2. Serves it via Nginx in the production stage
3. Exposes port 80

- [ ] **Step 4: Run test to verify it passes**

Run: `docker build -f frontend.Dockerfile -t cs2-frontend:test .`
Expected: Build completes successfully

- [ ] **Step 5: Commit**

```bash
git add frontend.Dockerfile
git commit -m "feat: create proper frontend Dockerfile for React/Vite build and Nginx serving"
```

### Task 3: Fix Nginx Configuration for API Routing

**Files:**
- Modify: `nginx.conf`

**Interfaces:**
- Consumes: API endpoints in backend
- Produces: Correct Nginx proxy configuration

- [ ] **Step 1: Write the failing test**

```bash
# Test Nginx configuration
# Run: docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf nginx:alpine nginx -t
# Expected: Nginx configuration syntax check should pass
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf nginx:alpine nginx -t`
Expected: If there are syntax issues with API routes, expect failure

- [ ] **Step 3: Implement correct Nginx API proxy configuration**

Update `nginx.conf` to:
1. Ensure proper proxying of `/api/` requests to backend
2. Remove any incorrect proxy configurations
3. Ensure proper health checks for frontend and backend

- [ ] **Step 4: Run test to verify it passes**

Run: `docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf nginx:alpine nginx -t`
Expected: Nginx configuration syntax check passes

- [ ] **Step 5: Commit**

```bash
git add nginx.conf
git commit -m "fix: update Nginx configuration for proper API proxying"
```

### Task 4: Update Docker Compose Configuration

**Files:**
- Modify: `docker-compose.yml`

**Interfaces:**
- Consumes: Updated Dockerfiles and Nginx config
- Produces: Complete docker-compose setup

- [ ] **Step 1: Write the failing test**

```bash
# Test docker-compose configuration
# Run: docker compose config
# Expected: No configuration errors
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose config`
Expected: If there are service definitions issues, expect failure

- [ ] **Step 3: Implement proper docker-compose configuration**

Update `docker-compose.yml` to:
1. Use the correct Dockerfile for the backend service
2. Define the frontend service to use the new frontend.Dockerfile
3. Correctly define service dependencies
4. Ensure proper environment variable management
5. Add health checks for all services

- [ ] **Step 4: Run test to verify it passes**

Run: `docker compose config`
Expected: No composition errors

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml
git commit -m "fix: update docker-compose with correct service definitions and health checks"
```

### Task 5: Verify Production Architecture Setup

**Files:**
- Test: Verify all components work correctly

**Interfaces:**
- Consumes: All updated Docker components
- Produces: Validated production setup

- [ ] **Step 1: Write the failing test**

```bash
# Test full docker-compose setup
# Run: docker compose build && docker compose up -d && docker compose ps
# Expected: All containers are running without errors
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose build && docker compose up -d && docker compose ps`
Expected: If any container has startup issues, expect failure

- [ ] **Step 3: Implement verification**

Test the entire architecture by:
1. Running `docker compose build`
2. Running `docker compose up -d`
3. Running `docker compose ps`
4. Verifying that logs don't show startup errors
5. Verifying container health status

- [ ] **Step 4: Run test to verify it passes**

Run: `docker compose build && docker compose up -d && docker compose ps`
Expected: All services running successfully

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml nginx.conf
git commit -m "test: verify production architecture works correctly"
```