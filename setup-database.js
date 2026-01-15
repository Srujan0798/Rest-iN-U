// Database Setup Helper for REST-iN-U
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔧 REST-iN-U Database Setup");
console.log("================================");

// Check if Docker is available
try {
  execSync("docker --version", { stdio: "ignore" });
  console.log("✅ Docker is available");
} catch {
  console.log(
    "❌ Docker is not available. Please install Docker or set up PostgreSQL manually.",
  );
  process.exit(1);
}

// Check Docker Desktop status
try {
  execSync("docker info", { stdio: "ignore" });
  console.log("✅ Docker Desktop is running");
} catch {
  console.log("❌ Docker Desktop is not running. Please start Docker Desktop.");
  process.exit(1);
}

// Create docker-compose for PostgreSQL if it doesn't exist
const dockerComposePath = path.join(__dirname, "docker-compose.dev.yml");
const dockerComposeContent = `
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: restinu-postgres
    restart: always
    environment:
      POSTGRES_DB: restinu_dev
      POSTGRES_USER: restinu
      POSTGRES_PASSWORD: restinu_secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U restinu -d restinu_dev"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: restinu-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
`;

if (!fs.existsSync(dockerComposePath)) {
  fs.writeFileSync(dockerComposePath, dockerComposeContent);
  console.log("✅ Created docker-compose.dev.yml");
}

// Start services
console.log("🚀 Starting PostgreSQL and Redis...");
try {
  execSync(`docker-compose -f ${dockerComposePath} up -d`, {
    stdio: "inherit",
  });
  console.log("✅ Database services started successfully");

  console.log("⏳ Waiting for database to be ready...");
  setTimeout(() => {
    console.log("🎉 Database is ready!");
    console.log("\n📋 Connection Info:");
    console.log("• Host: localhost:5432");
    console.log("• Database: restinu_dev");
    console.log("• User: restinu");
    console.log("• Password: restinu_secret");
    console.log("\n🔧 Next steps:");
    console.log("1. Run: cd backend && npx prisma db push");
    console.log("2. Run: cd backend && npx prisma db seed");
    console.log("3. Run: npm run dev:backend");
  }, 10000);
} catch (error) {
  console.error("❌ Failed to start services:", error.message);
  process.exit(1);
}
