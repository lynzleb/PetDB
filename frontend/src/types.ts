export type Species = 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'REPTILE' | 'OTHER';

export type Sex = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface BloodTest {
  id: string;
  testType: string;
  value: number;
  unit: string;
  takenAt: string;
  notes?: string | null;
}

export interface Vaccination {
  id: string;
  vaccineName: string;
  administeredAt: string;
  nextDueAt?: string | null;
  notes?: string | null;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string | null;
  sex?: Sex | null;
  color?: string | null;
  birthDate?: string | null;
  owner: Owner;
  bloodTests: BloodTest[];
  vaccinations: Vaccination[];
}

export interface NewPetInput {
  name: string;
  species: Species;
  breed?: string;
  sex?: Sex;
  color?: string;
  birthDate?: string;
}
