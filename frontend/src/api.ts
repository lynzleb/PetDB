import { APP_MODE } from './config';
import type { NewPetInput, Owner, Pet } from './types';

// In dev, Vite proxies /api to the backend (see vite.config.ts).
const BASE = '/api';

export async function fetchPets(ownerId?: string): Promise<Pet[]> {
  const url = ownerId ? `${BASE}/pets?ownerId=${encodeURIComponent(ownerId)}` : `${BASE}/pets`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load pets: ${res.status}`);
  }
  return res.json();
}

// Cached only on success so a 404 (unseeded DB) can be retried after seeding.
let defaultOwner: Owner | null = null;

export async function fetchDefaultOwner(): Promise<Owner> {
  if (defaultOwner) return defaultOwner;
  const res = await fetch(`${BASE}/owners/default`);
  if (res.status === 404) {
    throw new Error('Default owner not found. Run the database seed.');
  }
  if (!res.ok) {
    throw new Error(`Failed to load default owner: ${res.status}`);
  }
  defaultOwner = (await res.json()) as Owner;
  return defaultOwner;
}

// Uses ownerId if given, otherwise the default owner in personal mode.
export async function createPet(input: NewPetInput, ownerId?: string): Promise<Pet> {
  let resolvedOwnerId = ownerId;
  if (!resolvedOwnerId) {
    if (APP_MODE !== 'personal') {
      throw new Error('ownerId is required in clinic mode');
    }
    resolvedOwnerId = (await fetchDefaultOwner()).id;
  }

  // Omit empty optional fields.
  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== '') payload[key] = value;
  }

  const res = await fetch(`${BASE}/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, ownerId: resolvedOwnerId }),
  });
  if (!res.ok) {
    let message = `Failed to add pet: ${res.status}`;
    try {
      const body = await res.json();
      if (body && typeof body.message === 'string') message = body.message;
    } catch {
      // keep fallback message
    }
    throw new Error(message);
  }
  return res.json();
}
