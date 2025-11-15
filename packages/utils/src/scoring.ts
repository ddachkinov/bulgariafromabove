import { calculateDistance } from './geo';

/**
 * Configuration for scoring algorithm
 */
export const SCORING_CONFIG = {
  MAX_DISTANCE: 500000, // 500km in meters
  MAX_DISTANCE_SCORE: 5000, // Maximum points for distance
  MAX_TIME_BONUS: 1000, // Maximum bonus for time
  PERFECT_GUESS_BONUS: 500, // Bonus for guesses under 100m
  PERFECT_GUESS_THRESHOLD: 100, // Distance threshold for perfect guess (meters)
  MIN_VALID_TIME: 0.2, // Minimum time for a valid guess (seconds)
} as const;

/**
 * Calculate score for a round based on distance and time
 * @param distanceMeters - Distance between guess and actual location in meters
 * @param timeSeconds - Time taken to make the guess in seconds
 * @param maxTime - Maximum allowed time for the round in seconds
 * @returns Calculated score (0-6500 points)
 */
export function calculateScore(
  distanceMeters: number,
  timeSeconds: number,
  maxTime: number
): number {
  // Distance score (0-5000 points)
  // Closer = more points, further = fewer points
  const distanceScore = Math.max(
    0,
    SCORING_CONFIG.MAX_DISTANCE_SCORE *
      (1 - distanceMeters / SCORING_CONFIG.MAX_DISTANCE)
  );

  // Time bonus (0-1000 points)
  // Faster = more bonus, slower = less bonus
  const timeBonus = Math.max(
    0,
    SCORING_CONFIG.MAX_TIME_BONUS * (1 - timeSeconds / maxTime)
  );

  // Perfect guess bonus (500 points if distance < 100m)
  const perfectBonus =
    distanceMeters < SCORING_CONFIG.PERFECT_GUESS_THRESHOLD
      ? SCORING_CONFIG.PERFECT_GUESS_BONUS
      : 0;

  return Math.round(distanceScore + timeBonus + perfectBonus);
}

/**
 * Calculate score for a round given coordinates and time
 * @param guessLat - Latitude of guess
 * @param guessLng - Longitude of guess
 * @param actualLat - Latitude of actual location
 * @param actualLng - Longitude of actual location
 * @param timeSeconds - Time taken to make the guess
 * @param maxTime - Maximum allowed time for the round
 * @returns Object containing distance and score
 */
export function calculateRoundScore(
  guessLat: number,
  guessLng: number,
  actualLat: number,
  actualLng: number,
  timeSeconds: number,
  maxTime: number
): { distance: number; score: number } {
  const distance = calculateDistance(guessLat, guessLng, actualLat, actualLng);
  const score = calculateScore(distance, timeSeconds, maxTime);

  return { distance, score };
}

/**
 * Validate if a guess time is legitimate (anti-cheat)
 * @param timeSeconds - Time taken to make the guess
 * @returns true if valid, false otherwise
 */
export function isValidGuessTime(timeSeconds: number): boolean {
  return timeSeconds >= SCORING_CONFIG.MIN_VALID_TIME;
}

/**
 * Get time limit based on game mode
 * @param mode - Game mode ('classic' or '5-round')
 * @returns Time limit in seconds
 */
export function getTimeLimit(mode: 'classic' | '5-round'): number {
  switch (mode) {
    case 'classic':
      return 30; // 30 seconds for classic mode
    case '5-round':
      return 20; // 20 seconds per round for 5-round challenge
    default:
      return 30;
  }
}
