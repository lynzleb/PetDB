// The canonical "default" owner for personal mode (see PET-1 / PET-4).
//
// Personal mode treats the owner concept as implicit: every pet attaches to a
// single default owner and only that owner's pets are shown. This module is the
// single source of truth for that owner's identity so the seed and the API agree
// on it without relying on row ordering.
//
// The default owner is looked up by its stable, documented email — never by
// "first row" — so `GET /api/owners/default` stays correct regardless of what
// other owners exist in the database.
export const DEFAULT_OWNER = {
  name: 'Lynzle',
  email: 'lynzle@example.com',
  phone: null as string | null,
} as const;

export const DEFAULT_OWNER_EMAIL = DEFAULT_OWNER.email;
