import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { petRoutes } from './routes/pets.js';
import { ownerRoutes } from './routes/owners.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  app.register(healthRoutes);
  app.register(ownerRoutes, { prefix: '/api' });
  app.register(petRoutes, { prefix: '/api' });

  return app;
}
