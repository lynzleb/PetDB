import type { Pet } from '../types';

const speciesEmoji: Record<Pet['species'], string> = {
  DOG: '🐶',
  CAT: '🐱',
  BIRD: '🐦',
  RABBIT: '🐰',
  REPTILE: '🦎',
  OTHER: '🐾',
};

const sexLabel: Record<NonNullable<Pet['sex']>, string> = {
  MALE: '♂ Male',
  FEMALE: '♀ Female',
  UNKNOWN: 'Unknown sex',
};

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function PetCard({ pet }: { pet: Pet }) {
  const latestTest = pet.bloodTests[0];
  const latestVax = pet.vaccinations[0];

  const details = [pet.breed ?? pet.species];
  if (pet.color) details.push(pet.color);
  if (pet.sex) details.push(sexLabel[pet.sex]);

  return (
    <li className="pet-card" data-testid="pet-card">
      <div className="pet-card-head">
        <span className="pet-emoji" aria-hidden>
          {speciesEmoji[pet.species]}
        </span>
        <div>
          <h2 className="pet-name">{capitalize(pet.name)}</h2>
          <p className="pet-meta">
            {details.join(' · ')} · owned by {pet.owner.name}
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
