# Bulgaria From Above - Project Plan

## Architecture Overview

### System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Web App   │◄───────►│  API Server │◄───────►│  Database   │
│  (Next.js)  │         │  (Fastify)  │         │ (PostgreSQL)│
└─────────────┘         └─────────────┘         └─────────────┘
       │                       │
       │                       │
       ▼                       ▼
┌─────────────┐         ┌─────────────┐
│ Admin Panel │         │   CDN/S3    │
│  (Next.js)  │         │  (Images)   │
└─────────────┘         └─────────────┘
```

### Tech Stack

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Maps**: Mapbox GL JS (primary) or Leaflet (fallback)
- **State Management**:
  - React Query (server state)
  - Zustand (client state)
- **Authentication**: NextAuth.js

#### Backend
- **Runtime**: Node.js 20+
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Queue**: BullMQ (background jobs)
- **Validation**: Zod schemas
- **Testing**: Vitest

#### Infrastructure
- **Hosting**:
  - Vercel (web + admin apps)
  - AWS/DigitalOcean (API server)
- **Database**: AWS RDS PostgreSQL
- **Storage**: AWS S3 or DigitalOcean Spaces
- **CDN**: CloudFront or Vercel CDN
- **CI/CD**: GitHub Actions

#### Development Tools
- **Monorepo**: Turborepo
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
- **E2E Testing**: Playwright

## Repository Structure

```
bulgariafromabove/
├── apps/
│   ├── web/                    # Player-facing game
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (game)/
│   │   │   │   ├── play/
│   │   │   │   ├── challenge/
│   │   │   │   └── results/
│   │   │   ├── leaderboard/
│   │   │   ├── profile/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   └── public/
│   ├── admin/                  # Admin panel
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── photos/
│   │   │   └── users/
│   │   └── components/
│   └── api/                    # Backend API
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── game/
│       │   │   ├── photos/
│       │   │   ├── leaderboard/
│       │   │   └── feedback/
│       │   ├── plugins/
│       │   ├── utils/
│       │   └── server.ts
│       └── test/
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── types/                  # Shared TypeScript types
│   ├── config/                 # Shared configs
│   ├── utils/                  # Shared utilities
│   │   ├── scoring/
│   │   ├── geo/
│   │   └── validation/
│   └── db/                     # Prisma schema
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       └── index.ts
├── docs/
│   ├── specs/
│   ├── api/
│   └── architecture/
├── scripts/
│   ├── seed-photos.ts
│   └── setup-db.ts
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── turbo.json
├── package.json
├── SPEC.md
├── PROJECT_PLAN.md
├── TASKS.md
├── STATE.md
└── README.md
```

## Database Schema

### Core Tables

#### users
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  avatarId      String?   // Preset avatar identifier
  provider      String    // 'email' or 'google'
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  games         Game[]
  scores        Score[]
  feedback      Feedback[]
}
```

#### photos
```prisma
model Photo {
  id            String    @id @default(cuid())
  url           String
  thumbnailUrl  String
  latitude      Float
  longitude     Float
  city          String?
  region        String?
  category      String?
  difficulty    Int       @default(1) // 1-5
  approved      Boolean   @default(false)
  uploadedBy    String?   // Admin user ID
  createdAt     DateTime  @default(now())

  rounds        Round[]
}
```

#### games
```prisma
model Game {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  mode          String      // 'classic' or '5-round'
  status        String      // 'in_progress', 'completed'
  totalScore    Int         @default(0)
  startedAt     DateTime    @default(now())
  completedAt   DateTime?

  rounds        Round[]
  scores        Score[]
}
```

#### rounds
```prisma
model Round {
  id            String    @id @default(cuid())
  gameId        String
  game          Game      @relation(fields: [gameId], references: [id])
  photoId       String
  photo         Photo     @relation(fields: [photoId], references: [id])
  roundNumber   Int       // 1-5 for 5-round challenge
  guessLat      Float?
  guessLng      Float?
  distance      Float?    // meters
  timeSpent     Int?      // seconds
  points        Int?
  createdAt     DateTime  @default(now())
}
```

#### scores (leaderboard)
```prisma
model Score {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  gameId        String
  game          Game      @relation(fields: [gameId], references: [id])
  mode          String
  totalScore    Int
  avgDistance   Float?
  createdAt     DateTime  @default(now())

  @@index([mode, totalScore])
  @@index([createdAt])
}
```

#### feedback
```prisma
model Feedback {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  subject       String
  message       String
  deviceInfo    String?   // JSON string
  createdAt     DateTime  @default(now())
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Email login
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - Logout

### Game
- `POST /api/game/start` - Start new game
- `GET /api/game/:id` - Get game state
- `POST /api/game/:id/round` - Submit round guess
- `POST /api/game/:id/complete` - Complete game

### Photos
- `GET /api/photos/random` - Get random photo (excludes recent)
- `POST /api/admin/photos` - Upload photo (admin only)
- `PUT /api/admin/photos/:id` - Update photo (admin only)
- `DELETE /api/admin/photos/:id` - Delete photo (admin only)

### Leaderboard
- `GET /api/leaderboard/daily` - Daily leaderboard
- `GET /api/leaderboard/weekly` - Weekly leaderboard
- `GET /api/leaderboard/alltime` - All-time leaderboard

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - Get user statistics

### Feedback
- `POST /api/feedback` - Submit feedback

## Scoring Algorithm

### Formula

```typescript
function calculateScore(
  distanceMeters: number,
  timeSeconds: number,
  maxTime: number
): number {
  // Distance score (0-5000 points)
  const maxDistance = 500000; // 500km
  const distanceScore = Math.max(
    0,
    5000 * (1 - distanceMeters / maxDistance)
  );

  // Time bonus (0-1000 points)
  const timeBonus = Math.max(
    0,
    1000 * (1 - timeSeconds / maxTime)
  );

  // Perfect guess bonus
  const perfectBonus = distanceMeters < 100 ? 500 : 0;

  return Math.round(distanceScore + timeBonus + perfectBonus);
}
```

### Distance Calculation (Haversine)

```typescript
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
```

## Security Considerations

### Authentication
- JWT tokens with short expiration
- Refresh token rotation
- CSRF protection
- Rate limiting on auth endpoints

### API Security
- Input validation with Zod schemas
- SQL injection prevention (Prisma parameterized queries)
- XSS protection (sanitize outputs)
- CORS configuration
- Request size limits

### Anti-Cheat
- Server-side score calculation only
- Timestamp validation
- Distance validation (impossible guesses)
- Rate limiting (prevent spam)
- Session tracking (prevent photo reuse)

## Development Workflow

### 1. Setup Phase
- Initialize Turborepo
- Configure shared packages
- Set up Prisma schema
- Create base UI components

### 2. Backend Development
- Implement auth module
- Build game logic
- Create scoring engine
- Set up photo management
- Implement leaderboard

### 3. Frontend Development
- Build authentication flows
- Create game UI components
- Implement map interface
- Build profile and leaderboard pages
- Create admin panel

### 4. Integration
- Connect frontend to API
- Test full gameplay flow
- Add error handling
- Implement loading states

### 5. Testing & QA
- Unit tests (Vitest)
- Integration tests
- E2E tests (Playwright)
- Performance testing
- Security audit

### 6. Deployment
- Set up CI/CD pipeline
- Deploy to staging
- User acceptance testing
- Deploy to production

## Performance Optimization

### Frontend
- Image lazy loading
- Code splitting
- Route prefetching
- Memoization (React.memo)
- Debounced map interactions

### Backend
- Database indexing
- Query optimization
- Response caching
- Connection pooling
- Rate limiting

### Infrastructure
- CDN for static assets
- Image optimization (WebP, responsive sizes)
- Database read replicas (if needed)
- Horizontal API scaling

## Monitoring & Analytics

### Metrics to Track
- User registrations
- Games played (by mode)
- Average score
- Average distance
- API response times
- Error rates
- Page load times

### Tools
- Vercel Analytics (frontend)
- AWS CloudWatch (backend)
- Sentry (error tracking)
- Custom analytics dashboard (admin panel)

## Deployment Strategy

### Environments
1. **Development**: Local development
2. **Staging**: Pre-production testing
3. **Production**: Live environment

### CI/CD Pipeline
1. Push to branch
2. Run linters and type checks
3. Run unit tests
4. Run integration tests
5. Build applications
6. Deploy to staging (on main branch)
7. Run E2E tests on staging
8. Deploy to production (on release tag)

## Cost Estimation (MVP)

### Infrastructure
- Vercel: Free tier (hobby)
- AWS/DO Droplet: ~$12/month
- Database: ~$15/month (DO managed PostgreSQL)
- Storage: ~$5/month (S3/Spaces)
- CDN: ~$5/month

**Total**: ~$37/month for MVP with low traffic

### Scalability Plan
- Monitor costs and usage
- Optimize queries and caching
- Scale horizontally when needed
- Consider reserved instances for cost savings

## Risk Mitigation

### Technical Risks
- **Map API costs**: Use free tier, implement caching
- **Image storage**: Compress images, use CDN
- **Database performance**: Index optimization, connection pooling

### Business Risks
- **Low user engagement**: Focus on core gameplay quality
- **Content moderation**: Admin-only uploads in MVP
- **Monetization**: Lightweight ads, optional features

### Security Risks
- **Account takeover**: Strong auth, rate limiting
- **Score manipulation**: Server-side validation
- **DDoS**: Rate limiting, WAF

## Success Criteria

MVP is complete when:
1. Users can register and authenticate
2. All game modes are functional
3. Scoring is accurate and fair
4. Leaderboard updates correctly
5. Admin can upload and manage photos
6. No critical bugs or errors
7. Performance meets requirements
8. Security measures are in place
9. Tests pass (80%+ coverage)
10. Documentation is complete
