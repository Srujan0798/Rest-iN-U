# Dharma Realty 🙏

> Where Ancient Wisdom Meets Modern Real Estate

[![CI/CD](https://github.com/your-repo/dharma-realty/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-repo/dharma-realty/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- **🪷 Vastu Analysis** - 5,000-year-old Vedic principles for home harmony
- **🌍 Climate Prophet** - 100-year flood, fire, and storm projections
- **🔗 Blockchain** - Immutable property records on Polygon
- **📡 IoT Monitoring** - Real-time environmental & energy tracking
- **🏛️ DAO Governance** - Community-owned platform decisions
- **💰 AI Valuation** - Machine learning price estimates
- **📅 Muhurat** - Auspicious timing calculator

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+ (or use Docker)
- Redis 7+ (or use Docker)

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-repo/dharma-realty.git
cd dharma-realty

# Start databases
docker-compose up -d postgres redis

# Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run seed
npm run dev  # → http://localhost:4000

# Frontend (new terminal)
cd frontend
npm install
npm run dev  # → http://localhost:3000
```

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dharmarealty.com | admin123 |
| Agent | agent@dharmarealty.com | agent123 |
| Buyer | buyer@example.com | buyer123 |

## 📁 Project Structure

```
dharma-realty/
├── backend/           # Express + TypeScript API
│   ├── prisma/        # Database schema & migrations
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # Business logic
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── frontend/          # Next.js 14 App Router
│   ├── app/           # Pages & routes
│   ├── components/    # React components
│   ├── lib/           # API client & hooks
│   └── context/       # Auth context
├── nginx/             # Production reverse proxy
└── docker-compose.yml
```

## 🔌 API Endpoints

| Route | Description |
|-------|-------------|
| `/api/v1/auth` | Authentication (JWT) |
| `/api/v1/properties` | Property CRUD |
| `/api/v1/vastu` | Vastu analysis |
| `/api/v1/search` | NLP search |
| `/api/v1/climate` | Climate risk |
| `/api/v1/valuation` | AI pricing |
| `/api/v1/agents` | Agent directory |
| `/api/v1/blockchain` | On-chain records |
| `/api/v1/iot` | Sensor data |
| `/api/v1/dao` | Governance |

API Docs: http://localhost:4000/api/docs

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# With coverage
npm run test:coverage
```

## 🐳 Production Deployment

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 📊 Tech Stack

**Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, Socket.IO

**Frontend:** Next.js 14, React, TypeScript, Zustand, React Query

**Infrastructure:** Docker, Nginx, GitHub Actions

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

Built with 🙏 and ☕ by the Dharma Realty Team
