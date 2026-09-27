import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the shared Prisma client so the routes can be exercised via app.inject
// without a live database. Only the owner.findUnique method is needed here.
vi.mock('../prisma.js', () => ({
  prisma: {
    owner: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    pet: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { buildApp } from '../app.js';
import { prisma } from '../prisma.js';
import { DEFAULT_OWNER, DEFAULT_OWNER_EMAIL } from '../defaultOwner.js';

const findUnique = prisma.owner.findUnique as unknown as ReturnType<typeof vi.fn>;

describe('GET /api/owners/default', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the canonical default owner, looked up by its documented email', async () => {
    const seeded = {
      id: 'owner_default_1',
      name: DEFAULT_OWNER.name,
      email: DEFAULT_OWNER.email,
      phone: DEFAULT_OWNER.phone,
    };
    findUnique.mockResolvedValueOnce(seeded);

    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/api/owners/default' });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ id: 'owner_default_1', email: DEFAULT_OWNER_EMAIL });

    // Proves it hit the default handler (lookup by email), not the /owners/:id
    // handler (which would look up by id and include relations).
    expect(findUnique).toHaveBeenCalledWith({ where: { email: DEFAULT_OWNER_EMAIL } });

    await app.close();
  });

  it('returns 404 with a seed hint when the default owner has not been seeded', async () => {
    findUnique.mockResolvedValueOnce(null);

    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/api/owners/default' });

    expect(res.statusCode).toBe(404);
    expect(res.json().message).toMatch(/seed/i);

    await app.close();
  });
});
