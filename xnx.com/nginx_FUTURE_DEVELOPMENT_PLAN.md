# Future Development Plan: Nginx

## 🚀 Vision

To deliver content to any user, anywhere in the world, in under 100ms.

## Phase 1: Global CDN

**Goal**: Cache content at the edge.

- [ ] **Cloudflare**: Put Nginx behind Cloudflare for DDoS protection and edge caching.
- [ ] **Geo-Routing**: Route users to the nearest backend server based on IP.

## Phase 2: Zero Trust Networking

**Goal**: Never trust, always verify.

- [ ] **mTLS**: Implement mutual TLS between Nginx and Backend services.
- [ ] **OIDC**: Offload authentication to Nginx using `auth_request` module (e.g., validate JWTs at the gateway).

## Phase 3: Advanced Traffic Management

**Goal**: Canary deployments and A/B testing.

- [ ] **Split Traffic**: Route 5% of traffic to `backend-v2` for canary testing.
- [ ] **Mirroring**: Mirror production traffic to a staging environment for realistic load testing.
- [ ] **Lua Scripting**: Use OpenResty/Lua for complex routing logic (e.g., dynamic rate limiting based on user tier).

## 🛠️ Technical Debt & Maintenance

- [ ] **Log Analysis**: Ship access logs to ELK Stack/Datadog for analysis.
- [ ] **Rotation**: Automate log rotation to prevent disk overflow.
- [ ] **Version**: Keep Nginx Docker image updated to the latest stable alpine tag.
