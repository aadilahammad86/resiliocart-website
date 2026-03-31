---
description: Pre-commit verification before any git commit
---

# Pre-Commit Verification Workflow

Run this workflow EVERY TIME before committing. All 5 steps must pass with zero errors.

## Step 1: Switch to the correct feature branch
```powershell
git checkout US-XX-feature-name
```

## Step 2: Run the full verification script
```powershell
.\scripts\verify.ps1
```

This script automatically:
- Sets correct host environment variables (`DATABASE_URL` and `BASE_URL`)
- Starts the Docker stack (`docker compose up -d`)
- Syncs Prisma schema (`npx prisma db push`)
- Runs ESLint (`npx eslint src/ e2e/`)
- Runs TypeScript check (`pnpm exec tsc --noEmit`)
- Runs ALL 135 Playwright E2E tests across all 5 browsers

## Step 3: Only commit if the script ends with "ALL CHECKS PASSED"
```powershell
git add .
git commit -m "feat: your message here"
git push
```

> [!IMPORTANT]
> NEVER skip this script. NEVER commit if any step fails.
> The CI pipeline is a safety net, NOT a replacement for local verification.
