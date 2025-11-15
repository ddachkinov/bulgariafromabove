import { z } from 'zod';

export const GameModeSchema = z.enum(['classic', '5-round']);
export type GameMode = z.infer<typeof GameModeSchema>;

export const GameStatusSchema = z.enum(['in_progress', 'completed']);
export type GameStatus = z.infer<typeof GameStatusSchema>;

export const GameSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mode: GameModeSchema,
  status: GameStatusSchema,
  totalScore: z.number().default(0),
  startedAt: z.date(),
  completedAt: z.date().optional(),
});

export type Game = z.infer<typeof GameSchema>;

export const RoundSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  photoId: z.string(),
  roundNumber: z.number().min(1),
  guessLat: z.number().min(-90).max(90).optional(),
  guessLng: z.number().min(-180).max(180).optional(),
  distance: z.number().optional(),
  timeSpent: z.number().optional(),
  points: z.number().optional(),
  createdAt: z.date(),
});

export type Round = z.infer<typeof RoundSchema>;

export const CreateGameSchema = z.object({
  userId: z.string(),
  mode: GameModeSchema,
});

export type CreateGame = z.infer<typeof CreateGameSchema>;

export const SubmitGuessSchema = z.object({
  guessLat: z.number().min(-90).max(90),
  guessLng: z.number().min(-180).max(180),
  timeSpent: z.number().min(0),
});

export type SubmitGuess = z.infer<typeof SubmitGuessSchema>;

export const RoundResultSchema = z.object({
  roundNumber: z.number(),
  photoUrl: z.string(),
  actualLat: z.number(),
  actualLng: z.number(),
  guessLat: z.number(),
  guessLng: z.number(),
  distance: z.number(),
  timeSpent: z.number(),
  points: z.number(),
});

export type RoundResult = z.infer<typeof RoundResultSchema>;

export const GameResultSchema = z.object({
  gameId: z.string(),
  mode: GameModeSchema,
  rounds: z.array(RoundResultSchema),
  totalScore: z.number(),
  averageDistance: z.number(),
  totalTime: z.number(),
});

export type GameResult = z.infer<typeof GameResultSchema>;
