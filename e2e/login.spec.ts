import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

test.describe('US-08: Login Flow Verification', () => {
  test.beforeAll(async () => {
    // Clean and seed a predictable user exclusively for login testing
    await prisma.user.deleteMany({
      where: { username: 'playwright_login_user' },
    });

    const hashedPassword = await bcrypt.hash('securelogin123', 10);
    await prisma.user.create({
      data: {
        firstName: 'Login',
        lastName: 'Tester',
        username: 'playwright_login_user',
        password: hashedPassword,
        role: 'USER',
      },
    });
  });

  test('Validates empty fields natively', async ({ page }) => {
    await page.goto('/login');
    // Click without filling anything
    await page.click('button[type="submit"]');
    // HTML5 Validation kicks in natively; the form should not mutate or change pages
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Rejects incorrect password with a safe non-specific error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'playwright_login_user');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials. Please try again.')).toBeVisible();
  });

  test('Rejects completely non-existent username anonymously', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'nobody_exists_here');
    await page.fill('input[name="password"]', 'somepassword123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials. Please try again.')).toBeVisible();
  });

  test('Successfully logs in and redirects to the dashboard securely', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'playwright_login_user');
    await page.fill('input[name="password"]', 'securelogin123');
    await page.click('button[type="submit"]');

    // Should display our custom interactive success state
    await expect(page.locator('text=Login successful! Redirecting...')).toBeVisible();

    // The react component seamlessly kicks the user to /dashboard after a very short UX delay
    await page.waitForURL('**/dashboard', { timeout: 3000 });
  });
});
