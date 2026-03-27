import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

test.describe('US-14: Admin Create User Service', () => {
  test.beforeEach(async () => {
    // Reset database state for test scope repeatability
    await prisma.user.deleteMany({
      where: {
        username: { in: ['admin_manager', 'standard_target', 'duplicate_username'] },
      },
    });

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Initial super admin actor to test with
    await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Manager',
        username: 'admin_manager',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });

    // Existing user to test duplicate guard
    await prisma.user.create({
      data: {
        firstName: 'Duplicate',
        lastName: 'Guy',
        username: 'duplicate_username',
        password: hashedPassword,
        role: 'USER',
      },
    });
  });

  test.afterAll(async () => {
    // Cleanup generated data organically
    await prisma.user.deleteMany({
      where: {
        username: {
          in: ['admin_manager', 'standard_target', 'duplicate_username', 'new_admin_target'],
        },
      },
    });
  });

  test('Super Admin can successfully create standard user and duplicate prevention works inherently', async ({
    page,
  }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin_manager');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    await page.goto('/dashboard/admin/add-user');
    await expect(page.locator('h1:has-text("Add User")')).toBeVisible();

    // Fill form manually simulating a duplicate test
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Guy');
    await page.fill('input[name="username"]', 'duplicate_username');
    await page.fill('input[name="password"]', 'targetpass123');
    // Ensure default is USER
    await expect(page.locator('select[name="role"]')).toHaveValue('USER');

    await page.click('button[type="submit"]:has-text("Create User")');
    await expect(page.locator('text=Username already exists')).toBeVisible();

    // Now fix and proceed legitimately
    await page.fill('input[name="username"]', 'standard_target');
    await page.click('button[type="submit"]:has-text("Create User")');

    await expect(
      page.locator('text=Successfully created USER account for standard_target.')
    ).toBeVisible();

    // Verify form cleared manually tracking standard glass inputs
    await expect(page.locator('input[name="firstName"]')).toBeEmpty();

    // Form logic database verification bypasses browser bounds
    const dbTarget = await prisma.user.findUnique({
      where: { username: 'standard_target' },
    });
    expect(dbTarget?.role).toBe('USER');
    expect(dbTarget?.firstName).toBe('Test');
  });

  test('Super Admin can successfully assign SUPERADMIN role securely', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'admin_manager');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    await page.goto('/dashboard/admin/add-user');

    await page.fill('input[name="firstName"]', 'New');
    await page.fill('input[name="lastName"]', 'Admin');
    await page.fill('input[name="username"]', 'new_admin_target');
    await page.fill('input[name="password"]', 'adminpass1234');

    // Switch to SUPERADMIN specifically
    await page.selectOption('select[name="role"]', 'SUPERADMIN');

    await page.click('button[type="submit"]:has-text("Create User")');
    await expect(
      page.locator('text=Successfully created SUPERADMIN account for new_admin_target.')
    ).toBeVisible();

    const dbTarget = await prisma.user.findUnique({
      where: { username: 'new_admin_target' },
    });
    expect(dbTarget?.role).toBe('SUPERADMIN');
  });
});
