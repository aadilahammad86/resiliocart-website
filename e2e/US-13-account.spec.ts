import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

test.describe('US-13: Account Details & Role-Based Rules', () => {
  test.beforeEach(async () => {
    // Reset database state for repeatability
    await prisma.user.deleteMany({
      where: {
        username: { in: ['account_user', 'account_user_new', 'account_admin', 'taken_username'] },
      },
    });

    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.create({
      data: {
        firstName: 'Account',
        lastName: 'User',
        username: 'account_user',
        password: hashedPassword,
        role: 'USER',
      },
    });

    await prisma.user.create({
      data: {
        firstName: 'Account',
        lastName: 'Admin',
        username: 'account_admin',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });

    await prisma.user.create({
      data: {
        firstName: 'Taken',
        lastName: 'Guy',
        username: 'taken_username',
        password: hashedPassword,
        role: 'USER',
      },
    });
  });

  test('USER requires current password to change username', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'account_user');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    await page.goto('/dashboard/account');

    // Attempt to change username WITHOUT password
    await page.fill('input[name="username"]', 'account_user_new');
    await page.click('button[type="submit"]:has-text("Save Changes")');

    await expect(page.locator('text=Current password is required')).toBeVisible();

    // Now provide invalid password
    await page.fill('input[name="currentPassword"]', 'wrongpass');
    await page.click('button[type="submit"]:has-text("Save Changes")');
    await expect(page.locator('text=Incorrect current password.')).toBeVisible();

    // Now provide the correct password
    await page.fill('input[name="currentPassword"]', 'password123');
    await page.click('button[type="submit"]:has-text("Save Changes")');
    await expect(page.locator('text=Account details updated successfully!')).toBeVisible();

    // Wait and verify we are still logged in and the new username reflects
    await page.reload();
    await expect(page.locator('input[name="username"]')).toHaveValue('account_user_new');
  });

  test('Duplicate username is rejected', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'account_user');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    await page.goto('/dashboard/account');

    // Attempt collision with 'taken_username'
    await page.fill('input[name="username"]', 'taken_username');
    await page.fill('input[name="currentPassword"]', 'password123');
    await page.click('button[type="submit"]:has-text("Save Changes")');

    await expect(page.locator('text=Username is already taken.')).toBeVisible();
  });

  test('SUPERADMIN bypasses current password to set new password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'account_admin');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    await page.goto('/dashboard/account');

    // Verify current password input is entirely absent for Superadmin
    await expect(page.locator('input[name="currentPassword"]')).not.toBeVisible();

    // Update password without providing the old one
    await page.fill('input[name="newPassword"]', 'supersecret456');
    await page.click('button[type="submit"]:has-text("Save Changes")');
    await expect(page.locator('text=Account details updated successfully!')).toBeVisible();

    // 1. Log out
    await page.locator('[data-testid="sidebar-desktop"] button:has-text("Logout")').click();
    await page.waitForURL('**/login');

    // 2. Log in with NEW password
    await page.fill('input[name="username"]', 'account_admin');
    await page.fill('input[name="password"]', 'supersecret456');
    await page.click('button[type="submit"]');

    // 3. Verify success
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1:has-text("Products")')).toBeVisible();
  });
});
