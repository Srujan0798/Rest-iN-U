REST-iN-U
<div align="center">

A Next-Generation Real Estate Platform Integrating Ancient Wisdom with Modern Technology
   
Demo Documentation Report Bug Request Feature
</div>
About
REST-iN-U is a revolutionary real estate platform that uniquely combines ancient Sanatana REST-iN-U Vastu Shastra and Vedic cutting-edge technologies like blockchain, AI, and IoT. Our platform provides a holistic approach to property discovery, ensuring that homes not only meet modern standards but also align with timeless principles of harmony and prosperity.
Key Features
Vastu Analysis - AI-powered Vastu Shastra compliance scoring with detailed recommendations
Astrological Matching - Property-buyer compatibility based on Vedic astrology
Blockchain Integration - Property tokenization, fractional ownership, and DAO governance
Virtual Tours - Live video property showings with Twilio integration
Digital Signatures - Seamless document signing with DocuSign
Secure Payments - Subscription management and payments via Stripe
Smart Maps - Interactive property search with Google Maps
Responsive Design - Beautiful UI optimized for all devices

Getting Started
Prerequisites
Node.js 20.x or later
pnpm 8.x or later
Git
Installation
Clone the repository

 git clone https://github.com/rest-in-u/platform.git
cd platform/frontend


Install dependencies

 pnpm install


Set up environment variables

 cp .env.example .env.local
 Edit .env.local with your API keys and configuration.


Start the development server

 pnpm dev


Open your browser Navigate to http://localhost:3000



Tech Stack
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
React Hook Form
Form handling
Zod
Schema validation

Integrations
Service
Purpose
Google Maps
Property locations & search
Stripe
Payments & subscriptions
DocuSign
Digital signatures
Twilio
Video calls & SMS
Web3
Blockchain & tokenization

Infrastructure
Tool
Purpose
Vercel
Deployment
GitHub Actions
CI/CD
Sentry
Error tracking
Codecov
Coverage reports


Project Structure
frontend/
.github/              # GitHub workflows & templates
e2e/                  # Playwright E2E tests
public/               # Static assets
  images/           # Images
  icons/            # App icons
  patterns/         # Vastu patterns
src/
  app/              # Next.js App Router pages
    (auth)/       # Authentication pages
    dashboard/    # Dashboard pages
    property/     # Property pages
    ...
  components/       # React components
    ui/           # Base UI components
    layout/       # Layout components
    ...
  hooks/            # Custom React hooks
  lib/              # Utilities & config
  providers/        # Context providers
  services/         # API & integrations
    api.ts        # API client
    integrations/ # Third-party services
  store/            # Zustand stores
  styles/           # Global styles
  types/            # TypeScript types
.env.example          # Environment template
next.config.js        # Next.js configuration
tailwind.config.ts    # Tailwind configuration
tsconfig.json         # TypeScript configuration


Testing
Unit Tests
## Run unit tests
pnpm test

## Run with coverage
pnpm test:coverage

## Watch mode
pnpm test:watch

E2E Tests
## Run E2E tests
pnpm test:e2e

## Run with UI
pnpm test:e2e:ui

## Debug mode
pnpm test:e2e:debug


Scripts
Command
Description
pnpm dev
Start development server
pnpm build
Build for production
pnpm start
Start production server
pnpm lint
Run ESLint
pnpm lint:fix
Fix ESLint errors
pnpm type-check
Run TypeScript check
pnpm test
Run unit tests
pnpm test:e2e
Run E2E tests
pnpm format
Format code with Prettier


Configuration
Environment Variables
Create a .env.local file based on .env.example:
## App
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SITE_URL=http://localhost:3000

## API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

## Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key

## Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

## Feature Flags
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
NEXT_PUBLIC_ENABLE_VIDEO_CALL=true
NEXT_PUBLIC_ENABLE_VASTU_ANALYSIS=true

See .env.example for all available options.

Deployment
Vercel (Recommended)
Push to GitHub
Import project in Vercel
Configure environment variables
Deploy!
Docker
## Build image
docker build -t rest-in-u .

## Run container
docker run -p 3000:3000 rest-in-u

Docker Compose
docker-compose up -d


Contributing
We welcome contributions! Please see our Contributing Guide for details.
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'feat: add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Commit Convention
We use Conventional Commits:
feat: - New feature
fix: - Bug fix
docs: - Documentation
style: - Code style (formatting, etc.)
refactor: - Code refactoring
perf: - Performance improvement
test: - Tests
chore: - Maintenance

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Vastu Shastra - Ancient Indian architecture
Jyotish - Vedic astrology
Sanatana REST-iN-U - Eternal principles
 <div align="center">
Built with by the REST-iN-U Team
Website Twitter LinkedIn
</div>


