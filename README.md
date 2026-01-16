<div align="center">

# 🏡 REST-iN-U

## Where Ancient Wisdom Meets Modern Real Estate

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.13-blue)](https://www.python.org/)
[![Storybook](https://img.shields.io/badge/Storybook-7.6-ff4785)](https://storybook.js.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://restinu.com) • [Documentation](./docs) • [API Reference](./API.md) • [Contributing](./CONTRIBUTING.md)

</div>

---

# 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [AI Service](#ai-service)
- [Blockchain Deployment](#blockchain-deployment)
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

---

# 🛠️ Tech Stack

## Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand + React Query
- **Documentation**: Storybook
- **Web3**: RainbowKit, Wagmi, Viem
- **Maps**: Mapbox GL

## Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis (Upstash)
- **Docs**: Swagger (OpenAPI 3.0)

## AI/ML

- **Language**: Python 3.13
- **Framework**: FastAPI
- **Libraries**: Scikit-learn, TensorFlow, OpenCV

## Blockchain

- **Language**: Solidity 0.8.x
- **Framework**: Hardhat
- **Network**: Polygon (L2)

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

2. **Install dependencies**

```bash
# Install all workspace dependencies
npm install

# Install Python dependencies
cd backend
pip install -r requirements.txt
```

3. **Start development servers**

```bash
# Terminal 1: Frontend
npm run dev:frontend

# Terminal 2: Backend
npm run dev:backend

# Terminal 3: AI Service (Python)
cd backend && python api_server.py
```

4. **Access the application**

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:4000>
- API Docs: <http://localhost:4000/api-docs>
- Storybook: <http://localhost:6006>

---

# 🔑 Environment Variables

Copy the `.env.example` file to `.env` and configure the following:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/restinu` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your-secret-key` |
| `OPENAI_API_KEY` | OpenAI API key for LLM agents | - |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token | - |
| `WEB3_ALCHEMY_KEY` | Alchemy API key for blockchain | - |

---

# 🤖 AI Service

The AI service runs separately and handles heavy ML tasks like recommendation generation and image analysis.

### Running the AI Engine

```bash
# Activate virtual environment
source backend/venv/bin/activate  # Mac/Linux
# backend\venv\Scripts\activate  # Windows

# Install dependencies
pip install -r backend/requirements.txt

# Start the server
cd backend
python api_server.py
```

The AI service will be available at `http://localhost:5000`.

---

# ⛓️ Blockchain Deployment

Deploy smart contracts to the local hardhat network or Polygon testnet.

```bash
cd blockchain

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Mumbai Testnet
npx hardhat run scripts/deploy.ts --network mumbai
```

### Verified Contracts (Mumbai)

- **PropertyNFT**: `0x...`
- **FractionalToken**: `0x...`

---

# 📁 Project Structure

```
rest-in-u/
├── frontend/                 # Next.js 14 application
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── .storybook/          # Storybook configuration
│   └── stories/             # Component stories
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API routes (Swagger annotated)
│   │   ├── services/       # Business logic
│   │   └── models/         # Database models
│   ├── ai_ml/              # Python AI/ML module
│   └── prisma/             # Database schema
├── blockchain/             # Smart contracts
│   ├── contracts/          # Solidity contracts
│   └── scripts/            # Deployment scripts
└── mobile/                 # React Native app
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
```

## Documentation

### API Documentation (Swagger)

The backend uses `swagger-jsdoc` to generate OpenAPI documentation. Access it at `/api-docs` when the backend is running.

### Component Documentation (Storybook)

We use Storybook to document and test UI components in isolation.

```bash
# Start Storybook
cd frontend
npm run storybook
```

---

# 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[⬆ back to top](#-rest-in-u)**

Made with ❤️ in India

</div>
