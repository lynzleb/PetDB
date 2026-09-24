---
name: ship-ticket
description: End-to-end workflow that ships a PetDB Jira ticket - analyze the ticket, plan and implement the change, verify it with unit tests and/or Chrome, and open a GitHub PR linked to the ticket. Use when asked to ship, deliver, or fully handle a PET ticket from description to merge request.
---

# Ship a Jira ticket end-to-end

Orchestrates the full loop from a PetDB Jira ticket to an open merge request. It
chains phases; each phase has its own skill with the detailed steps
(`analyze-jira-ticket`, `plan-ticket`, `implement-ticket`, `verify-unit`,
`verify-chrome`, `open-pr`). Follow that skill's instructions when you enter its
phase — they auto-activate, or you can run them directly (`/analyze-jira-ticket`,
`/plan-ticket`, `/implement-ticket`, `/verify-unit`, `/verify-chrome`, `/open-pr`).

## Inputs

- A ticket key (e.g. `PET-123`), a Jira URL, or a number. If none is given, ask.

## The loop

### Phase 1 — Analyze the ticket  → `analyze-jira-ticket`
Produce the work spec: goal, parent context, merged sibling tickets and takeaways
from their GitHub diffs, acceptance criteria, scope hints, and the chosen
verification path (`unit` / `chrome` / `both`).

### Phase 2 — Plan  → `plan-ticket`
Turn the work spec into a concrete implementation plan: the approach and an ordered
list of file changes, with each acceptance criterion mapped to a change. Surface
blocking unknowns before writing code.

### Phase 3 — Implement  → `implement-ticket`
Execute the plan, writing the code that satisfies the acceptance criteria. Read
code before editing, match existing patterns (Fastify + Prisma in `backend/`,
React + Vite in `frontend/`), and stay strictly in scope.

### Phase 4 — Verify  → `verify-unit` and/or `verify-chrome`
Run the verification path chosen in Phase 1:
- `unit` → `verify-unit` (typecheck + unit tests)
- `chrome` → `verify-chrome` (run app, drive Chrome)
- `both` → run both.

**This is a loop, not a single pass.** If verification fails: diagnose, go back to
Phase 3 (or re-plan in Phase 2 if the approach is wrong), and re-verify. If the same
approach fails twice, step back and rethink rather than making incremental patches.
Only leave this phase when every acceptance criterion is demonstrably met.

### Phase 5 — Open the PR  → `open-pr`
Only once verification is green: branch (`feature/PET-123-slug`), commit
(`PET-123: …`), push, open the GitHub PR with a body linking the Jira ticket and
noting what was verified, then comment the PR URL back on the ticket.

## Guardrails

- Never open the PR until verification is green — that gate is the whole point.
- Never commit to `main` or force-push; always a topic branch + PR.
- Don't commit secrets (`.env` and similar).
- If blocked (ambiguous criteria, missing access, failing setup), stop and report
  clearly rather than guessing or claiming false success.

## Final report

Summarize: ticket → plan → what changed → how it was verified → branch + PR URL →
Jira ticket updated. Flag anything left blocked or unverified.
