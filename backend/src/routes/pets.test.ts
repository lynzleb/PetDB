import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the shared Prisma client so the routes can be exercised via app.inject
// without a live database.
vi.mock('../prisma.js', () => ({
  prisma: {
    pet: {
      findMany: vi.fn(),
    },
  },
}));

import { buildApp } from '../app.js';
import { prisma } from '../prisma.js';

const findMany = prisma.pet.findMany as unknown as ReturnType<typeof vi.fn>;

const allPets = [
  { id: 'pet_1', name: 'Mochi', ownerId: 'owner_1' },
  { id: 'pet_2', name: 'Ada Cat', ownerId: 'owner_2' },
];

describe('GET /api/pets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findMany.mockImplementation(({ where }: { where?: { ownerId: string } }) =>
      Promise.resolve(allPets.filter((p) => !where || p.ownerId === where.ownerId)),
    );
  });

  it('returns all pets when no ownerId is given', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/api/pets' });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(2);

    const arg = findMany.mock.calls[0][0];
    expect(arg.where).toBeUndefined();
    expect(arg.orderBy).toEqual({ createdAt: 'desc' });
    expect(arg.include).toBeDefined();

    await app.close();
  });

  it('returns only that owner\'s pets when ownerId is given', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/api/pets?ownerId=owner_1' });

    expect(res.statusCode).toBe(200);
    expect(res.json().map((p: { id: string }) => p.id)).toEqual(['pet_1']);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ownerId: 'owner_1' } }),
    );

    await app.close();
  });

  it('treats an empty ownerId like no filter', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/api/pets?ownerId=' });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(2);
    expect(findMany.mock.calls[0][0].where).toBeUndefined();

    await app.close();
  });
});
