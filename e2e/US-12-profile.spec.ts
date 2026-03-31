import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

test.describe('US-12: Profile Settings Page', () => {
  test.beforeAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({
      where: { username: 'profile_test_user' },
    });

    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.create({
      data: {
        firstName: 'OriginalFirst',
        lastName: 'OriginalLast',
        username: 'profile_test_user',
        password: hashedPassword,
        role: 'USER',
      },
    });
  });

  // Re-verify the database changes after the test manually restores the profile if needed
  test.afterAll(async () => {
    await prisma.user.deleteMany({
      where: { username: 'profile_test_user' },
    });
  });

  test('Pre-fills data from the database, allows updating First Name, and retains it on reload', async ({
    page,
  }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'profile_test_user');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 2. Navigate to Profile via sidebar (desktop view assumed)
    await page.locator('[data-testid="sidebar-desktop"] a[href="/dashboard/profile"]').click();
    await page.waitForURL('**/dashboard/profile');

    // 3. Verify Pre-filled Data
    const firstNameInput = page.locator('input[name="firstName"]');
    const lastNameInput = page.locator('input[name="lastName"]');
    const usernameInput = page.locator('input[name="username"]');

    await expect(firstNameInput).toHaveValue('OriginalFirst');
    await expect(lastNameInput).toHaveValue('OriginalLast');
    await expect(usernameInput).toHaveValue('profile_test_user');
    await expect(usernameInput).toBeDisabled();

    // 4. Update the fields
    await firstNameInput.fill('UpdatedFirst');
    await lastNameInput.fill('UpdatedLast');

    // 5. Submit form
    await page.click('button[type="submit"]:has-text("Save Changes")');

    // 6. Verify success notification (from useFormState)
    const successToast = page.locator('text=Profile updated successfully!');
    await expect(successToast).toBeVisible();

    // 7. Hard refresh the page to verify that the UI pulls the mutated database record
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input[name="firstName"]')).toHaveValue('UpdatedFirst');
    await expect(page.locator('input[name="lastName"]')).toHaveValue('UpdatedLast');
  });

  // Note: HTML5 `required` prevents us from physically submitting empty fields on the client,
  // making automated E2E for empty fields strictly test browser validation directly.
});
