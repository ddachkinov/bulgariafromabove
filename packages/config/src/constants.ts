/**
 * Game mode configurations
 */
export const GAME_MODES = {
  CLASSIC: {
    id: 'classic',
    name: 'Classic Mode',
    description: 'Single photo, one guess',
    rounds: 1,
    timeLimit: 30, // seconds
    photoDisplayTime: 5, // seconds
  },
  FIVE_ROUND: {
    id: '5-round',
    name: '5-Round Challenge',
    description: 'Five photos, total score',
    rounds: 5,
    timeLimit: 20, // seconds per round
    photoDisplayTime: 4, // seconds per photo
  },
} as const;

/**
 * Scoring configuration
 */
export const SCORING = {
  MAX_DISTANCE: 500000, // 500km in meters
  MAX_DISTANCE_SCORE: 5000,
  MAX_TIME_BONUS: 1000,
  PERFECT_GUESS_BONUS: 500,
  PERFECT_GUESS_THRESHOLD: 100, // meters
  MIN_VALID_TIME: 0.2, // seconds
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Rate limiting
 */
export const RATE_LIMITS = {
  AUTH: {
    points: 5,
    duration: 60, // 5 requests per minute
  },
  API: {
    points: 100,
    duration: 60, // 100 requests per minute
  },
  GAME: {
    points: 20,
    duration: 60, // 20 game starts per minute
  },
} as const;

/**
 * Avatar IDs (preset avatars)
 */
export const AVATARS = [
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
  'avatar-5',
  'avatar-6',
  'avatar-7',
  'avatar-8',
] as const;

/**
 * Photo categories
 */
export const PHOTO_CATEGORIES = [
  'city',
  'landmark',
  'nature',
  'architecture',
  'coast',
  'mountain',
  'village',
  'other',
] as const;

/**
 * Leaderboard periods
 */
export const LEADERBOARD_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  ALLTIME: 'alltime',
} as const;
