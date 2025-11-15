# Bulgaria From Above

A geo-quiz web game where players view photos of Bulgaria and guess where they were taken by placing markers on a map.

## Project Overview

**Bulgaria From Above** is an interactive game that tests your knowledge of Bulgarian geography. Players are shown photos for a few seconds, then must guess the location on a map. The system calculates scores based on distance accuracy and time taken.

### Key Features

- **Game Modes**:
  - **Classic Mode**: Single photo, 30 seconds to guess
  - **5-Round Challenge**: Five photos with cumulative scoring
- **Leaderboards**: Daily, Weekly, and All-time rankings
- **User Profiles**: Track your progress and statistics
- **Anti-Cheat**: Server-side scoring and validation
- **Monetization**: Banner ads and rewarded ad system
- **Feedback System**: Built-in user feedback mechanism

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Maps**: Leaflet + OpenStreetMap
- **State**: React Query + Zustand
- **Auth**: NextAuth.js

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL + Prisma ORM
- **Storage**: DigitalOcean Spaces / AWS S3
- **CDN**: CloudFront / Vercel CDN

### Infrastructure
- **Monorepo**: Turborepo
- **Hosting**: Vercel (frontend) + AWS/DigitalOcean (backend)
- **CI/CD**: GitHub Actions

## Repository Structure

```
bulgariafromabove/
├── apps/
│   ├── web/              # Player-facing Next.js app
│   ├── admin/            # Admin panel (Next.js)
│   └── api/              # Backend API (Fastify)
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Shared utilities (scoring, geo)
│   ├── config/           # Shared configuration
│   ├── db/               # Prisma schema and client
│   └── ui/               # Shared UI components
├── docs/                 # Documentation
├── SPEC.md               # Full specification
├── PROJECT_PLAN.md       # Architecture and tech plan
├── TASKS.md              # Task breakdown
└── STATE.md              # Current project state
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm 10+

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bulgariafromabove
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   - Database URL
   - JWT secrets
   - Google OAuth credentials (optional)
   - Storage credentials (S3/Spaces)

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # Seed with sample data
   npm run db:seed
   ```

5. **Start development servers**:
   ```bash
   # Start all apps (web, api, admin)
   npm run dev
   ```

   Or run individually:
   ```bash
   # Backend API
   cd apps/api && npm run dev

   # Web app
   cd apps/web && npm run dev

   # Admin panel
   cd apps/admin && npm run dev
   ```

### Access the Apps

- **Web App**: http://localhost:3000
- **API**: http://localhost:4000
- **Admin Panel**: http://localhost:3001 (not yet implemented)

## Development

### Building

```bash
# Build all apps
npm run build

# Build specific app
cd apps/web && npm run build
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm run test
```

### Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes (dev)
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout

### Game

- `POST /api/game/start` - Start new game
- `GET /api/game/:id` - Get game state
- `POST /api/game/:id/round` - Submit guess
- `POST /api/game/:id/complete` - Complete game

### Leaderboard

- `GET /api/leaderboard/:period` - Get leaderboard (daily/weekly/alltime)

### User

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - Get user statistics

### Feedback

- `POST /api/feedback` - Submit feedback

## Deployment

### Vercel (Frontend)

```bash
# Deploy web app
cd apps/web
vercel
```

### Backend (AWS/DigitalOcean)

```bash
# Build API
cd apps/api
npm run build

# Start production server
npm start
```

### Database Migrations

```bash
# Run migrations on production
npm run db:migrate
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bulgaria_from_above
JWT_SECRET=your-jwt-secret-min-32-chars
API_URL=http://localhost:4000

# Storage
S3_BUCKET=bulgaria-photos
S3_REGION=nyc3
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Scoring Algorithm

Points are calculated based on:
- **Distance Score** (0-5000 points): Closer guess = more points
- **Time Bonus** (0-1000 points): Faster guess = more bonus
- **Perfect Guess Bonus** (500 points): If within 100m

```typescript
score = distanceScore + timeBonus + perfectBonus
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions:
- Open an issue on GitHub
- Contact: admin@bulgariafromabove.com

## Roadmap

### MVP ✅ COMPLETED
- [x] Project setup and architecture
- [x] Backend API implementation
- [x] Database schema and migrations
- [x] Web app UI and gameplay
- [x] Authentication system (Email/Password)
- [x] Leaderboard (Daily, Weekly, All-time)
- [x] User profiles with statistics
- [x] Admin panel for photo management
- [x] Photo upload with EXIF extraction
- [x] DigitalOcean Spaces integration
- [x] Feedback system
- [x] Social sharing
- [x] Complete game flow (Classic + 5-Round)

### Post-MVP
- [ ] User photo uploads
- [ ] Custom quiz creation
- [ ] Tournaments
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics
- [ ] Sponsored content

## Acknowledgments

- Maps provided by OpenStreetMap contributors
- Built with Next.js, Fastify, and Prisma
