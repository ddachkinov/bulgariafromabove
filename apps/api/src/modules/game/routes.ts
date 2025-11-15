import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/middleware';
import { startGame, getGame, submitGuess, completeGame } from './controller';

export async function gameRoutes(fastify: FastifyInstance) {
  // All game routes require authentication
  fastify.addHook('onRequest', authenticate);

  // Start new game
  fastify.post('/start', startGame);

  // Get game state
  fastify.get('/:id', getGame);

  // Submit round guess
  fastify.post('/:id/round', submitGuess);

  // Complete game
  fastify.post('/:id/complete', completeGame);
}
