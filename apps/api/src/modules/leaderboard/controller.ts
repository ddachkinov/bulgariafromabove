import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@bulgaria/db';
import { z } from 'zod';

const LeaderboardQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  mode: z.enum(['classic', '5-round']).optional(),
});

export async function getLeaderboard(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { period } = request.params as { period: string };
    const query = LeaderboardQuerySchema.parse(request.query);

    if (!['daily', 'weekly', 'alltime'].includes(period)) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid period. Must be daily, weekly, or alltime',
      });
    }

    // Calculate date filter based on period
    const now = new Date();
    let dateFilter: Date | undefined;

    if (period === 'daily') {
      dateFilter = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'weekly') {
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      dateFilter = new Date(now.setDate(now.getDate() - daysToMonday));
      dateFilter.setHours(0, 0, 0, 0);
    }

    // Build where clause
    const where: any = {};
    if (dateFilter) {
      where.createdAt = { gte: dateFilter };
    }
    if (query.mode) {
      where.mode = query.mode;
    }

    // Get scores grouped by user
    const scores = await db.score.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarId: true,
          },
        },
      },
      orderBy: {
        totalScore: 'desc',
      },
    });

    // Group by user and calculate totals
    const userScores = new Map<
      string,
      {
        userId: string;
        username: string;
        avatarId: string | null;
        totalScore: number;
        avgDistance: number;
        gamesPlayed: number;
      }
    >();

    for (const score of scores) {
      const existing = userScores.get(score.userId);
      if (existing) {
        existing.totalScore += score.totalScore;
        existing.avgDistance =
          (existing.avgDistance * existing.gamesPlayed +
            (score.avgDistance || 0)) /
          (existing.gamesPlayed + 1);
        existing.gamesPlayed += 1;
      } else {
        userScores.set(score.userId, {
          userId: score.userId,
          username: score.user.username,
          avatarId: score.user.avatarId,
          totalScore: score.totalScore,
          avgDistance: score.avgDistance || 0,
          gamesPlayed: 1,
        });
      }
    }

    // Convert to array and sort by total score
    const leaderboard = Array.from(userScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry,
      }));

    // Paginate
    const start = (query.page - 1) * query.limit;
    const end = start + query.limit;
    const paginatedLeaderboard = leaderboard.slice(start, end);

    return reply.send({
      success: true,
      data: {
        period,
        leaderboard: paginatedLeaderboard,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: leaderboard.length,
          hasMore: end < leaderboard.length,
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
