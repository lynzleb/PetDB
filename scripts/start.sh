#!/bin/zsh
# PetDB start — the one command to run after cloning.
# Does all setup (deps, Postgres, migrations, seed) then starts both the
# backend and frontend dev servers together. Press Ctrl+C to stop both.
#
# Usage (from repo root):  zsh scripts/start.sh   (or:  npm start)
#
# Prerequisites: Node 20+, Docker Desktop, npm.
# The GitHub MCP token is NOT set up here (it's optional and interactive) —
# run  zsh scripts/env/setup-github-pat.sh  separately if you need it.

set -e

ROOT_DIR="${0:A:h:h}"
cd "$ROOT_DIR"

# Run setup quietly, skipping the interactive GitHub token prompt.
PETDB_SKIP_GITHUB=1 PETDB_QUIET=1 zsh "$ROOT_DIR/scripts/bootstrap.sh"

echo ""
echo "======================================================"
echo " Starting PetDB..."
echo "   API  -> http://localhost:3001"
echo "   App  -> http://localhost:5173"
echo ""
echo " Press Ctrl+C to stop both servers."
echo "======================================================"
echo ""

# Start backend + frontend together (concurrently is a root devDependency).
npm run dev
