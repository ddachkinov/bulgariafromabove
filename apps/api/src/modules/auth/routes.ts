import { FastifyInstance } from 'fastify';
import { register, login, googleAuth } from './controller';

export async function authRoutes(fastify: FastifyInstance) {
  // Register new user
  fastify.post('/register', register);

  // Login with email and password
  fastify.post('/login', login);

  // Google OAuth (placeholder for now)
  fastify.get('/google', googleAuth);

  // Logout (client-side only for JWT)
  fastify.post('/logout', async (request, reply) => {
    return reply.send({ success: true, message: 'Logged out successfully' });
  });
}
