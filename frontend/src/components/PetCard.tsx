import { APP_MODE } from '../config';
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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });

  return (
    <li className={`pet-card species-${pet.species.toLowerCase()}`} data-testid="pet-card">
      <div className="pet-card-head">
        <span className="pet-emoji" aria-hidden>
          {speciesEmoji[pet.species]}
        </span>
        <div className="pet-id">
          <h2 className="pet-name">{capitalize(pet.name)}</h2>
          <ul className="pet-tags">
            <li>
              <span className="sr-only">Species: {pet.species.toLowerCase()}. </span>
              {pet.breed ?? capitalize(pet.species.toLowerCase())}
            </li>
            {pet.color && <li>{pet.color}</li>}
            {pet.sex && <li>{sexLabel[pet.sex]}</li>}
            {APP_MODE === 'clinic' && <li>owned by {pet.owner.name}</li>}
          </ul>
        </div>
      </div>

      <dl className="pet-stats">
        <div>
          <dt>Last blood test</dt>
          <dd>
            {latestTest
              ? `${latestTest.testType}: ${latestTest.value} ${latestTest.unit}`
              : <span className="none">No record yet</span>}
          </dd>
        </div>
        <div>
          <dt>Last vaccinated</dt>
          <dd>
            {latestVax
              ? formatDate(latestVax.administeredAt)
              : <span className="none">No record yet</span>}
          </dd>
        </div>
      </dl>
    </li>
  );
}
