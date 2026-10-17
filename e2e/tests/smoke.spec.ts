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

// Personal mode: the add-pet form has no owner field and cards show no owner.
test('add pet form has no owner UI', async ({ page }) => {
  await page.goto('/');
  const form = page.getByTestId('add-pet-form');
  const known = form.or(page.getByTestId('load-error'));
  await expect(known.first()).toBeVisible({ timeout: 10_000 });
  test.skip(!(await form.isVisible()), 'backend not reachable');

  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Species')).toBeVisible();
  await expect(page.getByLabel(/owner/i)).toHaveCount(0);
  await expect(page.getByText(/owned by/i)).toHaveCount(0);
});
