import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@bulgaria/db';
import { UpdateUserSchema } from '@bulgaria/types';
import { z } from 'zod';

// Get user profile
export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const user = await db.user.findUnique({
    where: { id: request.user!.id },
    select: {
      id: true,
      email: true,
      username: true,
      avatarId: true,
      provider: true,
      createdAt: true,
    },
  });

  if (!user) {
    return reply.status(404).send({
      success: false,
      error: 'User not found',
    });
  }

  return reply.send({
    success: true,
    data: user,
  });
}

// Update user profile
export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = UpdateUserSchema.parse(request.body);

    // Check if username is taken (if updating username)
    if (body.username) {
      const existing = await db.user.findFirst({
        where: {
          username: body.username,
          NOT: { id: request.user!.id },
        },
      });

      if (existing) {
        return reply.status(400).send({
          success: false,
          error: 'Username already taken',
        });
      }
    }

    const user = await db.user.update({
      where: { id: request.user!.id },
      data: body,
      select: {
        id: true,
        email: true,
        username: true,
        avatarId: true,
        provider: true,
        createdAt: true,
      },
    });

    return reply.send({
      success: true,
      data: user,
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

// Get user statistics
export async function getStats(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;

  // Get all completed games
  const games = await db.game.findMany({
    where: {
      userId,
      status: 'completed',
    },
    include: {
      rounds: true,
    },
  });

  // Calculate statistics
  const totalGames = games.length;
  const bestScore =
    games.length > 0 ? Math.max(...games.map((g) => g.totalScore)) : 0;

  let totalDistance = 0;
  let roundCount = 0;
  let totalPoints = 0;

  for (const game of games) {
    totalPoints += game.totalScore;
    for (const round of game.rounds) {
      if (round.distance !== null) {
        totalDistance += round.distance;
        roundCount += 1;
      }
    }
  }

  const averageDistance = roundCount > 0 ? totalDistance / roundCount : 0;

  return reply.send({
    success: true,
    data: {
      totalGames,
      bestScore,
      averageDistance: Math.round(averageDistance),
      totalPoints,
    },
  });
}
