import { z } from 'zod';
import { GameModeSchema } from './game';

export const ScoreSchema = z.object({
  id: z.string(),
  userId: z.string(),
  gameId: z.string(),
  mode: GameModeSchema,
  totalScore: z.number(),
  avgDistance: z.number().optional(),
  createdAt: z.date(),
});

export type Score = z.infer<typeof ScoreSchema>;

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  userId: z.string(),
  username: z.string(),
  avatarId: z.string().optional(),
  totalScore: z.number(),
  avgDistance: z.number().optional(),
  gamesPlayed: z.number(),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const LeaderboardPeriodSchema = z.enum(['daily', 'weekly', 'alltime']);
export type LeaderboardPeriod = z.infer<typeof LeaderboardPeriodSchema>;
