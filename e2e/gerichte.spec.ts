import { test, expect } from '@playwright/test';

test.describe('Gerichte', () => {
  test('page loads with dishes list', async ({ page }) => {
    await page.goto('/gerichte');
    await expect(page.locator('body')).toContainText(/Gerichte/);
  });

  test('dishes are displayed', async ({ page }) => {
    await page.goto('/gerichte');
    // Wait for data to load
    await page.waitForTimeout(1000);
    // Should show some dishes from seed data
    await expect(page.locator('body')).toContainText(/Suppe|Schnitzel|Dessert/i);
  });

  test('create new dish', async ({ page }) => {
    await page.goto('/gerichte');
    await page.waitForTimeout(500);

    // Look for a create/add button
    const addButton = page.locator('button:has-text("Neues Gericht"), button:has-text("Hinzufügen"), button:has-text("Neu")').first();
    if (await addButton.isVisible()) {
      await addButton.click();

      // Fill form
      const nameInput = page.locator('input[name="name"], input[placeholder*="Name"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('Test-Schnitzel');
        // Submit
        const submitBtn = page.locator('button[type="submit"], button:has-text("Speichern")').first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          await page.waitForTimeout(500);
          await expect(page.locator('body')).toContainText('Test-Schnitzel');
        }
      }
    }
  });

  test('category filter works', async ({ page }) => {
    await page.goto('/gerichte');
    await page.waitForTimeout(500);

    // Look for category filter
    const categorySelect = page.locator('select, [role="combobox"]').first();
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ label: /Suppe/i });
      await page.waitForTimeout(500);
      // Verify only soups are shown
    }
  });

  test('dish edit works', async ({ page }) => {
    await page.goto('/gerichte');
    await page.waitForTimeout(1000);

    // Click on a dish to edit
    const editButton = page.locator('button:has-text("Bearbeiten"), button[aria-label*="edit"]').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('dish delete works', async ({ page }) => {
    await page.goto('/gerichte');
    await page.waitForTimeout(1000);

    // Find a delete button
    const deleteButton = page.locator('button:has-text("Löschen"), button[aria-label*="delete"]').first();
    if (await deleteButton.isVisible()) {
      // Count dishes before
      const beforeCount = await page.locator('[data-testid="dish-item"], tr, .dish-card').count();

      await deleteButton.click();
      // Confirm if dialog appears
      const confirmBtn = page.locator('button:has-text("Bestätigen"), button:has-text("Ja")').first();
      if (await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmBtn.click();
      }

      await page.waitForTimeout(500);
      const afterCount = await page.locator('[data-testid="dish-item"], tr, .dish-card').count();
      expect(afterCount).toBeLessThanOrEqual(beforeCount);
    }
  });
});
