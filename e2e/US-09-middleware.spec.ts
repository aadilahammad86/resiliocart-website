import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

test.describe('US-09: Protected Routes & Middleware Verification', () => {
  test.beforeAll(async () => {
    // Delete any previous middleware test footprints
    await prisma.user.deleteMany({
      where: { username: 'middleware_user' },
    });

    // Provision exactly one test user
    const hashedPassword = await bcrypt.hash('secret123', 10);
    await prisma.user.create({
      data: {
        firstName: 'Middle',
        lastName: 'Ware',
        username: 'middleware_user',
        password: hashedPassword,
        role: 'USER',
      },
    });
  });

  test('Anonymous users navigating directly to /dashboard natively get securely ejected to /login by generic Middleware rules', async ({
    page,
  }) => {
    // Attempting to go straight to a protected core route without any authenticated payload context
    await page.goto('/dashboard');

    // The Next.js Edge Middleware dynamically identifies the absent JWT and seamlessly redirects dynamically
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Authenticated user is safely and persistently bounded away from the strictly public login entry points via the generic Middleware routing layers', async ({
    page,
  }) => {
    // 1. Fully Login formally via the GUI to establish the HTTP-Only securely locked jwt session cookie context natively
    await page.goto('/login');
    await page.fill('input[name="username"]', 'middleware_user');
    await page.fill('input[name="password"]', 'secret123');
    await page.click('button[type="submit"]');

    // 2. Await to cross over into the authenticated secure environment
    await page.waitForURL('**/dashboard');

    // 3. Deliberately attempt an illegal navigation action backward against inherently intended logical routing behavior globally into public zones
    await page.goto('/login');

    // 4. Edge Middleware strictly reads the validated signed token and intrinsically rebounds the route directly back into the application context safely
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});
