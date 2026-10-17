# PetDB

Pet health records app. Owners keep records of their pets along with health data such as blood test results and vaccination history. Built and iterated on via AI-driven workflows (Jira ticket → Figma design → code → automated browser verification).

## Stack

| Layer | Choice |
|-------|--------|
| Frontend | Vite + React + TypeScript, mobile-first PWA |
| Backend | Node + Fastify + TypeScript |
| ORM / DB | Prisma + PostgreSQL |
| Verification | Playwright (Chrome DevTools Protocol) |
| Monorepo | npm workspaces |

## Layout

```
PetDB/
├── backend/     Fastify API + Prisma schema (owners, pets, blood tests, vaccinations)
├── frontend/    Vite React PWA (mobile-first)
├── e2e/         Playwright verification suite for the AI loop
├── scripts/     bootstrap + environment setup
└── docs/        AI workflow documentation
```

## Getting started

### Prerequisites

- **Node 20+** (`node --version`)
- **Docker Desktop** (runs the Postgres database)
- **npm** (bundled with Node)

### Quick start (one command)

From the repo root, after cloning:

```bash
npm start
```

That's it. This single command:

1. Checks Node + Docker (and starts Docker Desktop if it's not running)
2. Installs all dependencies
3. Starts Postgres and waits for it to be ready
4. Creates `backend/.env`
5. Applies database migrations and seeds sample data
6. Starts **both** the backend and frontend dev servers together

When it's up, open http://localhost:5173 and you'll see the seeded pet.
Press `Ctrl+C` to stop both servers.

> `npm start` runs `scripts/start.sh`. To do setup only (no servers), run
> `npm run setup`. To start servers only (setup already done), run `npm run dev`.

### Manual setup

If you'd rather do it step by step:

```bash
npm install                                   # install all workspaces

docker compose up -d                          # start Postgres
cp backend/.env.example backend/.env          # DB connection string
npm run prisma:migrate --workspace backend    # create tables
npm run prisma:seed --workspace backend       # sample data

npm run dev:backend                           # API on :3001
npm run dev:frontend                          # app on :5173
```

### Verification loop (optional)

```bash
npm run install:browsers --workspace e2e      # one-time Playwright browsers
npm run verify                                # runs the smoke suite
```

### GitHub MCP (optional, macOS)

Only needed if you commit / open PRs through the GitHub MCP server. Each user
brings their own token. See [scripts/env/README.md](scripts/env/README.md).

```bash
zsh scripts/env/install.sh          # installs the login-time env loader
zsh scripts/env/setup-github-pat.sh # paste your own GitHub token when prompted
```

### Common commands

| Command | What it does |
|---------|--------------|
| `npm start` | Full setup + start both servers (use after cloning) |
| `npm run setup` | Setup only (deps, DB, migrate, seed), no servers |
| `npm run dev` | Start backend + frontend together (setup already done) |
| `npm run dev:backend` | Start the API with hot reload |
| `npm run dev:frontend` | Start the web app with hot reload |
| `npm run build` | Build backend + frontend |
| `npm run typecheck` | Type-check both workspaces |
| `npm run verify` | Run the Playwright verification suite |
| `docker compose up -d` / `docker compose down` | Start / stop Postgres |

## Data model (skeleton)

- **Owner** — a person who owns pets
- **Pet** — belongs to an owner (name, species, breed, birth date)
- **BloodTest** — belongs to a pet (test type, value, unit, taken date)
- **Vaccination** — belongs to a pet (vaccine name, administered date, next due date)

See `backend/prisma/schema.prisma` for the source of truth.

### Default owner (personal mode)

PetDB's personal mode treats the owner as implicit. The seed creates one
canonical **default owner** (`lynzle@example.com`, defined in
`backend/src/defaultOwner.ts`), and the frontend resolves its id without any
owner UI via:

```
GET /api/owners/default
```

This returns the default owner (404 if the database hasn't been seeded). The
lookup is keyed by the documented email, so it stays correct no matter what
other owners exist.

The frontend reads `VITE_APP_MODE` (`personal` by default, or `clinic`). In
personal mode owner info is hidden and new pets attach to the default owner
automatically. Owner data and endpoints remain for a future clinic mode.

## AI workflow

See [docs/ai-workflow.md](docs/ai-workflow.md) for how tickets and designs flow into code and get verified.
