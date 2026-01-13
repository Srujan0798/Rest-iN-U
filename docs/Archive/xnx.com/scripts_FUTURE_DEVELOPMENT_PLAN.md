# Future Development Plan: Scripts

## 🚀 Vision

To evolve the `scripts` directory into a unified, cross-platform CLI tool (`rin-cli`) that manages the entire project lifecycle.

## Phase 1: Cross-Platform CLI

**Goal**: One tool for all OSs.

- [ ] **Migration**: Rewrite core logic in Go or Rust (or Node.js) to compile into a single binary.
- [ ] **Unified Interface**: Replace individual scripts with subcommands (e.g., `rin start`, `rin db reset`).

## Phase 2: Advanced Automation

**Goal**: Automate complex workflows.

- [ ] **Scaffolding**: Add `rin generate component <name>` to create React components with tests and Storybook files.
- [ ] **Seeding**: Create smart seeding scripts that generate realistic mock data using Faker.js.
- [ ] **Benchmarking**: Add `rin benchmark` to run load tests against the API.

## Phase 3: AI Integration

**Goal**: Intelligent assistance.

- [ ] **Error Analysis**: When a script fails, pipe the error to an LLM to suggest a fix.
- [ ] **Code Review**: Add `rin review` to run a local LLM agent against staged changes.

## 🛠️ Technical Debt & Maintenance

- [ ] **Testing**: Write Pester tests for PowerShell scripts.
- [ ] **Deps**: Remove dependency on global tools; verify versions within the script.
- [ ] **Logs**: Centralize script logs to `.logs/` for debugging history.
