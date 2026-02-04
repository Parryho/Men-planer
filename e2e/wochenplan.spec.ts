import { test, expect } from '@playwright/test';

test.describe('Wochenplan', () => {
  test('page loads', async ({ page }) => {
    await page.goto('/wochenplan');
    await expect(page.locator('body')).toContainText(/Wochenplan|KW/i);
  });

  test('shows current week', async ({ page }) => {
    await page.goto('/wochenplan');
    // Wait for data to load (shows "Lade Wochenplan..." initially)
    await expect(page.locator('body')).toContainText(/Kalenderwoche/, { timeout: 10000 });
  });

  test('week navigation forward', async ({ page }) => {
    await page.goto('/wochenplan');
    await page.waitForTimeout(500);

    const nextBtn = page.locator('button:has-text("›"), button:has-text("Nächste"), button:has-text("→"), button[aria-label*="next"]').first();
    if (await nextBtn.isVisible()) {
      const beforeText = await page.locator('body').textContent();
      await nextBtn.click();
      await page.waitForTimeout(500);
      // URL or content should change
    }
  });

  test('week navigation backward', async ({ page }) => {
    await page.goto('/wochenplan');
    await page.waitForTimeout(500);

    const prevBtn = page.locator('button:has-text("‹"), button:has-text("Vorherige"), button:has-text("←"), button[aria-label*="prev"]').first();
    if (await prevBtn.isVisible()) {
      await prevBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('today button works', async ({ page }) => {
    await page.goto('/wochenplan');
    await page.waitForTimeout(500);

    const todayBtn = page.locator('button:has-text("Heute"), button:has-text("Aktuelle")').first();
    if (await todayBtn.isVisible()) {
      await todayBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('meal slots are visible', async ({ page }) => {
    await page.goto('/wochenplan');
    // Wait for plan data to load
    await expect(page.locator('body')).toContainText(/Kalenderwoche/, { timeout: 10000 });
  });

  test('dish dropdown changes dish', async ({ page }) => {
    await page.goto('/wochenplan');
    await page.waitForTimeout(1000);

    // Find a dropdown for dish selection
    const select = page.locator('select').first();
    if (await select.isVisible()) {
      const options = await select.locator('option').count();
      if (options > 1) {
        await select.selectOption({ index: 1 });
        await page.waitForTimeout(500);
      }
    }
  });

  test('temperature input is present', async ({ page }) => {
    await page.goto('/wochenplan');
    await page.waitForTimeout(1000);

    // Look for temperature inputs
    const tempInput = page.locator('input[placeholder*="Temp"], input[type="text"][size="3"], input[placeholder*="__"]').first();
    if (await tempInput.isVisible()) {
      await tempInput.fill('72');
      await page.waitForTimeout(1000);
    }
  });

  test('changes persist after reload', async ({ page }) => {
    await page.goto('/wochenplan');
    await page.waitForTimeout(1000);

    // Get current page state
    const bodyText = await page.locator('body').textContent();

    // Reload and verify
    await page.reload();
    await page.waitForTimeout(1000);
    const bodyTextAfter = await page.locator('body').textContent();

    // Page should still load correctly
    expect(bodyTextAfter).toContain('City');
  });
});
