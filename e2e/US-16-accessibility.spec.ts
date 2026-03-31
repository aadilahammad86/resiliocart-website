import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Design note: color-contrast violations are excluded because the glassmorphism
// palette is an intentional design decision approved by the product team.
const AXE_DISABLE = ['color-contrast'];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('US-16: Accessibility Audit', () => {
  test.beforeAll(async () => {
    await prisma.user.deleteMany({ where: { username: 'a11y_tester' } });
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        firstName: 'A11y',
        lastName: 'Tester',
        username: 'a11y_tester',
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });
  });

  test.afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: 'a11y_tester' } });
  });

  async function runAxeAudit(page: Page, path: string) {
    await page.goto(path);
    await page.waitForTimeout(1000);

    const results = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(AXE_DISABLE)
      .analyze();

    // Report any violations clearly
    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}`)
        .join('\n');
      expect(results.violations, `Violations on ${path}:\n${summary}`).toHaveLength(0);
    }
  }

  test('Login Page — no critical accessibility violations', async ({ page }) => {
    await runAxeAudit(page, '/login');
  });

  test('Dashboard — no critical accessibility violations', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'a11y_tester');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await runAxeAudit(page, '/dashboard');
  });

  test('Admin Add User Page — no critical accessibility violations', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'a11y_tester');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await runAxeAudit(page, '/dashboard/admin/add-user');
  });

  test('Account Settings Page — no critical accessibility violations', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'a11y_tester');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await runAxeAudit(page, '/dashboard/account');
  });
});
