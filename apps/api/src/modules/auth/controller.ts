import { FastifyRequest, FastifyReply } from 'fastify';
import { hash, compare } from 'bcrypt';
import { db } from '@bulgaria/db';
import { CreateUserSchema } from '@bulgaria/types';
import { z } from 'zod';

const SALT_ROUNDS = 10;
const JWT_EXPIRATION = '7d'; // 7 days

// Register handler
export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = CreateUserSchema.parse(request.body);

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: body.email }, { username: body.username }],
      },
    });

    if (existingUser) {
      return reply.status(400).send({
        success: false,
        error: 'User with this email or username already exists',
      });
    }

    // Hash password if provided
    const hashedPassword = body.password
      ? await hash(body.password, SALT_ROUNDS)
      : undefined;

    // Create user
    const user = await db.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashedPassword,
        avatarId: body.avatarId,
        provider: body.provider,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarId: true,
        provider: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = request.server.jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      { expiresIn: JWT_EXPIRATION }
    );

    return reply.status(201).send({
      success: true,
      data: {
        user,
        token,
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

// Login handler
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = LoginSchema.parse(request.body);

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = request.server.jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      { expiresIn: JWT_EXPIRATION }
    );

    return reply.send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatarId: user.avatarId,
          provider: user.provider,
        },
        token,
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

// Google OAuth (placeholder)
export async function googleAuth(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(501).send({
    success: false,
    error: 'Google OAuth not implemented yet',
  });
}
