# Bulgaria From Above - Specification Document

## Project Overview

**Bulgaria From Above** is a geo-quiz online game where players view photos of locations in Bulgaria and guess where they were taken by placing markers on a map.

### Core Concept

1. Player starts a game session
2. A geo-tagged photo is displayed for a few seconds (configurable per game mode)
3. Photo disappears after the timer expires
4. Player places a marker on a map to guess the location
5. System calculates score based on:
   - Distance between guess and actual location
   - Time taken to make the guess
6. Results are shown with actual location vs. guess
7. Player continues to next round or finishes game

## MVP Features (Must Have)

### 1. Core Gameplay

- **Photo Display**: Show geo-tagged photo for configurable duration
- **Timer**: Countdown timer specific to game mode
- **Map Interface**: Interactive map for placing guess markers
- **Scoring**: Distance-based + time-based scoring
- **Results Screen**:
  - Show actual location vs. player's guess
  - Display points earned
  - Option to continue to next round

### 2. Game Modes

#### Classic Mode
- Single timed photo
- One guess
- One score calculation

#### 5-Round Challenge
- Five consecutive photos
- Individual scores per round
- Total score summary at the end

### 3. User Accounts

- **Authentication**:
  - Email sign-in
  - Google OAuth
- **Profile**:
  - Username
  - Avatar (preset icons)
  - Total games played
  - Best score
  - Average distance from target

### 4. Leaderboard

- **Categories**:
  - Daily
  - Weekly
  - All-time
- **Display**:
  - Username
  - Total score
  - Avatar
- **Anti-cheat**: All scores computed server-side

### 5. Photo Database (Admin-Only for MVP)

- **Admin Panel** for photo uploads
- **Upload Form Fields**:
  - File upload
  - GPS coordinates (from EXIF metadata or manual entry)
  - Category (city/region)
  - Optional difficulty level
- **Photo Management**:
  - EXIF extraction
  - Image resizing
  - NSFW detection
  - Approval workflow

### 6. Monetization (Lightweight MVP)

#### A. Rewarded Ads
Watch an ad to receive:
- Additional viewing time for next photo, OR
- One hint (approximate region)

#### B. Banner Ads
Displayed on:
- Home screen
- Leaderboard
- Results screen

#### C. Placeholder
- Subtle "Your ad could be here" label or info popover

### 7. Feedback System

- Feedback button accessible from main menu
- Form fields:
  - Subject
  - Message
- Auto-attached metadata:
  - User ID
  - Device information
  - Timestamp

### 8. Social Sharing

- Share score after game completion
- Predefined message template
- Link to the game
- Optional: Generated screenshot of results

### 9. Anti-Cheat Measures

- All scoring calculations server-side
- No repeated photos in single session
- Reject impossible guess times (< 0.2 seconds)
- Validate GPS coordinates
- Rate limiting on API endpoints

## Explicitly NOT in MVP

These features are planned for later phases:

- User photo uploads
- Sponsored quiz packs
- Tournaments
- Friends system
- Custom quiz marketplace
- Real-time multiplayer
- Advanced analytics
- User-generated custom quizzes

## Technical Requirements

### Performance
- Photo load time: < 2 seconds
- Map interaction: < 100ms response time
- Score calculation: < 500ms

### Security
- Secure authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- SQL injection prevention
- XSS protection

### Scalability
- Support 1000+ concurrent users
- Database indexing for fast queries
- CDN for image delivery
- Caching strategies

### Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## User Experience

### UI/UX Principles
- Clean, minimal interface
- Intuitive controls
- Fast loading times
- Mobile-responsive design
- Accessible (WCAG 2.1 AA)

### Key User Flows

#### New User Flow
1. Land on home page
2. Click "Play Now"
3. Prompted to sign in (Google or Email)
4. Create username and select avatar
5. Start first game

#### Gameplay Flow
1. Game starts
2. Photo appears with timer
3. Timer expires, photo disappears
4. Map interface appears
5. User places marker and confirms
6. Results screen shows score
7. Continue to next round or end game
8. Option to share results

#### Admin Flow
1. Admin logs in
2. Access admin panel
3. Upload photo(s)
4. Enter/verify GPS coordinates
5. Set category and difficulty
6. Submit for processing
7. Review and approve processed photos

## Success Metrics

- User engagement: Average games per user
- Retention: Daily/Weekly active users
- Accuracy: Average distance from target
- Performance: Page load times
- Error rate: < 1% failed requests

## Constraints

- Budget: Minimize cloud costs (use free tiers where possible)
- Time: MVP delivered in phased approach
- Team: Single developer initially
- Moderation: No user-generated content in MVP to avoid moderation complexity

## Future Enhancements (Post-MVP)

1. User photo uploads with moderation
2. Custom quiz creation and sharing
3. Friend challenges
4. Tournaments with prizes
5. Mobile apps (iOS/Android)
6. Advanced statistics and analytics
7. Multiple difficulty levels
8. Region-specific quizzes
9. Educational content integration
10. Sponsored content and partnerships
