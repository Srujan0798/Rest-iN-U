# Future Development Plan: Doxs (Future `docs`)

## 🚀 Vision

To build a self-organizing, resilient, and universally accessible knowledge base that survives any single platform failure.

## Phase 1: Knowledge Engineering

**Goal**: Structure data for machine readability.

- [ ] **Frontmatter**: Add YAML frontmatter to all files (tags, status, owner).
- [ ] **Schemas**: Define JSON schemas for different doc types (RFCs, ADRs, Guides).
- [ ] **Linting**: Use `markdownlint` to enforce style guides automatically.

## Phase 2: Advanced Search

**Goal**: Find answers instantly.

- [ ] **Algolia**: Index the vault with Algolia for typo-tolerant search.
- [ ] **Semantic Search**: Use vector embeddings to find "related" documents, not just keyword matches.
- [ ] **Graph View**: Visualize dependencies between modules using a force-directed graph.

## Phase 3: Decentralized Storage

**Goal**: "Eternal" preservation.

- [ ] **IPFS**: Pin the entire vault to IPFS for censorship-resistant storage.
- [ ] **Arweave**: Store critical architectural decisions on the Permaweb.
- [ ] **Git Submodule**: Decouple the vault into its own repo for use across multiple projects.

## 🛠️ Technical Debt & Maintenance

- [ ] **Pruning**: Archive completed tasks and obsolete design docs.
- [ ] **Version Control**: Tag documentation releases to match software releases (e.g., `v1.0` docs for `v1.0` app).
