# Future Development Plan: .vscode

## 🚀 Vision

To turn VS Code into a fully integrated Development Environment (IDE) that requires zero setup time for new contributors.

## Phase 1: Advanced Debugging

**Goal**: Enable deep inspection of running services.

- [ ] **Docker Attach**: Configure `launch.json` to attach debugger to running Docker containers.
- [ ] **Log Parsing**: Add tasks to highlight errors in terminal output using Problem Matchers.

## Phase 2: Productivity Boosters

**Goal**: Speed up common development tasks.

- [ ] **Snippets**: Create `restinu.code-snippets` for common patterns (e.g., new React Component, API Route).
- [ ] **Tasks**: Create `tasks.json` for common CLI commands (e.g., `npm run dev`, `docker-compose up`).

## Phase 3: Remote Development

**Goal**: Standardize the OS environment.

- [ ] **Dev Containers**: Create `.devcontainer/devcontainer.json`.
- [ ] **Definition**: Define a Docker image with Node.js, Python, and all dependencies pre-installed.
- [ ] **Codespaces**: Ensure the repo is GitHub Codespaces ready.

## 🛠️ Technical Debt & Maintenance

- [ ] **Audit**: Periodically review `extensions.json` to remove deprecated or unused extensions.
- [ ] **Sync**: Ensure local VS Code settings don't override critical project settings.
