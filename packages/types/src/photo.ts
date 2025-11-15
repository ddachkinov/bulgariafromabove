import { z } from 'zod';

export const PhotoSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string().optional(),
  region: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.number().min(1).max(5).default(1),
  approved: z.boolean().default(false),
  uploadedBy: z.string().optional(),
  createdAt: z.date(),
});

export type Photo = z.infer<typeof PhotoSchema>;

export const CreatePhotoSchema = z.object({
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string().optional(),
  region: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.number().min(1).max(5).default(1),
  uploadedBy: z.string().optional(),
});

export type CreatePhoto = z.infer<typeof CreatePhotoSchema>;

export const UpdatePhotoSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  approved: z.boolean().optional(),
});

export type UpdatePhoto = z.infer<typeof UpdatePhotoSchema>;
