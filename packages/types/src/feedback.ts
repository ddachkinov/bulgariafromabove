import { z } from 'zod';

export const FeedbackSchema = z.object({
  id: z.string(),
  userId: z.string(),
  subject: z.string(),
  message: z.string(),
  deviceInfo: z.string().optional(),
  createdAt: z.date(),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

export const CreateFeedbackSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
  deviceInfo: z.string().optional(),
});

export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>;
