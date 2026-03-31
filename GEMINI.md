# Resiliocart — Persistent Agent Instructions

> Place this file at: `C:\Users\aadil\Project\resiliocart-website\GEMINI.md`
> Gemini CLI and Antigravity automatically load this file as system context at the start of every session.

---

## 🔴 BOOT: Read Global Rules First

**Before doing anything else, read:**
`C:\Users\aadil\.gemini\antigravity\ANTIGRAVITY_RULES.md`

Apply all rules in that file for the entire session. The rules in this file are project-specific additions and overrides on top of the global rules.

---

## 🔴 MANDATORY: Knowledge Base Update Rule

**At the end of EVERY session — or whenever a User Story is completed, a significant decision is made, a bug is resolved, or a new method/idea is proposed — you MUST append to `antigravity.md` cumulatively. Never remove existing history.**

### What to append

- Every completed User Story (with implementation details, branch name, key decisions)
- Every architectural decision made (even if not tied to a user story)
- Every bug encountered and its exact fix
- Every new dependency added (`pnpm add ...`) and why
- Every method, approach, or idea proposed — even ones rejected (note WHY they were rejected)
- Every ESLint/TypeScript/build error and its resolution
- Every Git mistake made and how it was undone

### How to append (Cumulative)

1. Open `antigravity.md` in the project root
2. Add a new dated section at the **bottom** under `## Session Log`. **Do NOT delete previous logs.**
3. Use this format (with full timestamp):

```markdown
### Session: [Brief Title] — [YYYY-MM-DD HH:mm]

#### Decisions Made

- [decision]: [reason]

#### Stories Completed

- **US-XX**: [what was built, key files changed, branch name]

#### Bugs Fixed

- **Problem:** [exact error message or symptom]
- **Cause:** [root cause]
- **Fix:** [exact fix applied]

#### New Dependencies

- `pnpm add [package]` — [why needed]

#### Methods / Ideas Proposed

- [idea or approach]: [outcome — accepted / rejected / deferred, and why]

#### Commands Run (non-obvious ones)

- `[command]` — [what it does / why it was needed]
```

---

## Project Identity

**Project:** Resiliocart
**Repo:** `github.com/aadilahammad86/resiliocart-website`
**Local path:** `C:\Users\aadil\Project\resiliocart-website`
**Developer:** `aadilahammad86` | `aadilahammad86@gmail.com`
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma v6 · PostgreSQL · pnpm · Playwright · Docker Desktop · Nginx · Ansible

---

## Non-Negotiable Rules (Always Follow)

### Code Quality

1. **Always run `npx eslint src/ e2e/` and fix ALL errors before any `git commit`**
2. **Never use `any` type** — use `unknown`, a specific interface, or `{ field?: type }` shape
3. **Never leave unused imports** — common offender: `revalidatePath`
4. **Always run `pnpm exec tsc --noEmit` before Docker builds** — catches type errors before CI fails

### Git Workflow

5. **Never commit directly to `main`** — always branch → PR → merge
6. **Branch naming:** `US-{number}-{short-description}`
7. **Commit convention:** `feat:`, `fix:`, `chore:`, `test:`, `docs:`
8. **Always create a new branch before writing any code for a new User Story**
9. **Command execution:** Only `git push origin` commands require explicit developer approval before running. All other commands (tests, lint, TypeScript, commits, installs, Docker, branch operations, PR creation, merges) execute automatically without waiting for approval. This is required for the 12-step workflow to run autonomously.

### Testing

10. **Always write Playwright E2E tests** for every User Story in Development phase
11. **All acceptance criteria must be verified by a passing Playwright test** — not just "the code looks right"
12. **Run `npx playwright test` and confirm green before calling a story complete**
13. **Use `data-testid` attributes** when a component has duplicate DOM elements (e.g., mobile + desktop sidebar both render `<aside>`)

### Pre-Commit Verification (MANDATORY — No Exceptions)

14. **ALWAYS run `.\scripts\verify.ps1` before every `git commit`** — this script is the single source of truth
15. **The script must end with "ALL CHECKS PASSED"** — if any step fails, fix the issue and re-run the script from the beginning
16. **Never rely on CI/CD to catch errors** — the pipeline is a safety net, not a substitute for local verification
17. **Pre-commit environment variables for host machine (not Docker internal):**
    - `DATABASE_URL` = `postgresql://user:password@localhost:5433/resiliocart?schema=public`
    - `BASE_URL` = `http://localhost`
18. **Script execution order:** Docker up → Prisma push → ESLint → TypeScript → Playwright

### Self-Updating Rules

19. **Whenever a new rule, fix, or workflow is agreed upon in conversation, the agent MUST automatically append it to `ANTIGRAVITY_RULES.md`, `GEMINI.md`, and `antigravity.md`** — never wait for an explicit prompt to update the rulebooks

### PR Process

20. **Always provide filled PR description text** when a story is finished — Description, `Resolves US-XX`, Type of Change (checkboxes), Quality Checklist
21. **After merging, always:** `git checkout main && git pull`

---

## Architecture Reference

### Session / Auth (Critical)

- JWT stored as HTTP-Only cookie — signed with `jose`
- Sessions are **persistent / infinite** — no expiry (by design)
- **`src/lib/jwt.ts`** — pure `jose` crypto (`encrypt`, `decrypt`) — NO `server-only` import — safe for Edge Middleware
- **`src/lib/session.ts`** — cookie read/write helpers — `import 'server-only'` — Server Components/Actions ONLY
- **`middleware.ts`** MUST import from `jwt.ts`, never `session.ts` (Edge Runtime crashes on `server-only`)
- After role change in DB: user must **logout + login** to get fresh JWT with new role

### Roles

- `USER` — standard access
- `SUPERADMIN` — can access `/dashboard/admin/add-user`, can change passwords without `currentPassword`
- Role is always derived from JWT cookie server-side — client-side overrides are ignored by route guards

### Prisma

- Version: `^6.0.0` (v7 has breaking config changes — do not upgrade without planning)
- `npx prisma db push` for schema sync (no migration files in dev)
- `npx prisma generate` after any schema change
- `npx tsx scripts/promote.ts <username>` — promote user to SUPERADMIN

### Docker / Deployment

- **3 containers:** `web` (Next.js), `db` (postgres:15-alpine), `nginx` (reverse proxy)
- **`output: 'standalone'`** must be set in `next.config.mjs` for Docker to work
- **Docker Desktop (Windows-native):** All Docker commands run in PowerShell/Windows terminal via Docker Desktop. WSL-native Docker is NOT used — it causes volume mount, networking, and Playwright issues.
- **Port mapping:** Local DB mapped to `localhost:5433` (Docker port 5432)
- **Environment:** All development — project files, terminal, and commands — runs entirely in the Windows filesystem. WSL is not involved in this project.
- **`node_modules`:** Ensure `pnpm install` is run in PowerShell to have Windows binaries for local testing

### TypeScript Build Rules

- All Server Actions must share `AuthState` type: `Promise<AuthState>` signature
- Use `z.string().refine()` instead of `z.enum()` for dynamic string validation
- `useFormState` prev state param: type as `AuthState`, never `any`

---

## Current Project Status

> ⚠️ Story status and project progress are tracked exclusively in `antigravity.md`.
> Do NOT update story status in this file — it lives in `antigravity.md` only.

- **Last story completed:** US-17
- **Next story:** See `antigravity.md`

---

## Quick Reference: Useful Commands

```bash
# Dev
pnpm dev                                    # Start dev server
pnpm exec tsc --noEmit                      # TypeScript check

# DB
npx prisma db push                          # Sync schema
npx tsx scripts/promote.ts <username>       # Promote to SUPERADMIN

# Testing
npx playwright test                         # All tests (headless)
npx playwright test --headed                # Visible browser
npx playwright test e2e/file.spec.ts        # Single spec
$env:BASE_URL='http://localhost:3001'; npx playwright test

# Linting (ALWAYS before commit)
npx eslint src/ e2e/

# Docker (run in PowerShell — Docker Desktop)
docker compose build && docker compose up -d
docker compose down -v --remove-orphans
```

---

## Knowledge Base Location

| File | Purpose | Source of Truth For |
|---|---|---|
| `ANTIGRAVITY_RULES.md` | Global agent rules | Agent behaviour across all projects |
| `GEMINI.md` (this file) | Project rules + architecture reference | Agent operating rules for this project |
| `antigravity.md` | Story tracker + session history | **Current story status + all project history** |

> `antigravity.md` is the sole source of truth for story status and project progress.
> This file (`GEMINI.md`) contains rules only — story status is never tracked here.
