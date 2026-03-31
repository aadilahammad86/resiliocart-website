import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('US-07: Signup Flow Verification', () => {
  // Cleanup database before tests so we have a clean slate
  test.beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { username: { startsWith: 'playwright_' } },
    });
  });

  test('Validates empty fields and short passwords automatically', async ({ page }) => {
    await page.goto('/signup');

    // Fill out everything cleanly EXCEPT the password
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="username"]', 'playwright_badpass');
    await page.fill('input[name="password"]', 'short');

    await page.click('button[type="submit"]');

    // Check our specific Zod validation error appears securely in the UI
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('Successfully creates a new account and redirects to login', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="firstName"]', 'Valid');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="username"]', 'playwright_success');
    await page.fill('input[name="password"]', 'securepassword123');

    await page.click('button[type="submit"]');

    // Check for our custom green success banner
    await expect(page.locator('text=Account created successfully!')).toBeVisible();

    // The component redirects to /login after 2 seconds - verify the URL changes!
    await page.waitForURL('**/login', { timeout: 3000 });
  });

  test('Shows clear error on duplicate username', async ({ page }) => {
    // First, seed a user directly into the Postgres DB to act as the "duplicate"
    await prisma.user.create({
      data: {
        firstName: 'Duplicate',
        lastName: 'User',
        username: 'playwright_duplicate',
        password: 'securepassword123',
        role: 'USER',
      },
    });

    await page.goto('/signup');
    await page.fill('input[name="firstName"]', 'Another');
    await page.fill('input[name="lastName"]', 'Guy');

    // Intentionally type the exact same username
    await page.fill('input[name="username"]', 'playwright_duplicate');
    await page.fill('input[name="password"]', 'securepassword123');

    await page.click('button[type="submit"]');

    // Verify our Server Action catches the DB constraint and returns the friendly error
    await expect(page.locator('text=Username already exists')).toBeVisible();
  });
});
