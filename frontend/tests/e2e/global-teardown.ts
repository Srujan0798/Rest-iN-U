import { FullConfig } from "@playwright/test";

async function globalTeardown(config: FullConfig) {
  console.log("🧹 Cleaning up E2E test environment...");

  // Optional: Clean up test data, database, etc.
  // For example, you could:
  // - Clear test database
  // - Remove test users
  // - Clean up temporary files

  console.log("✅ E2E test cleanup completed");
}

export default globalTeardown;
