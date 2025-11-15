import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@bulgaria/db';
import { CreateFeedbackSchema } from '@bulgaria/types';
import { z } from 'zod';

// Submit feedback
export async function submitFeedback(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = CreateFeedbackSchema.parse(request.body);

    // Auto-attach user ID from auth token
    const feedback = await db.feedback.create({
      data: {
        userId: request.user!.id,
        subject: body.subject,
        message: body.message,
        deviceInfo: body.deviceInfo || JSON.stringify(request.headers),
      },
    });

    return reply.status(201).send({
      success: true,
      data: feedback,
      message: 'Thank you for your feedback!',
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

// Get all feedback (admin only)
const GetFeedbackQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export async function getFeedback(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const query = GetFeedbackQuerySchema.parse(request.query);

    const [feedback, total] = await Promise.all([
      db.feedback.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.feedback.count(),
    ]);

    return reply.send({
      success: true,
      data: {
        feedback,
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
