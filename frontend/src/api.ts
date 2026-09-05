import type { Pet } from './types';

// In dev, Vite proxies /api to the backend (see vite.config.ts).
const BASE = '/api';

export async function fetchPets(): Promise<Pet[]> {
  const res = await fetch(`${BASE}/pets`);
  if (!res.ok) {
    throw new Error(`Failed to load pets: ${res.status}`);
  }
  return res.json();
}
