# Rest-iN-U 🏠

**The Future of Real Estate Technology**

A comprehensive real estate marketplace platform connecting property buyers, sellers, agents, and businesses. Built with modern technologies for scalability, performance, and an exceptional user experience.

## Features

- 🔍 **Advanced Property Search** - Search 2M+ properties with 50+ filters
- 🗺️ **Interactive Maps** - Google Maps integration with property markers
- 🏠 **3D Virtual Tours** - Matterport integration for immersive property viewing
- 💰 **AI Price Estimator** - ML-powered property valuations
- 📊 **Mortgage Calculator** - Real-time payment calculations
- 👤 **Agent CRM** - Lead management and analytics for agents
- 💬 **Real-time Messaging** - Instant communication between buyers and agents
- 📱 **Mobile Responsive** - Works seamlessly on all devices

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Material-UI (MUI)
- React Hook Form

### Backend
- Node.js with Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (optional, for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorg/rest-in-u.git
   cd rest-in-u
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start the database (with Docker)**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate -w backend
   ```

6. **Seed the database**
   ```bash
   npm run db:seed -w backend
   ```

7. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Project Structure

```
rest-in-u/
├── frontend/               # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   └── ...
├── backend/                # Express.js backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, validation
│   │   └── lib/            # Utilities
│   └── prisma/             # Database schema
├── docs/                   # Documentation
└── docker-compose.yml      # Local dev services
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/properties/search` | Search properties |
| GET | `/api/v1/properties/:id` | Get property details |
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/leads` | Create lead |
| GET | `/api/v1/agents` | Search agents |
| POST | `/api/v1/valuation/estimate` | Get price estimate |

## Environment Variables

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
GOOGLE_MAPS_API_KEY=your-key
STRIPE_SECRET_KEY=sk_...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ by the Rest-iN-U Team
