import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

test.use({ viewport: { width: 1280, height: 720 } });

test.describe('US-11: Role-Based Add User Protection', () => {
  test.beforeAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        username: { in: ['regular_user_11', 'superadmin_user_11'] },
      },
    });

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create a regular USER
    await prisma.user.create({
      data: {
        firstName: 'Regular',
        lastName: 'User',
        username: 'regular_user_11',
        password: hashedPassword,
        role: 'USER',
      },
    });

    // Create a SUPERADMIN
    await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        username: 'superadmin_user_11',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });
  });

  test('Regular user cannot see Add User link in sidebar', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'regular_user_11');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    const sidebar = page.locator('[data-testid="sidebar-desktop"]');
    await expect(sidebar.locator('text=Add User (Admin)')).not.toBeVisible();
  });

  test('Regular user navigating directly to /dashboard/admin/add-user gets redirected', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'regular_user_11');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Attempt to directly access the admin page
    await page.goto('/dashboard/admin/add-user');

    // Should be redirected back to /dashboard (not admin page)
    await expect(page).toHaveURL(/.*\/dashboard$/);
  });

  test('Super Admin can see and access the Add User page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'superadmin_user_11');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    const sidebar = page.locator('[data-testid="sidebar-desktop"]');

    // Admin link should be visible
    await expect(sidebar.locator('text=Add User (Admin)')).toBeVisible();

    // Click it and verify the page loads
    await sidebar.locator('a[href="/dashboard/admin/add-user"]').click();
    await page.waitForURL('**/dashboard/admin/add-user');
    await expect(page.locator('h1:has-text("Add User")')).toBeVisible();
  });
});
