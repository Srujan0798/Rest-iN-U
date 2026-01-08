# Deep Implementation Plan: .vscode

## Goal

Provide a consistent, productive developer experience across the team by standardizing editor configuration and tools, ensuring every developer has the same baseline environment.

## Phase 1: Extensions

**Objective**: Ensure all developers have the necessary tools installed automatically.

### Review Status

- `extensions.json`: **MISSING**. Currently, developers must manually guess which extensions to install.

### Action

- Create `.vscode/extensions.json`.
- Add recommendations:
  - `dbaeumer.vscode-eslint` (ESLint)
  - `esbenp.prettier-vscode` (Prettier)
  - `ms-python.python` (Python)
  - `bradlc.vscode-tailwindcss` (Tailwind CSS)
  - `eamodio.gitlens` (GitLens)
- **Recommendation**: Commit this file so VS Code prompts new users to install them.

## Phase 2: Settings

**Objective**: Enforce code style and editor behavior automatically.

### Review Status

- `settings.json`: Present but gitignored (likely user-specific).

### Action

- Create a project-level `settings.json` (if not conflicting with personal configs) or document required settings.
- Enable "Format on Save" for `javascript`, `typescript`, `python`.
- Set default formatters (`esbenp.prettier-vscode`).
- **Recommendation**: Commit project-specific settings (e.g., `editor.formatOnSave`: true) to ensure consistency, while ignoring personal preferences (e.g., `window.zoomLevel`).

## Phase 3: Launch Configuration

**Objective**: Simplify debugging for all parts of the stack.

### Review Status

- `launch.json`: **MISSING**. Developers likely run scripts via terminal manually.

### Action

- Create `.vscode/launch.json`.
- Add configurations for:
  - **Next.js: Chrome**: Debug frontend in browser.
  - **Next.js: Server**: Debug server-side rendering.
  - **Python: Flask**: Debug backend API.
- **Recommendation**: Add a "Compound" configuration to start the full stack with one click.
