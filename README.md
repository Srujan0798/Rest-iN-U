<div align="center">

# 🏡 REST-iN-U

## Where Ancient Wisdom Meets Modern Real Estate

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.13-blue)](https://www.python.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://restinu.com) • [Documentation](./docs) • [API Reference](./API.md) • [Contributing](./CONTRIBUTING.md)

</div>

---

# 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

# 🌟 Overview

REST-iN-U is a revolutionary real estate platform that harmonizes ancient Indian wisdom (Vastu Shastra, Vedic Astrology) with cutting-edge technology (AI/ML, Blockchain, Web3). Built for the modern Indian real estate market with a focus on cultural relevance and technological innovation.

> 📋 **Master Plan**: See [`docs/HYBRID-FINAL.md`](docs/Final%20Plan/HYBRID-FINAL.md) for the complete Phase 1 implementation plan  
> 🤖 **AI Agents**: See [`README_FOR_AI.md`](README_FOR_AI.md) for handover instructions

## 📚 Dev Vault (Single Source of Truth)

The **Dev Vault** is the central knowledge repository for this project. It contains:

- **Universal Domains**: Core architecture (Frontend, Backend, Database, etc.)
- **Specialized Domains**: AI/ML, Blockchain, IoT, etc.
- **Brain**: Checklists, Decision Trees, and System Flows.

👉 **[Access the Dev Vault](./Doxs/Dev%20Vault%20(ETERNAL%20MANUAL))**

> **Note**: The Dev Vault is the **ETERNAL MANUAL**. All code changes must reflect the documentation stored here.

## Key Differentiators

- **AI-Powered Recommendations**: Hybrid ML model (Collaborative + Content-based filtering)
- **Ancient Wisdom Integration**: Vastu Shastra, Vedic Astrology, Feng Shui analysis
- **Computer Vision**: Automated property inspection
- **Market Sentiment Analysis**: Real-time market trend analysis

## 🕉️ Ancient Wisdom

- **Vastu Shastra Analysis**: AI-powered compliance checking
- **Vedic Astrology Matching**: Property-buyer compatibility
- **Feng Shui Integration**: Five elements analysis
- **Muhurat Calculation**: Auspicious timing recommendations

## ⛓️ Blockchain & Web3

- **Property Tokenization**: ERC-721 NFTs for properties
- **Fractional Ownership**: ERC-1155 for shared ownership
- **DAO Governance**: Decentralized property management
- **Smart Contracts**: Automated, transparent transactions

## 📊 Analytics & Insights

- **Real-time Dashboard**: Property performance metrics
- **Market Trends**: Historical and predictive analytics
- **Agent Performance**: Comprehensive tracking and reporting
- **Custom Reports**: Export to PDF/Excel

## 🎥 Virtual Experiences

- **Live Video Tours**: Twilio-powered agent calls
- **3D Walkthroughs**: Interactive property exploration
- **AR Visualization**: Room customization preview
- **Virtual Open Houses**: Scheduled group tours

---

# 🛠️ Tech Stack

## Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion
- **Web3**: RainbowKit, Wagmi, Viem
- **Maps**: Mapbox GL
- **Forms**: React Hook Form + Zod

## Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis (Upstash)
- **Queue**: BullMQ
- **Real-time**: Socket.io
- **AI/ML**: Python (Flask) + scikit-learn

## Blockchain

- **Language**: Solidity 0.8.x
- **Framework**: Hardhat
- **Network**: Polygon (L2)
- **Libraries**: OpenZeppelin

## Infrastructure

- **Frontend Hosting**: Vercel
- **Backend Hosting**: AWS / Railway
- **Database**: Supabase / Neon
- **Storage**: AWS S3 / Cloudinary
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + New Relic

---

# 🚀 Getting Started

## Prerequisites

```bash
Node.js >= 18.0.0
Python >= 3.13
PostgreSQL >= 14
Redis >= 6.0
```

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/Srujan0798/Rest-iN-U.git
cd Rest-iN-U
```

> **Note**: This repository uses standard Git storage. **Git LFS is NOT required**. All files are standard text files.

1. **Install dependencies**

```bash
# Install all workspace dependencies
npm install

# Install Python dependencies
cd backend
pip install -r requirements.txt
```

1. **Environment setup**

```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
# DATABASE_URL, REDIS_URL, etc.
```

1. **Database setup**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed
```

1. **Start development servers**

```bash
# Terminal 1: Frontend
npm run dev:frontend

# Terminal 2: Backend
npm run dev:backend

# Terminal 3: Python AI/ML server
cd backend
python api_server.py
```

1. **Access the application**

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:4000>
- Python AI/ML: <http://localhost:5000>
- API Docs: <http://localhost:4000/docs>

---

# 📁 Project Structure

```
rest-in-u/
├── frontend/                 # Next.js 14 application
│   ├── app/                 # App Router pages (51 routes)
│   ├── components/          # React components (100+)
│   ├── lib/                 # Utilities & config
│   └── public/              # Static assets
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (62 services)
│   │   ├── routes/         # API routes (72 routes)
│   │   └── middleware/     # Auth, validation, etc.
│   ├── ai_ml/              # Python AI/ML module
│   │   ├── recommendation_engine.py
│   │   ├── collaborative_filter.py
│   │   └── routes.py
│   └── prisma/             # Database schema
├── blockchain/             # Smart contracts
│   ├── contracts/          # Solidity contracts
│   ├── scripts/            # Deployment scripts
│   └── test/               # Contract tests
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── screens/        # App screens (7 screens)
│   │   ├── components/     # Reusable components
│   │   └── services/       # API clients
├── docs/                   # Documentation
├── scripts/                # Automation scripts
└── .github/                # GitHub workflows
```

---

# 💻 Development

## Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format

# Run all checks
npm run check
```

## Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Python tests
cd backend
pytest
```

## Database

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

---

# 🧪 Testing

## Test Coverage

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **AI/ML**: pytest (20+ tests)
- **Smart Contracts**: Hardhat + Chai

## Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

# 🚢 Deployment

## Production Build

```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend

# Build all
npm run build
```

## Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Environment Variables

See [.env.example](.env.example) for required environment variables.

---

# 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Standards

- Follow TypeScript/ESLint rules
- Write tests for new features
- Update documentation
- Follow conventional commits

---

# 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# 🙏 Acknowledgments

- Built with ❤️ for the Indian real estate market
- Inspired by Sanatana Dharma principles
- Powered by modern web technologies

---

# 📞 Contact

- **Website**: [restinu.com](https://restinu.com)
- **Email**: <contact@restinu.com>
- **GitHub**: [@Srujan0798](https://github.com/Srujan0798)

---

<div align="center">

**[⬆ back to top](#-rest-in-u)**

Made with ❤️ in India

</div>
