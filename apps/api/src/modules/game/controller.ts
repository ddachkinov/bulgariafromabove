import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@bulgaria/db';
import { CreateGameSchema, SubmitGuessSchema } from '@bulgaria/types';
import { calculateRoundScore, isValidGuessTime, getTimeLimit } from '@bulgaria/utils';
import { z } from 'zod';

// Start new game
export async function startGame(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = CreateGameSchema.parse({
      ...request.body,
      userId: request.user!.id,
    });

    // Create game
    const game = await db.game.create({
      data: {
        userId: body.userId,
        mode: body.mode,
        status: 'in_progress',
      },
    });

    // Get first random photo
    const photo = await getRandomPhoto();

    if (!photo) {
      return reply.status(404).send({
        success: false,
        error: 'No photos available',
      });
    }

    // Create first round
    await db.round.create({
      data: {
        gameId: game.id,
        photoId: photo.id,
        roundNumber: 1,
      },
    });

    // Return game with photo (without location data)
    return reply.status(201).send({
      success: true,
      data: {
        gameId: game.id,
        mode: game.mode,
        roundNumber: 1,
        photo: {
          id: photo.id,
          url: photo.url,
          // Don't send location data to client
        },
        timeLimit: getTimeLimit(game.mode as 'classic' | '5-round'),
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

// Get game state
export async function getGame(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const game = await db.game.findUnique({
    where: { id },
    include: {
      rounds: {
        include: {
          photo: true,
        },
      },
    },
  });

  if (!game) {
    return reply.status(404).send({
      success: false,
      error: 'Game not found',
    });
  }

  // Verify game belongs to user
  if (game.userId !== request.user!.id) {
    return reply.status(403).send({
      success: false,
      error: 'Access denied',
    });
  }

  return reply.send({
    success: true,
    data: game,
  });
}

// Submit round guess
export async function submitGuess(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    const guess = SubmitGuessSchema.parse(request.body);

    // Get game
    const game = await db.game.findUnique({
      where: { id },
      include: {
        rounds: {
          orderBy: { roundNumber: 'desc' },
          take: 1,
          include: { photo: true },
        },
      },
    });

    if (!game) {
      return reply.status(404).send({
        success: false,
        error: 'Game not found',
      });
    }

    // Verify game belongs to user
    if (game.userId !== request.user!.id) {
      return reply.status(403).send({
        success: false,
        error: 'Access denied',
      });
    }

    // Verify game is in progress
    if (game.status !== 'in_progress') {
      return reply.status(400).send({
        success: false,
        error: 'Game is not in progress',
      });
    }

    // Get current round
    const currentRound = game.rounds[0];
    if (!currentRound) {
      return reply.status(404).send({
        success: false,
        error: 'No active round found',
      });
    }

    // Anti-cheat: Check if round already has a guess (prevent double submission)
    if (currentRound.guessLat !== null || currentRound.guessLng !== null) {
      return reply.status(400).send({
        success: false,
        error: 'Guess already submitted for this round',
      });
    }

    // Anti-cheat: Validate guess time
    if (!isValidGuessTime(guess.timeSpent)) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid guess time',
      });
    }

    // Calculate score
    const { distance, score } = calculateRoundScore(
      guess.guessLat,
      guess.guessLng,
      currentRound.photo.latitude,
      currentRound.photo.longitude,
      guess.timeSpent,
      getTimeLimit(game.mode as 'classic' | '5-round')
    );

    // Update round and game score in a transaction (prevent race conditions)
    await db.$transaction([
      db.round.update({
        where: { id: currentRound.id },
        data: {
          guessLat: guess.guessLat,
          guessLng: guess.guessLng,
          distance,
          timeSpent: guess.timeSpent,
          points: score,
        },
      }),
      db.game.update({
        where: { id: game.id },
        data: {
          totalScore: {
            increment: score,
          },
        },
      }),
    ]);

    // Check if game should continue
    const maxRounds = game.mode === '5-round' ? 5 : 1;
    const shouldContinue = currentRound.roundNumber < maxRounds;

    let nextPhoto = null;
    if (shouldContinue) {
      // Get next photo (excluding photos already used in this game)
      const photo = await getRandomPhoto(game.id);

      if (photo) {
        // Create next round
        await db.round.create({
          data: {
            gameId: game.id,
            photoId: photo.id,
            roundNumber: currentRound.roundNumber + 1,
          },
        });

        nextPhoto = {
          id: photo.id,
          url: photo.url,
        };
      }
    }

    // Return result
    return reply.send({
      success: true,
      data: {
        roundNumber: currentRound.roundNumber,
        result: {
          actualLat: currentRound.photo.latitude,
          actualLng: currentRound.photo.longitude,
          guessLat: guess.guessLat,
          guessLng: guess.guessLng,
          distance,
          points: score,
          timeSpent: guess.timeSpent,
        },
        gameScore: game.totalScore + score,
        hasNextRound: shouldContinue && nextPhoto !== null,
        nextPhoto,
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

// Complete game
export async function completeGame(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };

  // Get game
  const game = await db.game.findUnique({
    where: { id },
    include: {
      rounds: {
        include: { photo: true },
        orderBy: { roundNumber: 'asc' },
      },
    },
  });

  if (!game) {
    return reply.status(404).send({
      success: false,
      error: 'Game not found',
    });
  }

  // Verify game belongs to user
  if (game.userId !== request.user!.id) {
    return reply.status(403).send({
      success: false,
      error: 'Access denied',
    });
  }

  // Update game status
  const updatedGame = await db.game.update({
    where: { id },
    data: {
      status: 'completed',
      completedAt: new Date(),
    },
  });

  // Calculate average distance
  const totalDistance = game.rounds.reduce(
    (sum, round) => sum + (round.distance || 0),
    0
  );
  const avgDistance = totalDistance / game.rounds.length;

  // Save score to leaderboard
  await db.score.create({
    data: {
      userId: game.userId,
      gameId: game.id,
      mode: game.mode,
      totalScore: game.totalScore,
      avgDistance,
    },
  });

  // Return game summary
  return reply.send({
    success: true,
    data: {
      gameId: game.id,
      mode: game.mode,
      totalScore: game.totalScore,
      avgDistance,
      rounds: game.rounds.map((round) => ({
        roundNumber: round.roundNumber,
        photoUrl: round.photo.url,
        actualLat: round.photo.latitude,
        actualLng: round.photo.longitude,
        guessLat: round.guessLat,
        guessLng: round.guessLng,
        distance: round.distance,
        points: round.points,
        timeSpent: round.timeSpent,
      })),
    },
  });
}

// Helper: Get random photo (excluding recently used)
async function getRandomPhoto(excludeGameId?: string) {
  // Get photo IDs already used in this game
  let usedPhotoIds: string[] = [];
  if (excludeGameId) {
    const usedRounds = await db.round.findMany({
      where: { gameId: excludeGameId },
      select: { photoId: true },
    });
    usedPhotoIds = usedRounds.map((r) => r.photoId);
  }

  // Get approved photos excluding those already used in this game
  const photos = await db.photo.findMany({
    where: {
      approved: true,
      id: { notIn: usedPhotoIds },
    },
  });

  if (photos.length === 0) {
    return null;
  }

  // Return random photo
  const randomIndex = Math.floor(Math.random() * photos.length);
  return photos[randomIndex];
}
