# 🚀 REST-iN-U Quick Start Guide

**Last Updated**: January 9, 2026 by C4 (XNX)
**Project Status**: 95% Setup Complete - Ready for Development!

---

## ✅ What's Already Done

- ✅ Node.js v25.1.0 installed
- ✅ Python v3.13.5 installed
- ✅ Docker v28.2.2 installed
- ✅ All backend dependencies installed (1,783 packages)
- ✅ All frontend dependencies installed (1,977 packages)
- ✅ All blockchain dependencies installed (1,944 packages)
- ✅ Prisma Client generated
- ✅ Python ML packages installed (numpy, opencv, tensorflow, etc.)
- ✅ **ALL TypeScript errors fixed (0 errors)**
- ✅ Frontend build verified and working
- ✅ Git hooks configured (Husky)
- ✅ ML models requirements.txt created

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start Infrastructure Services

```bash
# Start Docker containers (Postgres, Redis, MinIO)
npm run docker:up

# Verify services are running
docker ps
```

**Expected Output**: You should see `restinu-postgres`, `restinu-redis`, and optionally `restinu-minio` running.

### Step 2: Setup Database

```bash
# Run database migrations
npm run migrate

# (Optional) Seed initial data
npm run seed
```

### Step 3: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
**Expected**: Backend running on http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
**Expected**: Frontend running on http://localhost:3000

**Visit**: http://localhost:3000 to see the app!

---

## 📁 Project Structure

```
Rest-iN-U-1/
├── backend/              # Node.js + Express + Python Flask
│   ├── src/             # TypeScript source code
│   ├── prisma/          # Database schema & migrations
│   └── package.json     # Node.js dependencies
│
├── frontend/            # Next.js 14 + React + Tailwind
│   ├── app/             # Next.js app directory (pages)
│   ├── components/      # React components
│   ├── lib/             # Utilities & API client
│   └── package.json     # Frontend dependencies
│
├── mobile/              # React Native + Expo
│   ├── src/             # Mobile app source
│   └── app.json         # Expo configuration
│
├── blockchain/          # Hardhat + Solidity
│   ├── contracts/       # Smart contracts
│   ├── scripts/         # Deployment scripts
│   └── test/            # Contract tests
│
├── ml-models/           # Python ML models
│   ├── vastu/          # Vastu Shastra analysis
│   ├── jyotish/        # Vedic astrology
│   ├── ayurveda/       # Health recommendations
│   └── requirements.txt # Python packages
│
├── infrastructure/      # Docker configs
│   ├── nginx/          # Reverse proxy
│   └── postgres/       # Database init
│
├── xnx.com/            # Previous work reports (43 files)
│   ├── MASTER_ISSUE_LIST.md
│   ├── C4_IMPLEMENTATION_REPORT.md
│   ├── C4_FIXES_SUMMARY.md
│   └── *_DEEP_IMPLEMENTATION_PLAN.md
│
└── docker-compose.yml  # Docker orchestration
```

---

## 🔧 Common Commands

### Development
```bash
# Start both frontend & backend
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

### Testing
```bash
# Run all tests
npm run test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# E2E tests
npm run test:e2e
```

### Building
```bash
# Build everything
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

### Docker
```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# Start with dev tools (Adminer, Redis Commander)
docker-compose --profile tools up -d

# Start with storage (MinIO)
docker-compose --profile storage up -d
```

### Database
```bash
# Run migrations
npm run migrate

# Seed database
npm run seed

# Prisma Studio (Database GUI)
cd backend && npx prisma studio
```

### Blockchain
```bash
cd blockchain

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to local network
npm run deploy:local

# Deploy to Mumbai testnet
npm run deploy:mumbai
```

### Mobile
```bash
cd mobile

# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Build for production
eas build --platform all
```

---

## ⚙️ Environment Variables

### Backend (.env in /backend)

```bash
# Database
DATABASE_URL=postgresql://restinu:restinu_secret@localhost:5432/restinu_dev?schema=public

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# API Keys (get from respective services)
GOOGLE_MAPS_API_KEY=your_google_maps_key
OPENAI_API_KEY=your_openai_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=restinu_minio
S3_SECRET_KEY=restinu_minio_secret
S3_BUCKET=restinu-uploads
```

### Frontend (.env.local in /frontend)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
```

### Blockchain (.env in /blockchain)

```bash
# Deployer wallet (TESTNET ONLY - never use real funds!)
DEPLOYER_PRIVATE_KEY=your_testnet_wallet_private_key

# RPC URLs
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# API Keys
POLYGONSCAN_API_KEY=your_polygonscan_key
ALCHEMY_API_KEY=your_alchemy_key
```

---

## ⚠️ Known Issues & Solutions

### 1. Blockchain Compilation Fails

**Issue**: Node.js v25 not supported by Hardhat

**Solution**: Use Node.js v18 or v20
```bash
# Install nvm if not available
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node 18
nvm install 18
nvm use 18

# Now compile contracts
cd blockchain && npx hardhat compile
```

### 2. Mobile App - Missing API Keys

**Issue**: `mobile/app.json` has placeholder API keys

**Solution**: Update the following in `app.json`:
- Line 21 & 36: Replace `YOUR_GOOGLE_MAPS_API_KEY`
- Line 55: Replace `your-project-id` with actual EAS project ID

### 3. Port Already in Use

**Issue**: "Port 3000 already in use"

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different ports
PORT=3001 npm run dev:frontend
```

### 4. Docker Containers Won't Start

**Issue**: "Cannot connect to Docker daemon"

**Solution**:
```bash
# Start Docker Desktop
open -a Docker

# Wait for Docker to start, then retry
npm run docker:up
```

---

## 📊 Monitoring & Debugging

### Access Dev Tools

**Adminer (Database UI)**:
```bash
docker-compose --profile tools up -d
```
Visit: http://localhost:8080

**Redis Commander**:
```bash
docker-compose --profile tools up -d
```
Visit: http://localhost:8081

**MinIO Console (S3 Storage)**:
```bash
docker-compose --profile storage up -d
```
Visit: http://localhost:9001
- Username: `restinu_minio`
- Password: `restinu_minio_secret`

**Mailhog (Email Testing)**:
```bash
docker-compose --profile tools up -d
```
Visit: http://localhost:8025

### Check Logs

```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev

# Docker logs
docker-compose logs -f [service-name]

# Example: Postgres logs
docker-compose logs -f postgres
```

---

## 🎓 Learning Resources

### For New Developers

1. **Next.js 14**: https://nextjs.org/docs
2. **Prisma ORM**: https://www.prisma.io/docs
3. **Hardhat**: https://hardhat.org/docs
4. **React Native/Expo**: https://docs.expo.dev

### Project Documentation

1. **XNX Reports**: See `/xnx.com/` folder for 43 detailed analysis reports
2. **C4 Implementation Report**: `/xnx.com/C4_IMPLEMENTATION_REPORT.md`
3. **Fixes Summary**: `/xnx.com/C4_FIXES_SUMMARY.md`
4. **Master Issue List**: `/xnx.com/MASTER_ISSUE_LIST.md`

---

## 🚀 Next Steps

### For Developers

1. **Review Code Standards**
   - TypeScript strict mode enabled
   - ESLint configured
   - Prettier for formatting

2. **Start Building Features**
   - All setup complete
   - Zero TypeScript errors
   - Build process verified

3. **Run Tests**
   ```bash
   npm run test
   npm run test:e2e
   ```

4. **Deploy to Staging**
   - Backend: Render.com (configured)
   - Frontend: Vercel (Next.js)
   - Database: Render PostgreSQL

### For Project Managers

1. **Review Progress**: 95% setup complete
2. **Configure Production Secrets**: API keys, database URLs
3. **Setup CI/CD**: GitHub Actions ready
4. **Plan Sprint**: See `/xnx.com/*_FUTURE_DEVELOPMENT_PLAN.md`

---

## 🆘 Getting Help

### Issues or Questions?

1. **Check XNX Reports**: Most common issues documented in `/xnx.com/`
2. **Read Implementation Reports**: See C4 reports for recent changes
3. **Check Git History**: All changes committed with detailed messages

### Resources

- **GitHub Issues**: Report bugs and track features
- **README**: Project overview (if exists)
- **API Docs**: Check `/backend/docs/` (if exists)

---

## ✨ Success Checklist

Before starting development, verify:

- [ ] Docker containers running (`docker ps`)
- [ ] Backend API responding (`curl http://localhost:4000/health`)
- [ ] Frontend loading (`curl http://localhost:3000`)
- [ ] Database connected (`npx prisma studio` works)
- [ ] Redis connected (check logs)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build:frontend`)

---

**Happy Coding! 🎉**

The REST-iN-U platform is ready to revolutionize real estate with Vedic wisdom + modern technology!

---

**Maintained by**: C4 (XNX)
**Last verified**: January 9, 2026
