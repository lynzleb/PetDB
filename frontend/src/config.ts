export type AppMode = 'personal' | 'clinic';

// Single app-mode switch. Anything other than 'clinic' falls back to 'personal'.
export const APP_MODE: AppMode =
  import.meta.env.VITE_APP_MODE === 'clinic' ? 'clinic' : 'personal';
