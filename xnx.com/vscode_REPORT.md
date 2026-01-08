# Deep Implementation Plan: VS Code

## Goal

Provide a consistent, productive developer experience across the team by standardizing editor configuration and tools.

## Phase 1: Extensions

**Objective**: Ensure all developers have the necessary tools installed.

### Review Extensions

- `extensions.json`: Check for ESLint, Prettier, Python, Tailwind CSS, and GitLens.

### Action

- Add missing recommended extensions.
- Remove deprecated extensions.
- **Recommendation**: Encourage team members to install recommended extensions via the popup.

## Phase 2: Settings

**Objective**: Enforce code style and editor behavior automatically.

### Review Settings

- `settings.json`: Check formatting rules (Format on Save).
- Exclusions: Check `files.exclude` and `search.exclude`.

### Action

- Enable "Format on Save" for all relevant languages.
- Configure default formatters (Prettier for JS/TS, Black/Ruff for Python).
- **Recommendation**: Set `editor.codeActionsOnSave` to auto-fix linting errors.

## Phase 3: Launch Configuration

**Objective**: Simplify debugging for all parts of the stack.

### Review Launch

- `launch.json`: Check configurations for Next.js, Node.js, and Python.

### Action

- Create a "Compound" configuration to start all services at once.
- **Recommendation**: Add configuration for attaching to running Docker containers.
