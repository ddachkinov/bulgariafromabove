# Bulgaria From Above - Task Breakdown

## Implementation Order

Tasks are organized by priority and dependencies. Each task includes subtasks for implementation.

---

## Phase 1: Foundation & Infrastructure

### 1.1 Project Setup ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 2-3 hours

- [x] Create specification documents
- [ ] Initialize Turborepo monorepo
- [ ] Configure package.json with workspaces
- [ ] Set up TypeScript configs
- [ ] Configure ESLint and Prettier
- [ ] Create .env.example files
- [ ] Set up basic folder structure

**Dependencies**: None
**Deliverable**: Working monorepo with linting and formatting

---

### 1.2 Shared Packages Setup ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 3-4 hours

#### packages/types
- [ ] Create shared TypeScript interfaces
- [ ] User types
- [ ] Game types
- [ ] Photo types
- [ ] Score types
- [ ] API response types

#### packages/utils
- [ ] Geo utilities (Haversine distance)
- [ ] Scoring functions
- [ ] Validation helpers
- [ ] Format helpers (distance, time, score)

#### packages/config
- [ ] Environment variable schemas
- [ ] Constants (game modes, time limits, etc.)
- [ ] Feature flags

**Dependencies**: 1.1
**Deliverable**: Shared packages available to all apps

---

### 1.3 Database Setup ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 3-4 hours

#### packages/db
- [ ] Initialize Prisma
- [ ] Create schema.prisma with all models:
  - User
  - Photo
  - Game
  - Round
  - Score
  - Feedback
- [ ] Add indexes for performance
- [ ] Create seed script
- [ ] Generate Prisma Client
- [ ] Export db client

**Dependencies**: 1.2
**Deliverable**: Database schema ready for migrations

---

## Phase 2: Backend API

### 2.1 API Server Foundation ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 2-3 hours

- [ ] Initialize Fastify app
- [ ] Configure CORS
- [ ] Set up request logging
- [ ] Error handling middleware
- [ ] Request validation plugin (Zod)
- [ ] Rate limiting plugin
- [ ] Health check endpoint

**Dependencies**: 1.2, 1.3
**Deliverable**: Running API server with basic middleware

---

### 2.2 Authentication Module ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 4-5 hours

- [ ] JWT token generation and verification
- [ ] Password hashing (bcrypt)
- [ ] Email registration endpoint
- [ ] Email login endpoint
- [ ] Google OAuth flow
- [ ] Token refresh endpoint
- [ ] Protected route middleware
- [ ] User session management

**Dependencies**: 2.1
**Deliverable**: Fully functional authentication system

---

### 2.3 Photo Management Module
**Priority**: P1
**Estimated Time**: 4-5 hours

- [ ] Photo upload endpoint (admin only)
- [ ] EXIF data extraction
- [ ] GPS coordinate validation
- [ ] Image resize/optimization
- [ ] S3/Spaces upload integration
- [ ] Get random photo endpoint
- [ ] Photo exclusion logic (no repeats in session)
- [ ] Photo CRUD endpoints (admin)

**Dependencies**: 2.1, 2.2
**Deliverable**: Photo management API

---

### 2.4 Game Logic Module ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 5-6 hours

- [ ] Start game endpoint
- [ ] Get game state endpoint
- [ ] Submit round guess endpoint
  - Validate guess coordinates
  - Calculate distance (Haversine)
  - Calculate score
  - Save round data
- [ ] Complete game endpoint
- [ ] Game session tracking
- [ ] Photo exclusion per session
- [ ] Anti-cheat validation:
  - Minimum guess time (0.2s)
  - Valid coordinates
  - Game state integrity

**Dependencies**: 2.1, 2.2, 2.3
**Deliverable**: Core game API functionality

---

### 2.5 Scoring Engine ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 3-4 hours

- [ ] Haversine distance calculation
- [ ] Score calculation algorithm:
  - Distance-based scoring (0-5000 points)
  - Time bonus (0-1000 points)
  - Perfect guess bonus (500 points)
- [ ] Score validation
- [ ] Score persistence
- [ ] Aggregate score for multi-round games

**Dependencies**: 2.4
**Deliverable**: Accurate, server-side scoring

---

### 2.6 Leaderboard Module
**Priority**: P1
**Estimated Time**: 3-4 hours

- [ ] Daily leaderboard query
- [ ] Weekly leaderboard query
- [ ] All-time leaderboard query
- [ ] Leaderboard pagination
- [ ] User rank calculation
- [ ] Efficient database queries with indexes

**Dependencies**: 2.4, 2.5
**Deliverable**: Leaderboard API endpoints

---

### 2.7 User Profile Module
**Priority**: P1
**Estimated Time**: 2-3 hours

- [ ] Get user profile endpoint
- [ ] Update profile endpoint (username, avatar)
- [ ] User statistics calculation:
  - Total games played
  - Best score
  - Average distance
  - Total points
- [ ] Profile validation

**Dependencies**: 2.2
**Deliverable**: User profile management

---

### 2.8 Feedback Module
**Priority**: P2
**Estimated Time**: 1-2 hours

- [ ] Submit feedback endpoint
- [ ] Auto-attach user ID and device info
- [ ] Email notification (optional)
- [ ] Admin feedback viewing endpoint

**Dependencies**: 2.1, 2.2
**Deliverable**: Feedback submission system

---

## Phase 3: Web Application (Player-Facing)

### 3.1 Next.js Setup ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 2-3 hours

- [ ] Initialize Next.js app (App Router)
- [ ] Configure TailwindCSS
- [ ] Install shadcn/ui
- [ ] Set up NextAuth.js
- [ ] Configure React Query
- [ ] Set up Zustand store
- [ ] Create base layout
- [ ] Configure environment variables

**Dependencies**: 1.1, 1.2
**Deliverable**: Next.js app with styling and state management

---

### 3.2 Authentication UI
**Priority**: P0
**Estimated Time**: 3-4 hours

- [ ] Login page
- [ ] Registration page
- [ ] Google OAuth button
- [ ] Email/password form
- [ ] Protected route wrapper
- [ ] Auth state management
- [ ] Error handling and validation
- [ ] Username and avatar selection

**Dependencies**: 3.1, 2.2
**Deliverable**: Fully functional auth UI

---

### 3.3 Home Page
**Priority**: P1
**Estimated Time**: 2-3 hours

- [ ] Hero section
- [ ] Game mode selection:
  - Play Now (Classic)
  - 5-Round Challenge
- [ ] Navigation to:
  - Leaderboard
  - Profile
  - Feedback
- [ ] Banner ad placeholder
- [ ] Responsive design

**Dependencies**: 3.1, 3.2
**Deliverable**: Functional home page

---

### 3.4 Game UI - Photo Display ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 3-4 hours

- [ ] Photo display component
- [ ] Countdown timer component
- [ ] Timer expiry handling
- [ ] Photo fade-out animation
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive image sizing

**Dependencies**: 3.1
**Deliverable**: Photo display with timer

---

### 3.5 Game UI - Map Interface ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 4-5 hours

- [ ] Mapbox GL JS integration
- [ ] Map initialization (Bulgaria bounds)
- [ ] Marker placement
- [ ] Marker drag/update
- [ ] Zoom controls
- [ ] Confirm guess button
- [ ] Map loading states
- [ ] Mobile-responsive controls

**Dependencies**: 3.1
**Deliverable**: Interactive map guessing interface

---

### 3.6 Game Flow ⭐ CRITICAL
**Priority**: P0
**Estimated Time**: 4-5 hours

- [ ] Game initialization
- [ ] Start game API call
- [ ] Photo fetch and display
- [ ] Timer countdown
- [ ] Transition to map
- [ ] Submit guess
- [ ] Calculate and display results
- [ ] Round progression
- [ ] Game completion
- [ ] State management (Zustand)

**Dependencies**: 3.4, 3.5, 2.4
**Deliverable**: Complete game loop

---

### 3.7 Results Screen
**Priority**: P1
**Estimated Time**: 3-4 hours

- [ ] Show both markers (guess vs actual)
- [ ] Distance display
- [ ] Points earned
- [ ] Time taken
- [ ] Visual feedback (colors, animations)
- [ ] Continue button
- [ ] Share results button
- [ ] Banner ad placeholder

**Dependencies**: 3.6
**Deliverable**: Results display

---

### 3.8 Game Summary (5-Round)
**Priority**: P1
**Estimated Time**: 2-3 hours

- [ ] Round-by-round breakdown
- [ ] Total score
- [ ] Average distance
- [ ] Total time
- [ ] Best/worst rounds
- [ ] Share results
- [ ] Play again button

**Dependencies**: 3.7
**Deliverable**: Multi-round game summary

---

### 3.9 Leaderboard Page
**Priority**: P1
**Estimated Time**: 3-4 hours

- [ ] Tab navigation (Daily, Weekly, All-time)
- [ ] Leaderboard table
- [ ] User rank highlighting
- [ ] Avatar display
- [ ] Pagination/infinite scroll
- [ ] Loading states
- [ ] Empty states
- [ ] Banner ad placeholder

**Dependencies**: 3.1, 2.6
**Deliverable**: Leaderboard page

---

### 3.10 Profile Page
**Priority**: P1
**Estimated Time**: 3-4 hours

- [ ] User info display
- [ ] Statistics cards:
  - Total games
  - Best score
  - Average distance
- [ ] Edit profile form
- [ ] Avatar selection
- [ ] Username update
- [ ] Logout button
- [ ] Delete account (optional)

**Dependencies**: 3.1, 2.7
**Deliverable**: User profile page

---

### 3.11 Feedback Component
**Priority**: P2
**Estimated Time**: 2 hours

- [ ] Feedback button (persistent)
- [ ] Modal/dialog
- [ ] Subject field
- [ ] Message textarea
- [ ] Submit handler
- [ ] Success/error notifications
- [ ] Auto-attach device info

**Dependencies**: 3.1, 2.8
**Deliverable**: Feedback form

---

### 3.12 Social Sharing
**Priority**: P2
**Estimated Time**: 2-3 hours

- [ ] Share button on results
- [ ] Social share links:
  - Facebook
  - Twitter/X
  - WhatsApp
  - Copy link
- [ ] Generate share text
- [ ] Optional: Screenshot generation
- [ ] Share tracking (analytics)

**Dependencies**: 3.7
**Deliverable**: Social sharing feature

---

### 3.13 Monetization UI
**Priority**: P2
**Estimated Time**: 3-4 hours

- [ ] Banner ad component
- [ ] Rewarded ad button
- [ ] Ad loading states
- [ ] Grant rewards (time/hints)
- [ ] Placeholder ads for development
- [ ] Ad integration (future: AdSense/AdMob)

**Dependencies**: 3.1
**Deliverable**: Ad placement and UI

---

## Phase 4: Admin Panel

### 4.1 Admin App Setup
**Priority**: P1
**Estimated Time**: 2 hours

- [ ] Initialize Next.js app
- [ ] Configure TailwindCSS and shadcn/ui
- [ ] Admin authentication (separate from users)
- [ ] Admin layout with sidebar
- [ ] Protected admin routes

**Dependencies**: 1.1, 1.2
**Deliverable**: Admin panel foundation

---

### 4.2 Photo Upload Page
**Priority**: P1
**Estimated Time**: 4-5 hours

- [ ] File upload component (drag-and-drop)
- [ ] EXIF data preview
- [ ] GPS coordinate input/edit
- [ ] Category dropdown
- [ ] Difficulty selector
- [ ] Batch upload support
- [ ] Upload progress
- [ ] Success/error handling

**Dependencies**: 4.1, 2.3
**Deliverable**: Photo upload interface

---

### 4.3 Photo Management Page
**Priority**: P1
**Estimated Time**: 3-4 hours

- [ ] Photo list/grid view
- [ ] Search and filters
- [ ] Approve/reject photos
- [ ] Edit photo metadata
- [ ] Delete photos
- [ ] Pagination
- [ ] Preview modal

**Dependencies**: 4.1, 2.3
**Deliverable**: Photo management interface

---

### 4.4 Dashboard & Analytics
**Priority**: P2
**Estimated Time**: 3-4 hours

- [ ] Key metrics cards:
  - Total users
  - Total games
  - Photos uploaded
  - Average score
- [ ] Recent activity feed
- [ ] Charts (optional for MVP)
- [ ] Feedback list

**Dependencies**: 4.1
**Deliverable**: Admin dashboard

---

## Phase 5: Testing & Quality

### 5.1 Unit Tests
**Priority**: P1
**Estimated Time**: 4-5 hours

- [ ] Scoring engine tests
- [ ] Distance calculation tests
- [ ] Validation helpers tests
- [ ] Utils tests
- [ ] 80%+ coverage for core logic

**Dependencies**: All backend modules
**Deliverable**: Unit test suite

---

### 5.2 Integration Tests
**Priority**: P1
**Estimated Time**: 3-4 hours

- [ ] Auth flow tests
- [ ] Game flow tests
- [ ] Leaderboard tests
- [ ] API endpoint tests

**Dependencies**: Phase 2
**Deliverable**: Integration test suite

---

### 5.3 E2E Tests
**Priority**: P2
**Estimated Time**: 4-5 hours

- [ ] User registration flow
- [ ] Full game playthrough
- [ ] Leaderboard viewing
- [ ] Profile editing
- [ ] Admin photo upload

**Dependencies**: Phase 3, Phase 4
**Deliverable**: E2E test suite (Playwright)

---

## Phase 6: Deployment & DevOps

### 6.1 CI/CD Pipeline
**Priority**: P1
**Estimated Time**: 3-4 hours

- [ ] GitHub Actions workflow
- [ ] Lint and type-check
- [ ] Run tests
- [ ] Build apps
- [ ] Deploy to staging
- [ ] E2E tests on staging
- [ ] Production deployment

**Dependencies**: 5.1, 5.2
**Deliverable**: Automated CI/CD

---

### 6.2 Environment Setup
**Priority**: P0
**Estimated Time**: 2-3 hours

- [ ] Set up staging environment
- [ ] Set up production environment
- [ ] Configure environment variables
- [ ] Database migrations
- [ ] S3/CDN setup
- [ ] Domain and SSL

**Dependencies**: All phases
**Deliverable**: Production-ready environments

---

### 6.3 Documentation
**Priority**: P1
**Estimated Time**: 2-3 hours

- [ ] Update README.md
- [ ] API documentation
- [ ] Deployment guide
- [ ] Development setup guide
- [ ] Environment variables guide
- [ ] Troubleshooting guide

**Dependencies**: All phases
**Deliverable**: Complete documentation

---

## Priority Legend

- **P0**: Critical for MVP (blocking)
- **P1**: Important for MVP (high priority)
- **P2**: Nice to have for MVP (medium priority)
- **P3**: Post-MVP (low priority)

## Estimated Timeline

- **Phase 1**: 8-11 hours
- **Phase 2**: 22-29 hours
- **Phase 3**: 33-43 hours
- **Phase 4**: 12-16 hours
- **Phase 5**: 11-14 hours
- **Phase 6**: 7-10 hours

**Total MVP**: ~93-123 hours (12-15 working days for one developer)

## Next Steps

1. Complete Phase 1 (Foundation)
2. Set up local development environment
3. Begin Phase 2 (Backend API)
4. Parallel development of Phase 3 (Frontend) once API is stable
5. Admin panel (Phase 4) can be developed in parallel
6. Testing throughout development
7. Deploy and iterate
