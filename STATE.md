# Bulgaria From Above - Current State

**Last Updated**: 2025-11-15

---

## Current Phase

**Phase 1: Foundation & Infrastructure** - In Progress

---

## Completed Tasks

### Documentation
- [x] SPEC.md created
- [x] PROJECT_PLAN.md created
- [x] TASKS.md created
- [x] STATE.md created

---

## In Progress

### 1.1 Project Setup
- [x] Create specification documents
- [ ] Initialize Turborepo monorepo
- [ ] Configure package.json with workspaces
- [ ] Set up TypeScript configs
- [ ] Configure ESLint and Prettier
- [ ] Create .env.example files
- [ ] Set up basic folder structure

**Status**: Starting now
**Blockers**: None
**ETA**: 2-3 hours

---

## Pending (Next Up)

### High Priority (P0)
1. Complete Project Setup (1.1)
2. Shared Packages Setup (1.2)
3. Database Setup (1.3)
4. API Server Foundation (2.1)
5. Authentication Module (2.2)
6. Game Logic Module (2.4)
7. Scoring Engine (2.5)

### Medium Priority (P1)
- Photo Management Module (2.3)
- Leaderboard Module (2.6)
- User Profile Module (2.7)
- Next.js Web App Setup (3.1)
- Game UI Components (3.4, 3.5, 3.6)

---

## Blockers

None at this time.

---

## Decisions Made

### Technology Stack
- **Monorepo**: Turborepo
- **Frontend**: Next.js 14+ with App Router
- **Backend**: Fastify + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Maps**: Mapbox GL JS
- **Hosting**: Vercel (frontend) + AWS/DigitalOcean (backend)

### Architecture Patterns
- Server-side score calculation only (anti-cheat)
- JWT-based authentication
- REST API (not GraphQL for simplicity)
- React Query for server state
- Zustand for client state

### Scope Decisions
- **In MVP**: Admin-only photo uploads
- **Not in MVP**: User-generated content, tournaments, friends system
- **Lightweight Monetization**: Banner ads + rewarded ads (placeholders for now)

---

## Open Questions

### Technical
1. **Map Provider**: Mapbox (paid) vs Leaflet + OSM (free)?
   - **Decision**: Start with Leaflet for MVP, migrate to Mapbox if budget allows

2. **Image Storage**: AWS S3 vs DigitalOcean Spaces vs Vercel Blob?
   - **Decision**: DigitalOcean Spaces (cost-effective, S3-compatible)

3. **Background Jobs**: BullMQ vs AWS SQS?
   - **Decision**: Defer to post-MVP (manual approval for now)

### Business
1. **Photo Sourcing**: Where to get initial photos?
   - **Action**: Admin to manually curate and upload

2. **Ad Provider**: Google AdSense, others?
   - **Decision**: Placeholders in MVP, integrate ads in phase 2

---

## Environment Setup

### Required Services
- [ ] PostgreSQL database
- [ ] DigitalOcean Spaces (or S3) for images
- [ ] Mapbox account (optional, using Leaflet first)
- [ ] Google OAuth credentials
- [ ] Email service (SendGrid/Resend for transactional emails)

### Environment Variables Needed
```
# Database
DATABASE_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Storage
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Maps (optional)
MAPBOX_TOKEN=

# Email (optional for MVP)
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```

---

## Risks & Mitigation

### Technical Risks
| Risk | Impact | Mitigation | Status |
|------|--------|------------|--------|
| Mapbox API costs | Medium | Use Leaflet + OSM for MVP | ✅ Mitigated |
| Image storage costs | Medium | Compress images, use CDN, DigitalOcean Spaces | ✅ Mitigated |
| Database performance | Low | Proper indexing, query optimization | ⚠️ Monitor |
| Anti-cheat bypass | High | Server-side validation, rate limiting | ✅ Planned |

### Business Risks
| Risk | Impact | Mitigation | Status |
|------|--------|------------|--------|
| Low initial content | High | Admin curates quality photos | ⏳ In progress |
| User engagement | Medium | Focus on core gameplay quality | ⏳ TBD |
| Monetization | Low | Lightweight ads, optional for MVP | ✅ Deferred |

---

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Photo load time | < 2s | ⏳ Not tested |
| Map interaction | < 100ms | ⏳ Not tested |
| Score calculation | < 500ms | ⏳ Not implemented |
| API response time | < 300ms (p95) | ⏳ Not tested |
| Database queries | < 100ms (p95) | ⏳ Not tested |

---

## Test Coverage

| Area | Coverage | Status |
|------|----------|--------|
| Scoring engine | 0% | ⏳ Not started |
| Authentication | 0% | ⏳ Not started |
| Game logic | 0% | ⏳ Not started |
| API endpoints | 0% | ⏳ Not started |
| E2E tests | 0% | ⏳ Not started |

**Target**: 80%+ for core logic

---

## Deployment Status

| Environment | Status | URL |
|-------------|--------|-----|
| Development | ⏳ Not set up | localhost |
| Staging | ⏳ Not deployed | TBD |
| Production | ⏳ Not deployed | TBD |

---

## Next Actions

### Immediate (Today)
1. Initialize Turborepo monorepo
2. Set up folder structure
3. Configure TypeScript and linting
4. Create shared packages skeleton
5. Initialize Prisma schema

### Short-term (This Week)
1. Complete Phase 1 (Foundation)
2. Build backend API foundation
3. Implement authentication
4. Start game logic module

### Medium-term (Next Week)
1. Complete backend API
2. Build web app UI
3. Implement core gameplay
4. Set up admin panel

---

## Dependencies & External Resources

### APIs & Services
- [Mapbox](https://www.mapbox.com/) - Maps (optional)
- [Leaflet](https://leafletjs.com/) - Maps (free)
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles
- [Google OAuth](https://developers.google.com/identity) - Authentication
- [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) - Image storage

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Fastify Docs](https://fastify.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)

---

## Team & Roles

| Role | Person | Status |
|------|--------|--------|
| Developer | Claude Code | Active |
| Product Owner | User | Active |
| Designer | TBD | - |
| QA | TBD | - |

---

## Metrics & KPIs (Post-Launch)

### User Metrics
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- User retention (D1, D7, D30)
- Average games per user

### Engagement Metrics
- Average score
- Average distance accuracy
- Game completion rate
- Social shares

### Technical Metrics
- API uptime (target: 99.5%)
- Page load time (target: < 3s)
- Error rate (target: < 1%)

---

## Notes

- Focus on MVP quality over feature quantity
- Prioritize core gameplay experience
- Keep monetization subtle and non-intrusive
- Plan for scalability but don't over-engineer
- Document as you go

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-11-15 | Initial state document created | Claude Code |
| 2025-11-15 | Specification documents created | Claude Code |
