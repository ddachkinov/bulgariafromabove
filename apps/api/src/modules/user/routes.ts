import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/middleware';
import { getProfile, updateProfile, getStats } from './controller';

export async function userRoutes(fastify: FastifyInstance) {
  // All user routes require authentication
  fastify.addHook('onRequest', authenticate);

  // Get user profile
  fastify.get('/profile', getProfile);

  // Update user profile
  fastify.put('/profile', updateProfile);

  // Get user statistics
  fastify.get('/stats', getStats);
}
