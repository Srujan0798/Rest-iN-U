# AI Agent Guidelines

This file contains instructions and context for AI agents working on this repository.

## Vercel Deployment

The project is deployed on Vercel as a monorepo.
*   **Framework Detection:** We explicitly set `framework: "nextjs"` in `vercel.json` to ensure Vercel correctly identifies the frontend application.
*   **Execution Context:** Because of the `framework` setting, Vercel automatically changes the working directory to `frontend/` (if detected) or requires manual configuration. In our setup, we rely on Vercel entering the `frontend` context.
*   **Build Command:** `npm run build` (runs inside `frontend/` context).
*   **Output Directory:** `.next` (relative to `frontend/`).
*   **Warnings:** `vercel.json` includes `"installCommand": "npm install --loglevel=error"` to suppress excessive npm deprecation warnings in the build logs.

## Testing Strategy
...
