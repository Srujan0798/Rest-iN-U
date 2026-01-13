# Future Development Plan: docs

## 🚀 Vision

To transform static markdown files into an interactive, AI-powered knowledge base.

## Phase 1: Interactive Documentation

**Goal**: Make docs executable and testable.

- [ ] **Runbooks**: Convert deployment guides into executable scripts (Jupyter/Ops).
- [ ] **API Playground**: Embed Swagger UI directly into `API.md` using iframe or custom components.
- [ ] **Mermaid.js**: Use dynamic diagrams that update automatically with code changes.

## Phase 2: Knowledge Graph

**Goal**: Visualize connections between concepts.

- [ ] **Obsidian**: Optimize the Vault for Obsidian.md usage (Graph View).
- [ ] **Backlinks**: Enforce bi-directional linking between related documents (e.g., Feature -> Database Schema).
- [ ] **Tagging**: Implement a strict taxonomy for easier filtering.

## Phase 3: AI Integration

**Goal**: Chat with your documentation.

- [ ] **Embeddings**: Generate vector embeddings for all docs.
- [ ] **Chatbot**: Integrate a "Docs Bot" in VS Code that answers questions based on the Vault.
- [ ] **Auto-Update**: Use LLMs to suggest doc updates when code changes are detected.

## 🛠️ Technical Debt & Maintenance

- [ ] **Linter**: Create a custom linter to enforce the "Universal Domain" naming convention.
- [ ] **Archival**: Automatically move outdated docs to an `_ARCHIVE` folder after 6 months of inactivity.
