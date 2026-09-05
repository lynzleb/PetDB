import { test, expect } from '@playwright/test';

// Smoke check the AI workflow can rely on: the app shell renders on mobile.
test('app shell renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'PetDB' })).toBeVisible();
  await expect(page.getByText('Pet health records')).toBeVisible();
});

// The app must degrade gracefully: with the backend down we expect either
// pet records, an empty state, or a clear error message — never a blank page.
test('shows a known state (records, empty, or error)', async ({ page }) => {
  await page.goto('/');

  const known = page
    .getByTestId('pet-list')
    .or(page.getByTestId('empty-state'))
    .or(page.getByTestId('load-error'));

  await expect(known.first()).toBeVisible({ timeout: 10_000 });
});
