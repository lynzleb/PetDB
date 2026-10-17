import { useState } from 'react';
import type { FormEvent } from 'react';
import { createPet } from '../api';
import type { Sex, Species } from '../types';

const SPECIES: Species[] = ['DOG', 'CAT', 'BIRD', 'RABBIT', 'REPTILE', 'OTHER'];
const SEXES: Sex[] = ['MALE', 'FEMALE', 'UNKNOWN'];
const label = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export function AddPetForm({ onCreated }: { onCreated: () => void | Promise<void> }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('DOG');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<Sex | ''>('');
  const [color, setColor] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createPet({
        name: name.trim(),
        species,
        breed: breed.trim(),
        sex: sex || undefined,
        color: color.trim(),
        birthDate,
      });
      setName('');
      setSpecies('DOG');
      setBreed('');
      setSex('');
      setColor('');
      setBirthDate('');
      await onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pet');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-pet-form" data-testid="add-pet-form" onSubmit={onSubmit}>
      <h2 className="form-title">Add pet</h2>
      <div className="form-field">
        <label htmlFor="pet-name">Name</label>
        <input
          id="pet-name"
          data-testid="pet-name-input"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="pet-species">Species</label>
        <select
          id="pet-species"
          required
          value={species}
          onChange={(e) => setSpecies(e.target.value as Species)}
        >
          {SPECIES.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="pet-breed">Breed</label>
        <input id="pet-breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="pet-sex">Sex</label>
        <select id="pet-sex" value={sex} onChange={(e) => setSex(e.target.value as Sex | '')}>
          <option value="">Not specified</option>
          {SEXES.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="pet-color">Color</label>
        <input id="pet-color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="pet-birth-date">Birth date</label>
        <input
          id="pet-birth-date"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
      {error && (
        <p className="form-error" role="alert" data-testid="add-pet-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn-primary"
        data-testid="add-pet-submit"
        disabled={submitting}
      >
        {submitting ? 'Adding…' : 'Add pet'}
      </button>
    </form>
  );
}
