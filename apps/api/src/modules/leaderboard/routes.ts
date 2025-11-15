import { FastifyInstance } from 'fastify';
import { getLeaderboard } from './controller';

export async function leaderboardRoutes(fastify: FastifyInstance) {
  // Get leaderboard for specific period
  fastify.get('/:period', getLeaderboard);
}
