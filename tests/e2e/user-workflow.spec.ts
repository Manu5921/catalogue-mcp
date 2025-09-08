// Tests End-to-End pour le parcours utilisateur
import { test, expect } from '@playwright/test';

test.describe('Main User Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display the main page with a title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Catalogue/i);
  });

  test.todo('should allow searching for a server and viewing its details');
});
