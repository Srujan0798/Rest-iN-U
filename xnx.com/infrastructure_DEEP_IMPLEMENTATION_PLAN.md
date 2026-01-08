# Deep Implementation Plan: Infrastructure

## Goal

Establish a reliable, reproducible, and containerized development environment that mirrors production.

## Phase 1: Environment Setup

**Objective**: Enable containerization tools.

### Review Environment (VERIFIED)

- **Docker**: ❌ **MISSING**. The `docker` command is not recognized.
- **Compose**: ❌ **MISSING**.

### Action

- **CRITICAL**: Install Docker Desktop for Windows.
- Enable WSL 2 (Windows Subsystem for Linux) backend for best performance.
- **Recommendation**: Allocate at least 4GB RAM to Docker.

## Phase 2: Configuration Repair

**Objective**: Fix broken paths in `docker-compose.yml`.

### Review Configuration (VERIFIED)

- **Volume Mapping**: ❌ **BROKEN**.
  - `docker-compose.yml` points to `./docker/nginx/nginx.conf` (Directory Missing).
  - Actual file location appears to be `infrastructure/nginx/nginx.conf`.
  - `postgres` init script also points to missing `./docker/postgres/init.sql`.

### Action

- **Refactor**: Move `infrastructure/` contents to `docker/` OR update `docker-compose.yml` paths to use `infrastructure/`.
- **Standardize**: We recommend renaming `infrastructure` to `docker` to match the compose file, or updating the compose file to reflect reality.
- **Recommendation**: Create a `Makefile` or `package.json` script to simplify startup (e.g., `npm run docker:up`).

## Phase 3: Service Orchestration

**Objective**: Ensure all services spin up correctly.

### Review Services

- **Postgres**: 16-alpine (Good).
- **Redis**: 7-alpine (Good).
- **MinIO**: S3 compatible storage (Good).

### Action

- Run `docker-compose up -d` (After fixing paths).
- Verify health checks for Postgres and Redis.
- **Recommendation**: Use `profiles` to allow starting only required services (e.g., `docker-compose --profile tools up`).

## Phase 4: Cloud Deployment

**Objective**: Sync local config with Render.com.

### Review Deployment

- `render.yaml`: Defines `rest-in-u-backend` and `rest-in-u-ai`.

### Action

- Verify environment variables in Render dashboard match `render.yaml`.
- **Recommendation**: Connect the repo to Render to enable "Infrastructure as Code" deployments.
