import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@bulgaria/db';
import { CreatePhotoSchema, UpdatePhotoSchema } from '@bulgaria/types';
import { z } from 'zod';

// Helper: Check if user is admin
async function checkAdmin(userId: string, reply: FastifyReply): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  if (!user || !user.isAdmin) {
    reply.status(403).send({
      success: false,
      error: 'Admin access required',
    });
    return false;
  }

  return true;
}

// Get random photo (for game)
export async function getRandomPhoto(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const photos = await db.photo.findMany({
    where: { approved: true },
  });

  if (photos.length === 0) {
    return reply.status(404).send({
      success: false,
      error: 'No photos available',
    });
  }

  const randomIndex = Math.floor(Math.random() * photos.length);
  const photo = photos[randomIndex];

  return reply.send({
    success: true,
    data: {
      id: photo.id,
      url: photo.url,
      // Don't send location data
    },
  });
}

// Upload photo (admin only)
export async function uploadPhoto(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Check admin access
    const isAdmin = await checkAdmin(request.user!.id, reply);
    if (!isAdmin) return;

    const body = CreatePhotoSchema.parse({
      ...request.body,
      uploadedBy: request.user!.id,
    });

    const photo = await db.photo.create({
      data: body,
    });

    return reply.status(201).send({
      success: true,
      data: photo,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    throw error;
  }
}

// Get all photos (admin only)
const GetPhotosQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  approved: z.coerce.boolean().optional(),
  category: z.string().optional(),
});

export async function getPhotos(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Check admin access
    const isAdmin = await checkAdmin(request.user!.id, reply);
    if (!isAdmin) return;

    const query = GetPhotosQuerySchema.parse(request.query);

    const where: any = {};
    if (query.approved !== undefined) {
      where.approved = query.approved;
    }
    if (query.category) {
      where.category = query.category;
    }

    const [photos, total] = await Promise.all([
      db.photo.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.photo.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: {
        photos,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          hasMore: query.page * query.limit < total,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    throw error;
  }
}

// Update photo (admin only)
export async function updatePhoto(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Check admin access
    const isAdmin = await checkAdmin(request.user!.id, reply);
    if (!isAdmin) return;

    const { id } = request.params as { id: string };
    const body = UpdatePhotoSchema.parse(request.body);

    const photo = await db.photo.update({
      where: { id },
      data: body,
    });

    return reply.send({
      success: true,
      data: photo,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    throw error;
  }
}

// Delete photo (admin only)
export async function deletePhoto(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Check admin access
  const isAdmin = await checkAdmin(request.user!.id, reply);
  if (!isAdmin) return;

  const { id } = request.params as { id: string };

  await db.photo.delete({
    where: { id },
  });

  return reply.send({
    success: true,
    message: 'Photo deleted successfully',
  });
}
