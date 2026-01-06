# Testing Guide

This project contains a frontend (Next.js) and a backend (Node.js/Express). This guide explains how to run tests for both.

## Frontend Testing

The frontend uses **Jest** with **React Testing Library**.

### Running Tests
To run all frontend tests:
```bash
cd frontend
npm run test
```

### Key Directories
- `frontend/components/__tests__/`: Component unit tests.
- `frontend/app/**/__tests__/`: Page/Feature integration tests.

### Configuration
- `jest.config.js`: Main Jest configuration.
- `jest.setup.js`: Setup file (imports `@testing-library/jest-dom`).

---

## Backend Testing

The backend uses **Vitest** for unit testing and integration testing.

### Running Unit Tests
Unit tests run in isolation with mocked dependencies (Prisma, Redis, etc.). They do not require a running database.

```bash
cd backend
npx vitest run tests/unit
```

### Running Integration Tests
Integration tests (`tests/api.test.ts`) require a **running backend server** and **database**.
Currently, these tests expect the server to be running on `http://localhost:4000`.

To run them (requires local environment setup):
1. Start Redis and Postgres.
2. Run migrations: `npx prisma migrate dev`.
3. Start server: `npm run dev`.
4. Run tests: `npx vitest run tests/api.test.ts`.

**Note:** In CI/CD environments without these services, only run unit tests.

### Key Directories
- `backend/tests/unit/`: Unit tests (Service logic).
- `backend/tests/`: Integration tests.
- `backend/tests/setup.ts`: Global test setup (mocks).
