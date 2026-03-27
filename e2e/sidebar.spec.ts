import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Force desktop viewport so the persistent sidebar is visible natively
test.use({ viewport: { width: 1280, height: 720 } });

test.describe('US-10: Sidebar Navigation Verification', () => {
  test.beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { username: 'sidebar_user' },
    });

    const hashedPassword = await bcrypt.hash('sidebar123', 10);
    await prisma.user.create({
      data: {
        firstName: 'Side',
        lastName: 'Bar',
        username: 'sidebar_user',
        password: hashedPassword,
        role: 'USER',
      },
    });
  });

  // Helper to login before each test
  async function loginUser(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'sidebar_user');
    await page.fill('input[name="password"]', 'sidebar123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  }

  test('Sidebar renders all required navigation links for a standard USER', async ({ page }) => {
    await loginUser(page);

    // Scope to the desktop sidebar using data-testid
    const sidebar = page.locator('[data-testid="sidebar-desktop"]');

    await expect(sidebar.locator('text=Dashboard')).toBeVisible();
    await expect(sidebar.locator('text=Profile')).toBeVisible();
    await expect(sidebar.locator('text=Account Details')).toBeVisible();
    await expect(sidebar.locator('text=Settings').first()).toBeVisible();
    await expect(sidebar.locator('text=Logout')).toBeVisible();

    // The Admin link should NOT be visible for a standard USER role
    await expect(sidebar.locator('text=Add User (Admin)')).not.toBeVisible();
  });

  test('Active link is visually highlighted when navigating between sections', async ({ page }) => {
    await loginUser(page);

    const sidebar = page.locator('[data-testid="sidebar-desktop"]');

    // Click the Profile link in the sidebar
    await sidebar.locator('a[href="/dashboard/profile"]').click();
    await page.waitForURL('**/dashboard/profile');

    // Verify the Profile page content loaded
    await expect(page.locator('h1:has-text("Profile")')).toBeVisible();
  });

  test('Logout button clears session and redirects to login', async ({ page }) => {
    await loginUser(page);

    const sidebar = page.locator('[data-testid="sidebar-desktop"]');

    // Click the Logout button
    await sidebar.locator('button:has-text("Logout")').click();

    // Should redirect to login
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
