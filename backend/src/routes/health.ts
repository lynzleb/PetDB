import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok', service: 'petdb-api', time: new Date().toISOString() };
  });
}
