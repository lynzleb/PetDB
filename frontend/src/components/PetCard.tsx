import type { Pet } from '../types';

const speciesEmoji: Record<Pet['species'], string> = {
  DOG: '🐶',
  CAT: '🐱',
  BIRD: '🐦',
  RABBIT: '🐰',
  REPTILE: '🦎',
  OTHER: '🐾',
};

export function PetCard({ pet }: { pet: Pet }) {
  const latestTest = pet.bloodTests[0];
  const latestVax = pet.vaccinations[0];

  return (
    <li className="pet-card" data-testid="pet-card">
      <div className="pet-card-head">
        <span className="pet-emoji" aria-hidden>
          {speciesEmoji[pet.species]}
        </span>
        <div>
          <h2 className="pet-name">{pet.name}</h2>
          <p className="pet-meta">
            {pet.breed ?? pet.species} · owned by {pet.owner.name}
          </p>
        </div>
      </div>

      <dl className="pet-stats">
        <div>
          <dt>Last blood test</dt>
          <dd>
            {latestTest
              ? `${latestTest.testType}: ${latestTest.value} ${latestTest.unit}`
              : '—'}
          </dd>
        </div>
        <div>
          <dt>Last vaccinated</dt>
          <dd>
            {latestVax
              ? new Date(latestVax.administeredAt).toLocaleDateString()
              : '—'}
          </dd>
        </div>
      </dl>
    </li>
  );
}
