ðŸ  Dharma Realty Platform
<div align="center">

Where Ancient Wisdom Meets Modern Real Estate
A revolutionary property platform integrating Vastu Shastra, Vedic astrology, blockchain tokenization, and AI-powered insights
   
Live Demo â€¢ Documentation â€¢ API Reference
</div>
ðŸŒŸ Vision
Dharma Realty transforms the real estate experience by harmonizing timeless Sanatana Dharma principles with cutting-edge technology. We believe that a home should not only meet practical needs but also resonate with cosmic harmony and personal destiny.
âœ¨ Key Features
ðŸ§­ Vastu Shastra Integration
AI-powered Vastu compliance analysis for every property
Room-by-room recommendations based on directional principles
Remediation suggestions with cost estimates
Interactive Vastu compass visualization
â­ Vedic Astrology Matching
Property-buyer compatibility based on birth charts
Auspicious date recommendations for transactions
Nakshatra and zodiac-based property suggestions
Griha Pravesh muhurta calculations
ðŸ”— Blockchain & Web3
Property tokenization for fractional ownership
DAO governance for tokenized properties
Smart contract-based transactions
Transparent ownership records on-chain
ðŸ“¹ Virtual Experiences
Live video property tours with agents
Interactive 3D walkthroughs
AR-enabled room visualization
Scheduled virtual open houses
ðŸ“ Digital Documentation
DocuSign integration for e-signatures
Automated document generation
Secure document vault
Verification workflow tracking
ðŸ’³ Subscription & Payments
Tiered subscription plans (Basic, Premium, Professional)
Secure Stripe payment processing
Billing portal and invoice management
Promotional code support

ðŸ—ï¸ Architecture
dharma-realty/
â”œâ”€â”€ frontend/          # Next.js 14 React application
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ app/       # App Router pages
â”‚   â”‚   â”œâ”€â”€ components/# React components
â”‚   â”‚   â”œâ”€â”€ hooks/     # Custom React hooks
â”‚   â”‚   â”œâ”€â”€ lib/       # Utilities & config
â”‚   â”‚   â”œâ”€â”€ providers/ # Context providers
â”‚   â”‚   â”œâ”€â”€ services/  # API & integrations
â”‚   â”‚   â”œâ”€â”€ store/     # Zustand state management
â”‚   â”‚   â””â”€â”€ types/     # TypeScript definitions
â”‚   â””â”€â”€ ...
â”œâ”€â”€ backend/           # Node.js Express API
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ config/    # Configuration
â”‚   â”‚   â”œâ”€â”€ middleware/# Express middleware
â”‚   â”‚   â”œâ”€â”€ routes/    # API routes
â”‚   â”‚   â”œâ”€â”€ jobs/      # Background jobs
â”‚   â”‚   â”œâ”€â”€ utils/     # Utilities
â”‚   â”‚   â””â”€â”€ websockets/# Real-time handlers
â”‚   â””â”€â”€ prisma/        # Database schema & migrations
â”œâ”€â”€ blockchain/        # Smart contracts (Solidity)
â”‚   â”œâ”€â”€ contracts/     # Property tokenization contracts
â”‚   â”œâ”€â”€ scripts/       # Deployment scripts
â”‚   â””â”€â”€ test/          # Contract tests
â””â”€â”€ docs/              # Documentation


ðŸ› ï¸ Tech Stack
Frontend
Technology
Purpose
Next.js 14
React framework with App Router
TypeScript
Type safety
Tailwind CSS
Utility-first styling
Zustand
State management
Framer Motion
Animations
React Hook Form + Zod
Form handling & validation

Backend
Technology
Purpose
Node.js
Runtime
Express
API framework
Prisma
ORM
PostgreSQL
Primary database
Redis
Caching & sessions
BullMQ
Job queues
Socket.io
Real-time communication

Blockchain
Technology
Purpose
Solidity
Smart contracts
Hardhat
Development environment
OpenZeppelin
Secure contract libraries
Polygon
L2 network deployment

Infrastructure
Service
Purpose
Vercel
Frontend hosting
AWS / Railway
Backend hosting
Supabase / Neon
Managed PostgreSQL
Upstash
Managed Redis
S3 / Cloudinary
File storage


ðŸš€ Quick Start
Prerequisites
Node.js 18+
pnpm 8+ (recommended) or npm
PostgreSQL 14+
Redis 6+
Docker (optional)
Installation
Clone the repository

 git clone https://github.com/dharma-realty/platform.git
cd dharma-realty


Install dependencies

 pnpm install
## or
npm install


Set up environment variables

 cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env


Start databases (Docker)

 docker-compose up -d postgres redis


Run database migrations

 npm run migrate


Seed the database

 npm run seed


Start development servers

 npm run dev
 This starts:


Frontend: http://localhost:3000
Backend: http://localhost:4000
API Docs: http://localhost:4000/docs
Docker Development
For a fully containerized development environment:
docker-compose -f docker-compose.dev.yml up


ðŸ“ Project Scripts
Command
Description
npm run dev
Start frontend & backend in development
npm run dev:frontend
Start only frontend
npm run dev:backend
Start only backend
npm run build
Build both frontend & backend
npm run test
Run all tests
npm run lint
Lint all code
npm run migrate
Run database migrations
npm run seed
Seed database with sample data
npm run docker:up
Start Docker containers
npm run docker:down
Stop Docker containers


ðŸ”§ Configuration
Frontend Environment Variables
## API
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000

## Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key

## Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

## Feature Flags
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
NEXT_PUBLIC_ENABLE_VIDEO_CALL=true
NEXT_PUBLIC_ENABLE_VASTU_ANALYSIS=true

Backend Environment Variables
## Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dharma

## Redis
REDIS_URL=redis://localhost:6379

## JWT
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

## Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

## Email
SENDGRID_API_KEY=SG...

## AWS
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=dharma-uploads

See frontend/.env.example and backend/.env.example for complete lists.

ðŸ“š Documentation
Frontend Documentation
Backend API Documentation
Contributing Guide
Security Policy
Deployment Guide

ðŸ§ª Testing
Frontend Tests
cd frontend
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests with Playwright
pnpm test:coverage     # Coverage report

Backend Tests
cd backend
npm test               # Unit & integration tests
npm run test:e2e       # E2E API tests
npm run test:coverage  # Coverage report

Blockchain Tests
cd blockchain
npx hardhat test       # Smart contract tests


ðŸš¢ Deployment
Production Deployment
Frontend â†’ Vercel (automatic on push to main)
Backend â†’ Railway / AWS ECS / DigitalOcean
Database â†’ Supabase / Neon / AWS RDS
Blockchain â†’ Polygon Mainnet
See Deployment Guide for detailed instructions.
Environment Setup
Environment
Frontend
Backend
Database
Development
localhost:3000
localhost:4000
localhost:5432
Staging
staging.dharmarealty.com
api-staging.dharmarealty.com
staging-db
Production
dharmarealty.com
api.dharmarealty.com
production-db


ðŸ¤ Contributing
We welcome contributions! Please see our Contributing Guide for details.
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'feat: add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

ðŸ“Š Project Status
âœ… Completed
[x] Property listing & search
[x] User authentication & authorization
[x] Agent dashboards
[x] Vastu analysis integration
[x] Subscription management (Stripe)
[x] Document signing (DocuSign)
[x] Video calls (Twilio)
[x] Real-time messaging
[x] Blockchain tokenization
[x] Mobile responsive design
ðŸš§ In Progress
[ ] Mobile app (React Native)
[ ] AI property recommendations
[ ] Advanced analytics dashboard
[ ] Multi-language support (Hindi, Marathi)
ðŸ“‹ Planned
[ ] AR/VR property tours
[ ] Voice search integration
[ ] Automated property valuation
[ ] Insurance integration
[ ] Home loan marketplace

ðŸ“„ License
This project is proprietary software. See LICENSE for details.

ðŸ™ Acknowledgments
Vastu Shastra - Ancient Indian architectural wisdom
Jyotish - Vedic astrology traditions
Open Source Community - For the amazing tools and libraries
 <div align="center">
Built with â¤ï¸ and ðŸ•‰ï¸ by Dharma Realty
Website â€¢ Twitter â€¢ LinkedIn
"Where every home is in harmony with the cosmos"
</div>
