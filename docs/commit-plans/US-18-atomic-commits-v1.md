# Atomic Commit Plan: US-18-atomic-commits-v1

To maintain a clean and traceable repository history, I will split the current changes into three sequential commits. This avoids "blindly adding everything" and keeps configuration, testing, and deployment logic separate.

## User Review Required

> [!IMPORTANT]
> **Sequential Execution**: I will perform these commits one by one. After each `git commit`, I will show you the staged files for the next one.
> **No Remote Push**: I will only perform local commits. The final `git push` will still require your explicit approval as per Rule 3.

## Proposed Commit Sequence

### Commit 1: Documentation & Governance (Rule Updates)
**Files**:
- `antigravity.md` (Project history and session logs)
- `C:\Users\aadil\.gemini\antigravity\ANTIGRAVITY_RULES.md` (Global rule updates)
- `GEMINI.md` (Project specific rules)
- `RECAP_US-17_REGRESSION_TESTING.md`
- `docs/implementation-plans/US-18-ghcr-v1.md`
- `docs/commit-plans/US-18-atomic-commits-v1.md`

### Commit 2: Test Suite Optimization (Story-Based Refactor)
**Files**:
- `playwright.config.ts`
- `scripts/verify.ps1`
- `package.json` / `pnpm-lock.yaml`
- ALL `e2e/US-*.spec.ts` files

### Commit 3: CI/CD Infrastructure (US-18)
**Files**:
- `.github/workflows/docker-publish.yml`
