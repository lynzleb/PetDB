---
name: verify-unit
description: Verify a code change in PetDB with typechecking and unit tests, looping fix-and-rerun until green. Use for backend/logic/API changes, or as the unit verification phase of the ship-ticket workflow.
---

# Verify with typecheck + unit tests

Confirm a solution is correct for backend/logic changes before it moves toward a PR.
Loop until green; do not declare success on a command that merely exited without
asserting the acceptance criteria.

## Commands (run from repo root `/Users/lynzlebaldelomar/PetDB`)

- **Typecheck (always):** `npm run typecheck`
  Runs `tsc --noEmit` across backend and frontend.
- **Unit tests (if a runner is present):** `npm test --workspace backend`
  (and `--workspace frontend` when relevant).

> Note: as of setup there is **no unit-test runner wired up** (no vitest/jest).
> If the ticket's acceptance criteria need real unit coverage:
> 1. Prefer the ecosystem standard — `vitest` for the Vite frontend, and
>    `vitest` or node's built-in `node --test` (tsx) for the backend.
> 2. Add it as a dev dependency, add a `test` script to that workspace's
>    `package.json`, write focused tests for the acceptance criteria, then run them.
> 3. If you cannot set up a runner, say so explicitly and fall back to typecheck
>    plus a targeted manual check — never claim tests passed when none ran.

## Loop

1. Run typecheck. If it fails, read the errors, fix the code, rerun.
2. Run the unit tests that cover the acceptance criteria.
3. On failure: diagnose the root cause (don't patch blindly), fix, rerun.
4. If the same approach fails twice, step back and reconsider the approach rather
   than making incremental tweaks.
5. Done only when typecheck passes **and** every targeted test passes.

## Report

State exactly what ran and the result: commands, pass/fail counts, and which
acceptance criteria each check covered. Flag any criterion you could not verify.
