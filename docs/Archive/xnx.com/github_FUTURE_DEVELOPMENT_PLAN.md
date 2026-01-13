# Future Development Plan: .github

## 🚀 Vision

To evolve the repository into a fully automated, secure, and community-driven ecosystem.

## Phase 1: Advanced Automation

**Goal**: Automate repetitive tasks beyond basic CI/CD.

- [ ] **Release Drafter**: Automatically generate release notes based on PR labels.
- [ ] **Auto-Merge**: Configure auto-merge for Dependabot PRs that pass CI.
- [ ] **ChatOps**: Implement slash commands (e.g., `/deploy`) in PR comments.

## Phase 2: Security Hardening

**Goal**: Achieve SLSA Level 2+ compliance.

- [ ] **CodeQL**: Enable advanced security queries for JavaScript and Python.
- [ ] **Artifact Signing**: Sign build artifacts (Docker images) using Cosign.
- [ ] **OIDC**: Use OpenID Connect for AWS/Vercel authentication instead of long-lived secrets.

## Phase 3: Community Health

**Goal**: Foster a vibrant open-source community.

- [ ] **Welcome Bot**: Greet new contributors with helpful links.
- [ ] **Contributor Guide**: Expand `CONTRIBUTING.md` with video tutorials.
- [ ] **Discussions**: Enable GitHub Discussions for Q&A.

## 🛠️ Technical Debt & Maintenance

- [ ] **Action Updates**: Automate updates for GitHub Actions versions.
- [ ] **Runner Performance**: Evaluate self-hosted runners for faster builds.
