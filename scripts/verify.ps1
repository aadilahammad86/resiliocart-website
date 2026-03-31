# Resiliocart Pre-Commit Verification Script
# Usage: .\scripts\verify.ps1
# Runs all checks autonomously. Only git commands are handled manually by the developer.
#
# WINDOWS-NATIVE DOCKER ENVIRONMENT RULES:
#   - Docker Desktop (Windows) manages containers via native engine.
#   - Project files run from the Windows filesystem (C:).
#   - All commands (pnpm, npx, tsc, eslint, prisma) run directly in PowerShell.
#   - Playwright E2E tests target: http://localhost (Docker Nginx proxy).
#   - DATABASE_URL for host-side tools: localhost:5433 (mapped to 5432).

$ErrorActionPreference = "Stop"
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  RESILIOCART PRE-COMMIT VERIFICATION  " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Rebuilding Docker stack (tsc + lint + next build runs inside Linux)..." -ForegroundColor Yellow
$env:NEXT_PUBLIC_APP_URL = "http://localhost"
docker compose up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: docker compose up --build failed." -ForegroundColor Red
    exit 1
}
Write-Host "      OK - all containers healthy." -ForegroundColor Green
Write-Host ""

Write-Host "[2/3] Syncing Prisma schema natively..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://user:password@localhost:5433/resiliocart?schema=public"
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "FAILED: prisma db push failed." -ForegroundColor Red
    exit 1
}
Write-Host "      OK - schema synced." -ForegroundColor Green
Write-Host ""

Write-Host "[3/3] Running story-based Playwright E2E suite natively (27 tests, Chromium only)..." -ForegroundColor Yellow
Write-Host "      Target: http://localhost (Docker Nginx proxy)" -ForegroundColor DarkGray
Write-Host ""
$env:DATABASE_URL = "postgresql://user:password@localhost:5433/resiliocart?schema=public"
$env:BASE_URL = "http://localhost"
$env:NEXT_PUBLIC_APP_URL = "http://localhost"
npx playwright test
$playwrightExitCode = $LASTEXITCODE

if ($playwrightExitCode -ne 0) {
    Write-Host ""
    Write-Host "FAILED: Playwright tests failed. DO NOT COMMIT." -ForegroundColor Red
    Write-Host "Inspect: npx playwright show-report" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  ALL CHECKS PASSED. SAFE TO COMMIT.   " -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Git commands to run manually:" -ForegroundColor Cyan
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m [your message]" -ForegroundColor White
Write-Host "  git push" -ForegroundColor White
Write-Host ""
