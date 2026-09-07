# PetDB backlog

Planning record for upcoming work. Source of truth for tickets is Jira; this
file mirrors the agreed structure so tickets can be created from it and so
future/backlog ideas (like clinic mode) don't get lost.

Usage modes: PetDB serves two personas — an individual **pet owner** (personal
mode, the owner concept is implicit) and a **clinic/vet** (multi-owner, later).
`Pet.ownerId` stays required in the schema, so clinic mode is a clean extension,
not a rewrite. Personal mode ships first.

---

## STORY: Personal mode
Single-user experience where "owners" are implicit. All pets attach to one
default owner; owner-management UI is hidden. No schema/migration changes.

- [ ] **Sub-task: create default owner** — seed a single canonical owner and
  expose a way for the frontend to get its id without showing it (e.g. the
  first owner from `GET /api/owners`, or a documented seeded id).
- [ ] **Sub-task: hide owner UI** — no owners list or owner picker anywhere.
  Creating a pet attaches it to the implicit owner automatically. Backend owner
  endpoints stay functional for future use.

**Acceptance**
- No "Owners" navigation or list is visible in personal mode.
- Creating a pet requires no owner selection.
- Schema unchanged; `Pet.ownerId` still required.

---

## STORY: Navigation sidebar
Add app navigation with two destinations suited to the pet-owner persona.
Introduces a router (the app has none today).

- [ ] **Sub-task: wire existing pet list as "My Pets" tab** — the current list
  becomes the default nav destination (not new work, just wiring).
- [ ] **Sub-task: add "Reminders" view** — list upcoming/overdue vaccinations
  across pets, sorted by `nextDueAt`. Reuses existing vaccination data; no new
  model.

**Acceptance**
- Sidebar shows **My Pets** (default) and **Reminders**, active item uses the
  maroon theme.
- Mobile-first: collapses to a bottom tab bar on narrow screens (confirm in Figma).
- Reminders lists vaccinations with a `nextDueAt`, soonest first; overdue items
  are visually distinct; empty state when nothing is due.
- Verifiable: with seed data, Byte's Rabies shows due 2026-06-01.

**Open decisions (settle in Figma)**
- Personal mode: show the owner name on a pet, or hide it entirely?
- Sidebar on desktop vs. bottom tab bar on mobile.

---

## EPIC: Clinic / vet mode (backlog — record only, do not build yet)
A multi-owner experience for clinics/vets. Extends personal mode rather than
replacing it.

- **Story (placeholder): multi-owner management** — add a mode that un-hides
  owner management, adds an Owners view, and requires owner selection when
  creating a pet. Personal mode stays the default. Schema already supports this
  (`Pet.ownerId` is required); no migration needed to start.

Possible follow-on stories: owner detail pages, per-owner pet filtering,
permissions/auth, clinic vs. personal mode toggle/setting.
