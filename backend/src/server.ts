import { buildApp } from './app.js';

const port = Number(process.env.PORT ?? 3001);

const app = buildApp();

app
  .listen({ port, host: '0.0.0.0' })
  .then((address) => {
    app.log.info(`PetDB API listening at ${address}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
