import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(20),
  avatarId: z.string().optional(),
  provider: z.enum(['email', 'google']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8).optional(),
  avatarId: z.string().optional(),
  provider: z.enum(['email', 'google']).default('email'),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  avatarId: z.string().optional(),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const UserStatsSchema = z.object({
  totalGames: z.number(),
  bestScore: z.number(),
  averageDistance: z.number(),
  totalPoints: z.number(),
});

export type UserStats = z.infer<typeof UserStatsSchema>;
