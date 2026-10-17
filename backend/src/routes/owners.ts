import type { FastifyInstance } from 'fastify';
import { prisma } from '../prisma.js';
import { DEFAULT_OWNER_EMAIL } from '../defaultOwner.js';

interface OwnerBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
}

export async function ownerRoutes(app: FastifyInstance) {
  // List owners with their pets.
  app.get('/owners', async () => {
    return prisma.owner.findMany({
      include: { pets: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  // Get the canonical default owner (personal mode). Lets the frontend resolve
  // the implicit owner's id without any owner UI. Looked up by the documented
  // seeded email, so it doesn't depend on row ordering. Registered before
  // `/owners/:id` — Fastify prioritizes static routes over parametric ones, so
  // "default" is never treated as an id.
  app.get('/owners/default', async (_request, reply) => {
    const owner = await prisma.owner.findUnique({
      where: { email: DEFAULT_OWNER_EMAIL },
    });
    if (!owner) {
      return reply
        .code(404)
        .send({ message: 'Default owner not found. Run the database seed.' });
    }
    return owner;
  });

  // Get a single owner with pets and each pet's health records.
  app.get('/owners/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const owner = await prisma.owner.findUnique({
      where: { id },
      include: { pets: { include: { bloodTests: true, vaccinations: true } } },
    });
    if (!owner) return reply.code(404).send({ message: 'Owner not found' });
    return owner;
  });

  // Create an owner.
  app.post('/owners', async (request, reply) => {
    const body = (request.body ?? {}) as OwnerBody;

    if (typeof body.name !== 'string' || body.name.trim() === '') {
      return reply.code(400).send({ message: 'name is required' });
    }
    if (typeof body.email !== 'string' || !body.email.includes('@')) {
      return reply.code(400).send({ message: 'a valid email is required' });
    }

    const existing = await prisma.owner.findUnique({ where: { email: body.email } });
    if (existing) return reply.code(409).send({ message: 'email already in use' });

    const owner = await prisma.owner.create({
      data: {
        name: body.name.trim(),
        email: body.email,
        phone: typeof body.phone === 'string' ? body.phone : null,
      },
    });
    return reply.code(201).send(owner);
  });

  // Delete an owner (cascades to pets and their health records).
  app.delete('/owners/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.owner.delete({ where: { id } });
      return reply.code(204).send();
    } catch {
      return reply.code(404).send({ message: 'Owner not found' });
    }
  });
}
