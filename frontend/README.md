ðŸ  Dharma Realty
<div align="center">

A Next-Generation Real Estate Platform Integrating Ancient Wisdom with Modern Technology
   
Demo â€¢ Documentation â€¢ Report Bug â€¢ Request Feature
</div>
ðŸ“– About
Dharma Realty is a revolutionary real estate platform that uniquely combines ancient Sanatana Dharma principlesâ€”including Vastu Shastra and Vedic astrologyâ€”with cutting-edge technologies like blockchain, AI, and IoT. Our platform provides a holistic approach to property discovery, ensuring that homes not only meet modern standards but also align with timeless principles of harmony and prosperity.
âœ¨ Key Features
ðŸ§­ Vastu Analysis - AI-powered Vastu Shastra compliance scoring with detailed recommendations
â­ Astrological Matching - Property-buyer compatibility based on Vedic astrology
ðŸ”— Blockchain Integration - Property tokenization, fractional ownership, and DAO governance
ðŸ“¹ Virtual Tours - Live video property showings with Twilio integration
ðŸ“ Digital Signatures - Seamless document signing with DocuSign
ðŸ’³ Secure Payments - Subscription management and payments via Stripe
ðŸ—ºï¸ Smart Maps - Interactive property search with Google Maps
ðŸ“± Responsive Design - Beautiful UI optimized for all devices

ðŸš€ Getting Started
Prerequisites
Node.js 20.x or later
pnpm 8.x or later
Git
Installation
Clone the repository

 git clone https://github.com/dharma-realty/platform.git
cd platform/frontend


Install dependencies

 pnpm install


Set up environment variables

 cp .env.example .env.local
 Edit .env.local with your API keys and configuration.


Start the development server

 pnpm dev


Open your browser Navigate to http://localhost:3000



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


ðŸ“ Project Structure
frontend/
â”œâ”€â”€ .github/              # GitHub workflows & templates
â”œâ”€â”€ e2e/                  # Playwright E2E tests
â”œâ”€â”€ public/               # Static assets
â”‚   â”œâ”€â”€ images/           # Images
â”‚   â”œâ”€â”€ icons/            # App icons
â”‚   â””â”€â”€ patterns/         # Vastu patterns
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/              # Next.js App Router pages
â”‚   â”‚   â”œâ”€â”€ (auth)/       # Authentication pages
â”‚   â”‚   â”œâ”€â”€ dashboard/    # Dashboard pages
â”‚   â”‚   â”œâ”€â”€ property/     # Property pages
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”œâ”€â”€ components/       # React components
â”‚   â”‚   â”œâ”€â”€ ui/           # Base UI components
â”‚   â”‚   â”œâ”€â”€ layout/       # Layout components
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”œâ”€â”€ hooks/            # Custom React hooks
â”‚   â”œâ”€â”€ lib/              # Utilities & config
â”‚   â”œâ”€â”€ providers/        # Context providers
â”‚   â”œâ”€â”€ services/         # API & integrations
â”‚   â”‚   â”œâ”€â”€ api.ts        # API client
â”‚   â”‚   â””â”€â”€ integrations/ # Third-party services
â”‚   â”œâ”€â”€ store/            # Zustand stores
â”‚   â”œâ”€â”€ styles/           # Global styles
â”‚   â””â”€â”€ types/            # TypeScript types
â”œâ”€â”€ .env.example          # Environment template
â”œâ”€â”€ next.config.js        # Next.js configuration
â”œâ”€â”€ tailwind.config.ts    # Tailwind configuration
â””â”€â”€ tsconfig.json         # TypeScript configuration


ðŸ§ª Testing
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


ðŸ“¦ Scripts
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


ðŸ”§ Configuration
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

ðŸš¢ Deployment
Vercel (Recommended)
Push to GitHub
Import project in Vercel
Configure environment variables
Deploy!
Docker
## Build image
docker build -t dharma-realty .

## Run container
docker run -p 3000:3000 dharma-realty

Docker Compose
docker-compose up -d


ðŸ¤ Contributing
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

ðŸ“„ License
This project is licensed under the MIT License - see the LICENSE file for details.

ðŸ™ Acknowledgments
Vastu Shastra - Ancient Indian architecture
Jyotish - Vedic astrology
Sanatana Dharma - Eternal principles
 <div align="center">
Built with â¤ï¸ by the Dharma Realty Team
Website â€¢ Twitter â€¢ LinkedIn
</div>

