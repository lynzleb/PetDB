import type { FastifyInstance } from 'fastify';
import { prisma } from '../prisma.js';

const SPECIES = ['DOG', 'CAT', 'BIRD', 'RABBIT', 'REPTILE', 'OTHER'] as const;
type Species = (typeof SPECIES)[number];

interface PetBody {
  name?: unknown;
  species?: unknown;
  breed?: unknown;
  birthDate?: unknown;
  ownerId?: unknown;
}

export async function petRoutes(app: FastifyInstance) {
  // List all pets with their owner and health records (latest first).
  app.get('/pets', async () => {
    return prisma.pet.findMany({
      include: {
        owner: true,
        bloodTests: { orderBy: { takenAt: 'desc' } },
        vaccinations: { orderBy: { administeredAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  // Get a single pet by id.
  app.get('/pets/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { owner: true, bloodTests: true, vaccinations: true },
    });
    if (!pet) return reply.code(404).send({ message: 'Pet not found' });
    return pet;
  });

  // Create a pet for an owner.
  app.post('/pets', async (request, reply) => {
    const body = (request.body ?? {}) as PetBody;

    if (typeof body.name !== 'string' || body.name.trim() === '') {
      return reply.code(400).send({ message: 'name is required' });
    }
    if (typeof body.species !== 'string' || !SPECIES.includes(body.species as Species)) {
      return reply.code(400).send({ message: `species must be one of ${SPECIES.join(', ')}` });
    }
    if (typeof body.ownerId !== 'string') {
      return reply.code(400).send({ message: 'ownerId is required' });
    }

    const owner = await prisma.owner.findUnique({ where: { id: body.ownerId } });
    if (!owner) return reply.code(404).send({ message: 'Owner not found' });

    const pet = await prisma.pet.create({
      data: {
        name: body.name.trim(),
        species: body.species as Species,
        breed: typeof body.breed === 'string' ? body.breed : null,
        birthDate: typeof body.birthDate === 'string' ? new Date(body.birthDate) : null,
        ownerId: body.ownerId,
      },
    });
    return reply.code(201).send(pet);
  });

  // Delete a pet (cascades to blood tests and vaccinations).
  app.delete('/pets/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.pet.delete({ where: { id } });
      return reply.code(204).send();
    } catch {
      return reply.code(404).send({ message: 'Pet not found' });
    }
  });

  // --- Health records nested under a pet ---

  // Add a blood test result to a pet.
  app.post('/pets/:id/blood-tests', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = (request.body ?? {}) as Record<string, unknown>;

    if (typeof body.testType !== 'string' || typeof body.unit !== 'string') {
      return reply.code(400).send({ message: 'testType and unit are required' });
    }
    if (typeof body.value !== 'number') {
      return reply.code(400).send({ message: 'value must be a number' });
    }

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) return reply.code(404).send({ message: 'Pet not found' });

    const test = await prisma.bloodTest.create({
      data: {
        petId: id,
        testType: body.testType,
        value: body.value,
        unit: body.unit,
        takenAt: typeof body.takenAt === 'string' ? new Date(body.takenAt) : new Date(),
        notes: typeof body.notes === 'string' ? body.notes : null,
      },
    });
    return reply.code(201).send(test);
  });

  // Record a vaccination for a pet.
  app.post('/pets/:id/vaccinations', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = (request.body ?? {}) as Record<string, unknown>;

    if (typeof body.vaccineName !== 'string') {
      return reply.code(400).send({ message: 'vaccineName is required' });
    }

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) return reply.code(404).send({ message: 'Pet not found' });

    const vax = await prisma.vaccination.create({
      data: {
        petId: id,
        vaccineName: body.vaccineName,
        administeredAt:
          typeof body.administeredAt === 'string' ? new Date(body.administeredAt) : new Date(),
        nextDueAt: typeof body.nextDueAt === 'string' ? new Date(body.nextDueAt) : null,
        notes: typeof body.notes === 'string' ? body.notes : null,
      },
    });
    return reply.code(201).send(vax);
  });
}
