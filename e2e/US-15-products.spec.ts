import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

test.describe('US-15: Department-wise Product Grid', () => {
  test.beforeAll(async () => {
    // Ensure we have a user to log in with
    await prisma.user.deleteMany({ where: { username: 'product_test_user' } });
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        firstName: 'Product',
        lastName: 'Tester',
        username: 'product_test_user',
        password: hashedPassword,
        role: 'USER',
      },
    });
  });

  test.afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: 'product_test_user' } });
  });

  test('Displays products grouped by department after loading', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[name="username"]', 'product_test_user');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 2. Verify Initial Loading State (Skeleton)
    // Since we have a 1.2s delay, skeletons should be visible briefly.
    // We look for the animate-pulse class on our cards.
    const skeletons = page.locator('.animate-pulse');
    await expect(skeletons.first()).toBeVisible();

    // 3. Wait for data to populate
    await expect(page.locator('h2:text("Electronics")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h2:text("Furniture")')).toBeVisible();

    // 4. Verify Product Details
    const productCard = page.locator('h3:text("Mechanical Keyboard")');
    await expect(productCard).toBeVisible();

    // Check price formatting
    await expect(page.locator('text=$149.99')).toBeVisible();

    // 5. Verify Grouping (Multiple items in Electronics)
    const electronicsSection = page.locator('section:has(h2:text("Electronics"))');
    await expect(electronicsSection.locator('h3')).toHaveCount(3); // Keyboard, Headphones, Monitor
  });

  test('Responsive Grid adapts to mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    await page.goto('/login');
    await page.fill('input[name="username"]', 'product_test_user');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Wait for load
    await page.waitForSelector('h2:text("Electronics")', { timeout: 5000 });

    // Verify grid stacks (1 column)
    const grid = page.locator('.grid').first();
    const gridStyle = await grid.evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
    // On mobile, grid-cols-1 should result in a single value like "343px" or "100%"
    expect(gridStyle.split(' ').length).toBe(1);
  });
});
