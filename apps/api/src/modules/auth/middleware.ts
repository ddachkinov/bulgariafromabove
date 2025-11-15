import { FastifyRequest, FastifyReply } from 'fastify';

// Type for authenticated user
export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

// Authentication middleware
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return reply.status(401).send({
        success: false,
        error: 'No token provided',
      });
    }

    const decoded = request.server.jwt.verify<AuthUser>(token);
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: 'Invalid or expired token',
    });
  }
}
