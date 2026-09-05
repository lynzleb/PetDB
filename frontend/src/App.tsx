import { useEffect, useState } from 'react';
import { fetchPets } from './api';
import type { Pet } from './types';
import { PetCard } from './components/PetCard';

export function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    fetchPets()
      .then((data) => {
        setPets(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>PetDB</h1>
        <p className="subtitle">Pet health records</p>
      </header>

      <main className="app-main">
        {status === 'loading' && <p className="hint">Loading pets…</p>}
        {status === 'error' && (
          <p className="hint hint-error" data-testid="load-error">
            Could not reach the API. Is the backend running on :3001?
          </p>
        )}
        {status === 'ready' && pets.length === 0 && (
          <p className="hint" data-testid="empty-state">
            No pets yet. Seed the database to see records.
          </p>
        )}
        {status === 'ready' && pets.length > 0 && (
          <ul className="pet-list" data-testid="pet-list">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
