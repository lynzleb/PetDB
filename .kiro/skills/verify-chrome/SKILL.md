---
name: verify-chrome
description: Verify PetDB UI behavior by running the app and driving Chrome, checking against acceptance criteria. Use for frontend/UI changes, or as the Chrome verification phase of the ship-ticket workflow.
---

# Verify UI behavior in Chrome

Confirm a solution works for a real user by exercising it in Chrome against the
ticket's acceptance criteria.

## Two verification paths

### A. Interactive check (Chrome DevTools MCP) — preferred for exploratory UI checks
1. Start the app: run `npm run dev` as a **background process** (it's long-running;
   never run a dev server as a blocking command). Backend + frontend come up via
   `concurrently`.
2. Open the frontend URL in Chrome (Vite default `http://localhost:5173` — confirm
   from the dev server output).
3. Use the Chrome DevTools tools to drive the page: take a snapshot, click, fill
   forms, and read the DOM/console to confirm each acceptance criterion.
4. Check the console for errors and the network panel for failed API calls.
5. Take a screenshot as evidence for UI-visible criteria.

### B. Automated check (Playwright e2e in Chromium)
1. Ensure browsers are installed: `npm run install:browsers --workspace e2e` (once).
2. Run the suite: `npm run verify` (root) → Playwright e2e in Chromium.
3. If a criterion isn't covered, add/extend a spec under `e2e/tests/` before running.

## Loop

1. Exercise the change against each acceptance criterion.
2. On failure: read the console/network/test output, find the root cause, fix, retry.
3. If the same approach fails twice, reconsider rather than tweaking repeatedly.
4. Done only when every UI acceptance criterion is demonstrably met.

## Cleanup & report

- Stop the background dev server when finished.
- Report which criteria were checked, how (interactive vs e2e), and the outcome,
  with screenshot/console evidence. Flag anything you could not verify.
