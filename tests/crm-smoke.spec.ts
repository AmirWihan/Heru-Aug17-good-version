import { test, expect } from '@playwright/test';

// Basic CRM smoke test: navigation, login, dashboard, and links

test.describe('CRM Smoke Test', () => {
  test('Login as lawyer and see dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sarah.johnson@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/lawyer\/dashboard/);
    await expect(page.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeVisible();
  });

  test('Navigate to Applications page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sarah.johnson@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    // Sidebar uses buttons to switch internal page state while staying on /lawyer/dashboard
    await page.getByRole('button', { name: 'Applications' }).click();
    await expect(page.getByRole('heading', { level: 1, name: /Applications/i })).toBeVisible();
  });

  test('Sidebar links are present and working', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sarah.johnson@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    const essentialLinks = ['Dashboard', 'Applications', 'Clients'];
    for (const link of essentialLinks) {
      await expect(page.getByRole('button', { name: link })).toBeVisible();
    }
    // Quick check: navigate via sidebar buttons and assert header updates
    await page.getByRole('button', { name: 'Clients' }).click();
    await expect(page.getByRole('heading', { level: 1, name: /All Clients|Clients/i })).toBeVisible();
  });
});
