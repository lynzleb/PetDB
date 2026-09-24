---
name: implement-ticket
description: Execute the implementation plan for a PetDB ticket - make the code changes that satisfy the acceptance criteria. Use after planning, or as the implementation phase of the ship-ticket workflow.
---

# Implement the plan

Execute the plan from `plan-ticket`, writing the code that satisfies the ticket's
acceptance criteria.

## Inputs

- The implementation plan (approach + ordered list of file changes) and the work
  spec's acceptance criteria.

## Steps

1. **Work through the plan in order.** Make the changes at the sensible checkpoints
   the plan defined so the code stays in a working state.
2. **Match the codebase.** Follow existing style and conventions — Fastify + Prisma
   patterns in `backend/src/`, React + Vite patterns in `frontend/src/`. Reuse
   helpers and patterns rather than introducing new libraries.
3. **Read before you edit.** Never change code you haven't read. Use targeted edits
   over wholesale rewrites.
4. **Stay in scope.** Implement exactly what the plan and acceptance criteria call
   for. No unrequested features, abstractions, or cleanup of surrounding code.
5. **Handle the basics.** Input validation, error handling, and secure patterns
   (e.g. parameterized queries via Prisma) as the change warrants — but only what
   the task needs.
6. **Adapt if the plan is wrong.** If implementation reveals the plan won't work,
   note it and adjust the approach rather than forcing a broken path. If a step
   fails twice, step back and rethink instead of patching repeatedly.
7. **Don't commit here.** Committing/branching/PR is the `open-pr` phase. Leave
   `.env` and secrets untouched.

## Output

Summarize what changed (files + what each change does) and how it maps back to the
acceptance criteria, then hand off to verification (`verify-unit` / `verify-chrome`).
Note anything that turned out differently from the plan.
