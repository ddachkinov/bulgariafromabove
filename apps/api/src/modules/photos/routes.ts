import { FastifyInstance } from 'fastify';
import { authenticate } from '../auth/middleware';
import {
  getRandomPhoto,
  uploadPhoto,
  getPhotos,
  updatePhoto,
  deletePhoto,
} from './controller';

export async function photoRoutes(fastify: FastifyInstance) {
  // Public route - get random photo for game
  fastify.get('/random', { onRequest: authenticate }, getRandomPhoto);

  // Admin routes (require authentication)
  fastify.post('/', { onRequest: authenticate }, uploadPhoto);
  fastify.get('/', { onRequest: authenticate }, getPhotos);
  fastify.put('/:id', { onRequest: authenticate }, updatePhoto);
  fastify.delete('/:id', { onRequest: authenticate }, deletePhoto);
}
