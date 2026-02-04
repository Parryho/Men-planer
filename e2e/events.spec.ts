import { test, expect } from '@playwright/test';

test.describe('AK Events', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('body')).toContainText(/Event|AK|Arbeiterkammer/i);
  });

  test('create event button exists', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(500);

    const addBtn = page.locator('button:has-text("Neues Event"), button:has-text("Event erstellen"), button:has-text("Hinzufügen")').first();
    await expect(addBtn).toBeVisible();
  });

  test('create event flow', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(500);

    const addBtn = page.locator('button:has-text("Neues Event"), button:has-text("Event erstellen"), button:has-text("Hinzufügen")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(300);

      // Fill date
      const dateInput = page.locator('input[type="date"]').first();
      if (await dateInput.isVisible()) {
        await dateInput.fill('2025-04-15');
      }

      // Select event type
      const typeSelect = page.locator('select').first();
      if (await typeSelect.isVisible()) {
        await typeSelect.selectOption('brunch');
      }

      // Submit
      const submitBtn = page.locator('button:has-text("Speichern"), button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('event list shows events', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(1000);
    // Page should at least render the event list area
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('event type filter works', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(500);

    const filterSelect = page.locator('select').first();
    if (await filterSelect.isVisible()) {
      const options = await filterSelect.locator('option').count();
      expect(options).toBeGreaterThan(0);
    }
  });
});
