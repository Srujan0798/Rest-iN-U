<div align="center">

# 🏡 REST-iN-U

## Where Ancient Wisdom Meets Modern Real Estate Technology

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.13-blue)](https://www.python.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-lightgrey)](https://docs.soliditylang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Status](https://img.shields.io/badge/Status-Active%20Development-success)]()

[🌐 Live Demo](https://restinu.com) • [📚 Documentation](./docs) • [🔗 API Reference](./docs) • [🤝 Contributing](./CONTRIBUTING.md) • [📋 Master Plan](./.claude/MASTER_PLAN.md)

</div>

---

## 📖 Table of Contents

- [🌟 What is REST-iN-U?](#-what-is-rest-in-u)
- [✨ Key Features](#-key-features)
- [🎯 The Unique Moat](#-the-unique-moat)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [💻 Development Guide](#-development-guide)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🤖 AI Agent System](#-ai-agent-system)
- [📊 Features Deep Dive](#-features-deep-dive)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact & Community](#-contact--community)

---

## 🌟 What is REST-iN-U?

**REST-iN-U** is a revolutionary real estate platform that harmonizes **ancient Indian wisdom** (Vastu Shastra, Vedic Astrology, Sanatana Dharma principles) with **cutting-edge modern technology** (AI/ML, Blockchain, Web3, IoT). 

Built specifically for the Indian real estate market, REST-iN-U goes beyond traditional property search engines by:

- 🕉️ Integrating traditional wisdom (Vastu, Jyotish) as a core differentiator
- 🤖 Leveraging AI/ML for intelligent property recommendations
- ⛓️ Utilizing blockchain for transparent, secure transactions
- 🌏 Serving the unique needs of property buyers who value both modern AND traditional approaches
- 📊 Providing comprehensive analytics and market insights

> **Target Market**: Indian real estate buyers, investors, and real estate agents seeking data-driven insights combined with traditional wisdom.

---

## ✨ Key Features

### 🏠 **ESTATE Mode** - Modern Property Discovery

- **AI-Powered Search**: Intelligent property recommendations using hybrid ML models
- **Advanced Filtering**: Location, price, amenities, developer, legal status
- **Market Analytics**: Real-time trends, price predictions, ROI analysis
- **3D Walkthroughs**: Interactive property visualization
- **Live Property Tours**: Video calls with agents via Twilio integration
- **Property Comparison**: Side-by-side analysis of multiple properties
- **Market Insights**: Historical trends, neighborhood analysis, future predictions

### 🕉️ **INDU Mode** - Ancient Wisdom Integration ⭐ THE MOAT

- **Vastu Shastra Analysis**: 
  - AI-powered compliance checking against Vastu principles
  - Detailed recommendations for property improvements
  - 360-degree Vastu scoring system
  
- **Vedic Astrology Matching**:
  - Property-buyer compatibility analysis
  - Auspicious timing recommendations
  - Nakshatra-based matching
  
- **Muhurat Calculations**:
  - Auspicious dates for property purchase
  - Planetary influence analysis
  - Customized recommendations based on birth chart

- **Feng Shui Integration**:
  - Five elements analysis
  - Energy flow assessment
  - Directional guidance

### ⛓️ **WEB3 Mode** - Blockchain & Decentralization

- **Property Tokenization**: ERC-721 NFTs for property ownership records
- **Fractional Ownership**: ERC-1155 for shared property investments
- **DAO Governance**: Decentralized property management decisions
- **Smart Contracts**: Automated, transparent transactions
- **On-Chain Verification**: Immutable property records and history
- **Web3 Wallet Integration**: Seamless crypto transactions

### 📊 **Analytics Dashboard**

- **Real-time Metrics**: Property performance, market trends, agent stats
- **Custom Reports**: Export to PDF/Excel with comprehensive analysis
- **Performance Tracking**: Agent activity, conversion rates, ROI metrics
- **Market Sentiment**: AI-driven market trend analysis
- **Portfolio Management**: Track multiple property investments

### 🎥 **Virtual Experiences**

- **Live Video Tours**: Twilio-powered agent consultations
- **3D Walkthroughs**: Interactive room-by-room exploration
- **AR Visualization**: Preview room customization in AR
- **Virtual Open Houses**: Scheduled group property tours
- **Recording & Playback**: Review tours at your convenience

### 🔐 **Trust & Verification**

- **Digital Signatures**: DocuSign integration for legal documents
- **Secure Payments**: Stripe integration for safe transactions
- **Legal Compliance**: Automated RERA compliance checking
- **Risk Assessment**: AI-powered legal risk analysis
- **Document Vault**: Secure storage for all property documents

---

## 🎯 The Unique Moat

REST-iN-U's competitive advantage lies in the **unique integration of Dharma-based wisdom with modern technology**:

| Aspect | Traditional Apps | REST-iN-U |
|--------|-----------------|-----------|
| **Search** | Basic filters only | AI recommendations + Vastu analysis |
| **Analysis** | Price/Location only | + Astrological compatibility + Feng Shui |
| **Trust** | Generic data | Verified + Blockchain records |
| **Cultural Fit** | Western approach | Indian wisdom + Modern tech |
| **Target** | Generic users | Dharma-conscious buyers + Tech-savvy investors |

### Why This Matters

- **65% of Indian real estate buyers** consider traditional wisdom important in purchase decisions (industry research)
- **No existing competitors** combine ancient wisdom with modern technology at scale
- **Premium market positioning**: Buyers willing to pay more for comprehensive analysis
- **Recurring revenue potential**: Astrology/Vastu consultations, property verification services

---

## 🏗️ Architecture Overview

### Three-Mode Platform Architecture

```
┌─────────────────────────────────────────────────────┐
│          REST-iN-U Platform (Next.js 14)             │
├──────────────────┬──────────────────┬────────────────┤
│   ESTATE Mode    │    INDU Mode     │   WEB3 Mode    │
│  (Traditional)   │  (Wisdom-Based)  │  (Blockchain)  │
├──────────────────┴──────────────────┴────────────────┤
│                                                      │
│         🤖 AI Agent Swarm (14 Agents)               │
│  ┌────────────────────────────────────────────────┐ │
│  │ • Swarm Conductor (Orchestration)              │ │
│  │ • Discovery Agents (3): Scout, Lifestyle, etc. │ │
│  │ • Valuation Agents (2): Oracle, Prophet        │ │
│  │ • Risk Agents (3): Sentinel, Legal, RERA       │ │
│  │ • Dharma Agents (3): Vastu, Jyotish, Muhurat  │ │
│  │ • Transaction Agents (2): Negotiation, Finance │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Backend (Express + Node.js) + Python ML Service    │
│  Database (PostgreSQL + Redis) + Blockchain (RPC)   │
└──────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → AI Agents Process → Multiple Analysis Pipelines → Results
             ├─ ESTATE: Market Analysis
             ├─ INDU: Dharma Analysis  
             └─ WEB3: Blockchain Verification
```

---

## 🛠️ Tech Stack

### 🎨 Frontend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js 14** | React framework with App Router | ^14.0 |
| **TypeScript** | Type-safe JavaScript | ^5.3 |
| **Tailwind CSS** | Utility-first styling | ^3.3 |
| **Zustand** | State management | Latest |
| **React Query** | Server state management | Latest |
| **Framer Motion** | Complex animations | Latest |
| **React Hook Form** | Form handling | Latest |
| **Zod** | Schema validation | ^3.22 |
| **RainbowKit + Wagmi** | Web3 wallet integration | Latest |
| **Mapbox GL** | Interactive maps | Latest |
| **Radix UI** | Accessible components | Latest |

### 🔧 Backend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime | >=18.0.0 |
| **Express.js** | API framework | ^4.18 |
| **TypeScript** | Type safety | ^5.3 |
| **Prisma ORM** | Database ORM | ^5.7 |
| **PostgreSQL** | Primary database | >=14 |
| **Redis** | Caching & queues | >=6.0 |
| **BullMQ** | Job queue processing | ^4.12 |
| **Socket.io** | Real-time communication | ^4.7 |
| **Stripe** | Payments | ^14.14 |
| **Twilio** | Video calls & SMS | ^5.11 |
| **AWS S3** | File storage | Via SDK |
| **Swagger/OpenAPI** | API documentation | ^6.2 |

### 🐍 AI/ML Pipeline

| Technology | Purpose |
|-----------|---------|
| **Python 3.13** | ML runtime |
| **Flask** | Web service |
| **scikit-learn** | ML algorithms |
| **YOLOv8** | Computer vision |
| **astronomy-engine** | Astrology calculations |
| **pandas & NumPy** | Data processing |
| **TensorFlow** | Deep learning (planned) |

### ⛓️ Blockchain

| Technology | Purpose | Network |
|-----------|---------|---------|
| **Solidity 0.8.x** | Smart contracts | EVM-compatible |
| **Hardhat** | Development framework | - |
| **OpenZeppelin** | Secure contracts | Latest |
| **Polygon** | Blockchain network | L2 Solution |
| **Ethers.js** | Blockchain interaction | ^6.9 |

### 🚀 Infrastructure & DevOps

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting & CDN |
| **AWS / Railway** | Backend hosting |
| **Supabase / Neon** | Managed PostgreSQL |
| **Upstash** | Managed Redis |
| **Docker & Docker Compose** | Containerization |
| **GitHub Actions** | CI/CD pipelines |
| **Sentry** | Error tracking |
| **New Relic** | Performance monitoring |

---

## 📁 Project Structure

```
rest-in-u/
├── .claude/                          # 🤖 AI Agent & Dev Vault (Documentation Hub)
│   ├── MASTER_PLAN.md              # Complete consolidated plan
│   ├── 1-planning/                 # Strategic planning
│   ├── 2-deployment/               # Deployment guides
│   ├── 3-agents/                   # AI Agent specifications (14 agents)
│   ├── 4-development/              # Developer specs
│   ├── 5-operations/               # Infrastructure & monitoring
│   ├── 6-leadership/               # Executive documentation
│   ├── 7-research/                 # Research & analysis
│   └── 8-guides/                   # How-to guides & tutorials
│
├── frontend/                         # 🎨 Next.js 14 Web Application
│   ├── src/
│   │   ├── app/                   # App Router pages (51 routes)
│   │   │   ├── (auth)/            # Authentication pages
│   │   │   ├── dashboard/         # User dashboard
│   │   │   ├── property/          # Property pages
│   │   │   ├── admin/             # Admin panels
│   │   │   └── ...
│   │   ├── components/            # React components (100+)
│   │   │   ├── ui/                # Base UI components
│   │   │   ├── layout/            # Layout components
│   │   │   ├── property/          # Property-specific components
│   │   │   ├── vastu/             # Vastu analysis UI
│   │   │   └── ...
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utilities & helpers
│   │   ├── services/              # API clients & integrations
│   │   │   ├── api.ts             # Main API client
│   │   │   └── integrations/      # Stripe, Twilio, etc.
│   │   ├── store/                 # Zustand state stores
│   │   ├── types/                 # TypeScript type definitions
│   │   └── styles/                # Global styles & themes
│   ├── public/                    # Static assets
│   ├── .env.example               # Environment template
│   ├── next.config.js             # Next.js configuration
│   └── package.json               # Frontend dependencies
│
├── backend/                         # 🔧 Express.js REST API
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   ├── services/              # Business logic (62+ services)
│   │   │   ├── property/          # Property management
│   │   │   ├── user/              # User management
│   │   │   ├── vastu/             # Vastu analysis service
│   │   │   ├── jyotish/           # Astrology service
│   │   │   ├── payment/           # Payment handling
│   │   │   └── ...
│   │   ├── routes/                # API routes (72+ endpoints)
│   │   ├── middleware/            # Auth, validation, error handling
│   │   ├── models/                # Data models & schemas
│   │   └── utils/                 # Helper functions
│   │
│   ├── ai_ml/                     # 🐍 Python AI/ML Module
│   │   ├── recommendation_engine.py
│   │   ├── collaborative_filter.py
│   │   ├── vastu_analyzer.py
│   │   ├── jyotish_matcher.py
│   │   ├── market_sentiment.py
│   │   └── api_server.py          # Flask server
│   │
│   ├── prisma/                    # 📊 Database
│   │   ├── schema.prisma          # Data schema
│   │   ├── migrations/            # DB migrations
│   │   └── seed.ts                # Database seeding
│   │
│   ├── .env.example               # Environment template
│   └── package.json               # Backend dependencies
│
├── blockchain/                      # ⛓️ Solidity Smart Contracts
│   ├── contracts/                 # Smart contracts
│   │   ├── PropertyNFT.sol        # ERC-721 property tokens
│   │   ├── FractionalNFT.sol      # ERC-1155 fractional ownership
│   │   ├── PropertyDAO.sol        # DAO governance
│   │   └── ...
│   ├── scripts/                   # Deployment scripts
│   ├── test/                      # Contract tests
│   ├── hardhat.config.ts          # Hardhat configuration
│   └── package.json               # Blockchain dependencies
│
├── mobile/                          # 📱 React Native App (Coming Soon)
│   ├── src/
│   │   ├── screens/               # App screens (7+ screens)
│   │   ├── components/            # Reusable components
│   │   ├── services/              # API clients
│   │   └── navigation/            # App navigation
│   └── package.json
│
├── infrastructure/                  # 🏗️ Infrastructure as Code
│   ├── docker-compose.yml         # Local dev environment
│   ├── docker-compose.prod.yml    # Production environment
│   ├── nginx/                     # Nginx configuration
│   └── kubernetes/                # K8s configs (optional)
│
├── docs/                            # 📚 Documentation
│   ├── API.md                     # API documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── ARCHITECTURE.md            # Architecture documentation
│   └── ...
│
├── scripts/                         # 🔧 Utility Scripts
│   ├── setup-database.js          # Database setup
│   ├── test-api.js                # API testing
│   └── ...
│
├── .github/                         # 🔄 GitHub Workflows
│   ├── workflows/
│   │   ├── ci.yml                 # CI/CD pipeline
│   │   ├── deploy.yml             # Deployment workflow
│   │   └── ...
│   └── ISSUE_TEMPLATE/            # Issue templates
│
├── .env.example                     # Root environment template
├── docker-compose.yml              # Complete dev stack
├── package.json                    # Monorepo root
├── pnpm-workspace.yaml             # PNPM workspace config
├── CONTRIBUTING.md                 # Contributing guidelines
├── CHANGELOG.md                    # Version history
├── LICENSE                         # MIT License
└── README.md                       # 👈 You are here
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have installed:

```bash
# Required
Node.js >= 18.0.0      # Runtime
Python >= 3.13         # ML/AI services
PostgreSQL >= 14       # Database
Redis >= 6.0          # Caching
pnpm >= 8.0           # Package manager (recommended)

# Optional (for blockchain)
Hardhat               # Smart contract development

# Optional (for cloud deployment)
Docker & Docker Compose
AWS CLI / Railway CLI
```

Check versions:
```bash
node --version
python --version
psql --version
redis-cli --version
pnpm --version
```

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/Srujan0798/Rest-iN-U.git
cd Rest-iN-U
```

> **Note**: This repository uses standard Git storage. **Git LFS is NOT required**. All files are standard text files.

#### 2. Install Dependencies

```bash
# Install root dependencies
pnpm install

# Install all workspace packages (frontend, backend, blockchain)
pnpm install --recursive

# Install Python dependencies
cd backend
pip install -r requirements.txt
cd ..
```

#### 3. Environment Configuration

```bash
# Copy environment templates
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit configuration files with your credentials
nano .env
nano frontend/.env.local
nano backend/.env
```

**Key environment variables to configure:**
- Database URL (PostgreSQL)
- Redis URL
- API keys (Google Maps, Stripe, Twilio, etc.)
- JWT secrets (change from defaults!)
- Third-party service credentials

See `.env.example` for complete list.

#### 4. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data (optional)
npm run seed

# Open Prisma Studio to view data (optional)
npx prisma studio
```

#### 5. Start Development Servers

Open multiple terminals and run:

```bash
# Terminal 1: Frontend (http://localhost:3000)
cd frontend
pnpm dev

# Terminal 2: Backend API (http://localhost:4000)
cd backend
npm run dev

# Terminal 3: Python AI/ML Server (http://localhost:5000)
cd backend
python ai_ml/api_server.py

# Terminal 4: Redis (if not running as service)
redis-server
```

#### 6. Access the Application

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Web application |
| **Backend API** | http://localhost:4000 | REST API |
| **API Docs** | http://localhost:4000/docs | Swagger/OpenAPI |
| **Python ML** | http://localhost:5000 | AI/ML services |
| **Prisma Studio** | http://localhost:5555 | Database GUI |
| **Redis** | localhost:6379 | Cache/Queue |

### Docker Setup (Alternative)

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 💻 Development Guide

### Code Quality & Standards

```bash
# Lint all code
pnpm run lint

# Fix linting errors
pnpm run lint:fix

# Type checking
pnpm run typecheck

# Format code
pnpm run format

# Run all checks
pnpm run check
```

### Project Commands

```bash
# Development
pnpm dev                 # Start all dev servers
pnpm dev:frontend        # Frontend only
pnpm dev:backend         # Backend only

# Building
pnpm build              # Build all workspaces
pnpm build:frontend     # Build frontend
pnpm build:backend      # Build backend

# Testing (see Testing section)
pnpm test               # Run all tests
pnpm test:watch         # Watch mode

# Database
pnpm migrate            # Run Prisma migrations
pnpm seed               # Seed database
```

### Database Workflow

```bash
# Create a new migration
cd backend
npx prisma migrate dev --name add_new_feature

# Review changes
npx prisma studio

# Reset database (⚠️ Warning: Deletes all data)
npx prisma migrate reset

# Generate updated Prisma client
npx prisma generate
```

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Sync with main
git fetch origin
git rebase origin/main

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 🧪 Testing

### Test Coverage

| Layer | Framework | Coverage |
|-------|-----------|----------|
| **Frontend** | Jest + React Testing Library | 70%+ |
| **Backend** | Jest + Supertest | 75%+ |
| **AI/ML** | pytest | 80%+ (20+ tests) |
| **Smart Contracts** | Hardhat + Chai | 85%+ |
| **E2E** | Playwright | Key user flows |

### Running Tests

```bash
# All tests
pnpm test

# Frontend tests
pnpm test:frontend
pnpm test:frontend:watch

# Backend tests
pnpm test:backend
pnpm test:backend:watch

# E2E tests
pnpm test:e2e
pnpm test:e2e:ui       # With Playwright UI

# Coverage reports
pnpm test:coverage
```

### Python ML Tests

```bash
cd backend

# Run all Python tests
pytest

# With coverage
pytest --cov

# Specific test file
pytest tests/test_vastu_scoring.py -v

# Watch mode
pytest-watch
```

### Writing Tests

**Frontend Example:**
```typescript
// components/PropertyCard.test.tsx
import { render, screen } from '@testing-library/react';
import PropertyCard from './PropertyCard';

describe('PropertyCard', () => {
  it('displays property information', () => {
    const mockProperty = { id: '1', title: 'Luxury Apartment' };
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
  });
});
```

---

## 🚢 Deployment

### Production Build

```bash
# Build all workspaces
pnpm build

# Build individually
pnpm build:frontend    # Creates .next/
pnpm build:backend     # Creates dist/
```

### Deployment Options

#### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend to Vercel:**
```bash
# Connect GitHub repo in Vercel dashboard
# Automatic deployments on push to main branch
```

**Backend to Railway:**
```bash
# Push Docker image or connect GitHub repo
# Set environment variables in Railway dashboard
# Auto-deploy on push to main
```

#### Option 2: Docker Deployment

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

#### Option 3: Manual Deployment

**Frontend:**
```bash
cd frontend
pnpm build
pnpm start         # Runs on port 3000
```

**Backend:**
```bash
cd backend
npm run build
npm run start:prod # Runs on port 4000
```

### Production Checklist

- [ ] Environment variables configured for production
- [ ] Database backups enabled
- [ ] Redis caching configured
- [ ] SSL/TLS certificates installed
- [ ] CORS policies configured
- [ ] Rate limiting enabled
- [ ] Error monitoring (Sentry) set up
- [ ] Performance monitoring (New Relic) enabled
- [ ] Automated backups scheduled
- [ ] CI/CD pipeline tested
- [ ] Security audit completed

---

## 🤖 AI Agent System

REST-iN-U features a sophisticated **14-Agent Swarm** architecture for handling complex real estate decisions:

### Agent Architecture

```
🎭 Swarm Conductor (Orchestrator)
├─ 🔍 Discovery Agents (3)
│  ├─ Scout Agent: Property discovery & initial screening
│  ├─ Lifestyle Agent: Neighborhood & lifestyle matching
│  └─ Neighborhood Agent: Community analysis
│
├─ 💰 Valuation Agents (2)
│  ├─ Oracle Agent: Current market valuation
│  └─ Prophet Agent: Future price prediction
│
├─ ⚠️ Risk Agents (3)
│  ├─ Sentinel Agent: Legal risk assessment
│  ├─ Legal Agent: Document & contract review
│  └─ RERA Agent: Regulatory compliance checking
│
├─ 🕉️ Dharma Agents (3) ⭐ UNIQUE
│  ├─ Vastu Agent: Vastu Shastra compliance analysis
│  ├─ Jyotish Agent: Vedic astrology matching
│  └─ Muhurat Agent: Auspicious timing recommendations
│
└─ 💳 Transaction Agents (2)
   ├─ Negotiation Agent: Price negotiation strategy
   └─ Finance Agent: Loan & investment recommendations
```

### Agent Capabilities

Each agent:
- Processes specific aspects of property analysis
- Communicates with other agents via message queue
- Maintains state in Redis for coordination
- Provides detailed reasoning for decisions
- Integrates with external services as needed

### Using AI Agents

The agents operate transparently in the background. Users receive:

1. **Initial Property Screening** (Scout + Sentinel)
2. **Comprehensive Analysis** (All agents process in parallel)
3. **Unified Recommendations** (Conductor combines results)
4. **Detailed Report** (User-friendly visualization)

See [.claude/3-agents/00-AGENT_INDEX.md](./.claude/3-agents/00-AGENT_INDEX.md) for detailed agent specifications.

---

## 📊 Features Deep Dive

### 🔍 Intelligent Search & Discovery

**Hybrid Recommendation Engine:**
- Collaborative filtering (user behavior patterns)
- Content-based filtering (property characteristics)
- Collaborative + Content hybrid model
- Real-time personalization

```python
# Example: Getting recommendations
GET /api/v1/properties/recommendations?userId=xxx&count=10
```

### 📈 Market Analysis

**Advanced Analytics:**
- Price trend analysis (30-year historical data)
- Appreciation predictions (ML-powered forecasting)
- Neighborhood growth indicators
- ROI calculations
- Market sentiment analysis

### 🏠 Vastu Shastra Integration

**Vastu Scoring System:**
- 360-degree property analysis
- 50+ Vastu parameters checked
- Compliance percentage scoring
- Detailed improvement recommendations
- Certified by Vastu experts

```json
{
  "vastuScore": 78,
  "positives": ["North-facing", "Open balcony", "Good ventilation"],
  "negatives": ["Kitchen in southwest", "Bathroom near entrance"],
  "recommendations": [...]
}
```

### ⭐ Vedic Astrology Matching

**Astrological Compatibility:**
- Birth chart analysis
- Nakshatra matching
- Planetary influence assessment
- Muhurat calculation (auspicious dates)
- Personal compatibility scores

### 💎 Blockchain Integration

**Smart Contracts:**
- Property tokenization (ERC-721)
- Fractional ownership (ERC-1155)
- Automated transactions
- Transparent escrow
- Immutable records

### 📞 Video & Communication

**Twilio Integration:**
- HD video property tours
- Real-time agent communication
- Screen sharing capabilities
- Recording for playback
- Automatic call routing

### 💳 Payment & Subscription

**Stripe Integration:**
- Secure payment processing
- Subscription management
- Invoice generation
- Multiple payment methods
- PCI compliance

---

## 🤝 Contributing

We welcome contributions from developers, designers, and enthusiasts! 

### How to Contribute

1. **Fork the repository** - Click the fork button on GitHub
2. **Create a feature branch** - `git checkout -b feature/amazing-feature`
3. **Make your changes** - Follow our [code standards](CONTRIBUTING.md#style-guidelines)
4. **Commit with conventional messages** - `git commit -m 'feat: add amazing feature'`
5. **Push to your branch** - `git push origin feature/amazing-feature`
6. **Open a Pull Request** - Submit your PR with a clear description

### Contribution Areas

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **Features**: Implement new functionality
- 📚 **Documentation**: Improve guides and docs
- 🧪 **Tests**: Increase test coverage
- 🎨 **UI/UX**: Design improvements
- ⚡ **Performance**: Optimize code
- 🔒 **Security**: Security improvements

### Development Workflow

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Detailed setup instructions
- Code standards & conventions
- Commit message format
- PR requirements
- Testing guidelines

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript Vue Plugin
- Tailwind CSS IntelliSense
- GitLens
- REST Client
- Thunder Client

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ⚠️ Liability: No warranty provided
- ⚠️ Notice: License and copyright notice required

---

## 📞 Contact & Community

### Get in Touch

- **🌐 Website**: [restinu.com](https://restinu.com)
- **📧 Email**: [contact@restinu.com](mailto:contact@restinu.com)
- **🐙 GitHub**: [@Srujan0798](https://github.com/Srujan0798)
- **💬 GitHub Discussions**: [Ask questions & share ideas](https://github.com/Srujan0798/Rest-iN-U/discussions)
- **🐛 Issues**: [Report bugs & request features](https://github.com/Srujan0798/Rest-iN-U/issues)

### Follow the Project

- ⭐ Star the repository to show support
- 👁️ Watch for updates and announcements
- 🔔 Enable notifications for releases
- 📢 Share with others interested in real estate tech

### Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Search for existing issues before creating new ones
- Share knowledge and help others
- Follow the [Code of Conduct](CONTRIBUTING.md#code-of-conduct)

---

## 🎯 Project Roadmap

### Current Status: Phase 1 (90% Complete) ✅

- ✅ Core platform infrastructure
- ✅ ESTATE Mode (fully functional)
- ✅ Dharma Agents (Vastu, Jyotish, Muhurat) - THE MOAT
- ⚠️ Additional Agents (8/14 implemented)
- ⏳ INDU Mode UI refinement
- ⏳ WEB3 Mode (Smart contracts ready, UI in progress)

### Phase 2 (Q2 2026) 📅

- [ ] Mobile app (React Native)
- [ ] IoT integration (smart property devices)
- [ ] Advanced AI (LLM-powered agents)
- [ ] DAO governance UI
- [ ] Advanced analytics dashboard

### Phase 3 (Q3 2026) 🔮

- [ ] International expansion
- [ ] Multi-language support
- [ ] Augmented Reality features
- [ ] Metaverse property tours
- [ ] Integration with real estate partners

---

## 🙏 Acknowledgments

REST-iN-U is built with love for India's real estate market and stands on the shoulders of:

- **Vastu Shastra**: Ancient Indian architecture & design principles
- **Vedic Astrology (Jyotish)**: Classical system of Indian astrology
- **Sanatana Dharma**: Eternal principles underlying Indian wisdom
- **Modern Technology**: Next.js, Express, Polygon, and the open-source community
- **Contributors**: All developers and maintainers who make this possible

---

## 📊 Project Statistics

```
📝 Codebase
  ├─ Frontend: ~50+ components, 51 routes
  ├─ Backend: 62+ services, 72+ API endpoints
  ├─ Blockchain: 8+ smart contracts
  └─ AI/ML: 20+ test cases, 5+ ML models

🧪 Testing
  ├─ Frontend Coverage: 70%+
  ├─ Backend Coverage: 75%+
  ├─ E2E Tests: Key user flows
  └─ Smart Contract Audit: In progress

📦 Dependencies
  ├─ Production: 150+
  ├─ Development: 200+
  └─ Security Audits: Regular

🚀 Infrastructure
  ├─ Deployment Regions: 3+
  ├─ Uptime Target: 99.9%
  ├─ CI/CD Pipelines: 5+
  └─ Monitoring Services: 2+
```

---

<div align="center">

### Made with ❤️ in India

**REST-iN-U** - Where Ancient Wisdom Meets Modern Real Estate Technology

**[⬆ Back to Top](#-rest-in-u)**

---

*Last Updated: April 11, 2026*  
*Status: 🟢 Active Development*  
*License: MIT*

</div>
