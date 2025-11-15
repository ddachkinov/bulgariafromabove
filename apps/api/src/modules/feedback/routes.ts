import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/middleware';
import { submitFeedback, getFeedback } from './controller';

export async function feedbackRoutes(fastify: FastifyInstance) {
  // Submit feedback (requires auth)
  fastify.post('/', { onRequest: authenticate }, submitFeedback);

  // Get all feedback (admin only, requires auth)
  fastify.get('/', { onRequest: authenticate }, getFeedback);
}
