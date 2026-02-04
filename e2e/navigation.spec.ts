import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('dashboard loads', async ({ page }) => {
    await page.goto('/wochenplan');
    await expect(page).toHaveTitle(/Menüplan/);
  });

  test('all nav links are visible on desktop', async ({ page }) => {
    await page.goto('/wochenplan');
    // Desktop sidebar should show all links
    const navLinks = [
      'Dashboard', 'Wochenplan', 'Rotation', 'Gerichte',
      'AK Events', 'Felix OCR', 'Produktion', 'Einkauf',
      'Kosten', 'Zutaten', 'Export', 'Druck',
    ];
    for (const label of navLinks) {
      await expect(page.getByRole('link', { name: label })).toBeVisible();
    }
  });

  test('nav links navigate correctly', async ({ page }) => {
    await page.goto('/gerichte');
    await page.getByRole('link', { name: 'Wochenplan' }).click();
    await expect(page).toHaveURL(/wochenplan/);
  });

  test('gerichte page loads', async ({ page }) => {
    await page.goto('/gerichte');
    await expect(page.locator('body')).toContainText(/Gerichte/);
  });

  test('events page loads', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('body')).toContainText(/Event/);
  });

  test('mobile menu toggles', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Menu button should be visible on mobile
    const menuButton = page.locator('button:has-text("☰"), button[aria-label*="menu"], button[aria-label*="Menu"]').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Nav items should become visible
      await expect(page.getByRole('link', { name: 'Wochenplan' })).toBeVisible();
    }
  });
});
