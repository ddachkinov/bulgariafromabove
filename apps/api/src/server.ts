import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { config } from 'dotenv';

// Load environment variables
config();

// Import modules
import { authRoutes } from './modules/auth/routes';
import { gameRoutes } from './modules/game/routes';
import { photoRoutes } from './modules/photos/routes';
import { leaderboardRoutes } from './modules/leaderboard/routes';
import { userRoutes } from './modules/user/routes';
import { feedbackRoutes } from './modules/feedback/routes';

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // JWT
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(gameRoutes, { prefix: '/api/game' });
  await fastify.register(photoRoutes, { prefix: '/api/photos' });
  await fastify.register(leaderboardRoutes, { prefix: '/api/leaderboard' });
  await fastify.register(userRoutes, { prefix: '/api/user' });
  await fastify.register(feedbackRoutes, { prefix: '/api/feedback' });
}

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    success: false,
    error: error.message || 'Internal Server Error',
    statusCode,
  });
});

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = parseInt(process.env.PORT || '4000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
