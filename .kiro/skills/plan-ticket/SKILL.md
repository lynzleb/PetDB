---
name: plan-ticket
description: Turn a PetDB work spec (from analyze-jira-ticket) into a concrete implementation plan - the files to change and the approach - before any code is written. Use after analyzing a ticket, or as the planning phase of the ship-ticket workflow.
---

# Plan the implementation

Turn the work spec into a concrete, reviewable implementation plan. Planning is a
separate step from writing code so the approach can be checked before edits land.

## Inputs

- The work spec from `analyze-jira-ticket`: goal, acceptance criteria, scope hints,
  merged-sibling takeaways, and verification path.

## Steps

1. **Ground in the code.** Read the files the scope hints point to before planning.
   Match existing patterns — Fastify routes + Prisma in `backend/src/`, React + Vite
   in `frontend/src/`. Reuse the conventions seen in the merged sibling diffs.
   For unfamiliar areas, gather context first rather than guessing.
2. **Map acceptance criteria → changes.** For each criterion, name the specific
   files/functions to add or modify and how. Every criterion must be covered by at
   least one planned change.
3. **Write the plan.** Produce:
   - **Approach:** a few sentences on the overall strategy.
   - **Changes:** an ordered list of `path/to/file — what changes and why`.
   - **New tests / checks:** what `verify-unit` or `verify-chrome` will assert (and
     whether a unit-test runner needs adding — see `verify-unit`).
   - **Risks / open questions:** anything that could complicate the change.
4. **Keep scope tight.** Plan exactly what the acceptance criteria require — no
   speculative refactors, abstractions, or unrelated cleanup.
5. **Surface blocking unknowns now.** If the plan depends on a decision you can't
   make safely, ask one focused question before moving to implementation.

## Output

End with the plan in the chat, ready to hand to `implement-ticket`. Order the
changes so the code compiles/works at sensible checkpoints.
