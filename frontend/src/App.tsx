import { useCallback, useEffect, useState } from 'react';
import { fetchDefaultOwner, fetchPets } from './api';
import { APP_MODE } from './config';
import type { Pet } from './types';
import { PetCard } from './components/PetCard';
import { AddPetForm } from './components/AddPetForm';

export function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const [errorMessage, setErrorMessage] = useState('');

  // Personal mode shows only the default owner's pets; clinic mode shows all.
  const load = useCallback(
    () =>
      (APP_MODE === 'personal' ? fetchDefaultOwner().then((o) => fetchPets(o.id)) : fetchPets())
        .then((data) => {
          setPets(data);
          setStatus('ready');
        })
        .catch((e) => {
          setErrorMessage(e instanceof Error ? e.message : '');
          setStatus('error');
        }),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <h1>PetDB</h1>
          <p className="subtitle">Pet health records</p>
        </div>
      </header>

      <main className="app-main">
        {status === 'loading' && <p className="hint">Loading pets…</p>}
        {status === 'error' && (
          <p className="hint hint-error" data-testid="load-error">
            {errorMessage.startsWith('Default owner not found')
              ? errorMessage
              : 'Could not reach the API. Is the backend running on :3001?'}
          </p>
        )}
        {status === 'ready' && <AddPetForm onCreated={load} />}
        {status === 'ready' && pets.length === 0 && (
          <p className="hint" data-testid="empty-state">
            No pets yet. Use “Add pet” above to add your first one.
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
