# Antigravity Agent — Global Persistent Instructions

> File location: `C:\Users\aadil\.gemini\antigravity\ANTIGRAVITY_RULES.md`
> This file applies to ALL Antigravity sessions across ALL projects.
> Reference the project-specific `GEMINI.md` in the project root for project-level context.

---

## 🔴 RULE 1: Knowledge Base Update (Mandatory Every Session)

**At the end of EVERY session — or whenever any of the following occur — you MUST append to `antigravity.md` in the project root:**

### Triggers (any one of these = append now)

- A User Story is completed
- A significant architectural decision is made
- A bug is encountered and fixed
- A new method, idea, or approach is proposed (even if rejected)
- A new dependency is added
- An ESLint / TypeScript / build error is resolved
- A Git mistake is made and recovered from

### Append Format

Open `antigravity.md` and add at the **bottom** under `## Session Log`:

```markdown
### Session: [Brief Title] — [YYYY-MM-DD]

#### Decisions Made

- [decision]: [reason]

#### Stories Completed

- **US-XX**: [what was built, key files changed, branch name]

#### Bugs Fixed

- **Problem:** [exact error or symptom]
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

## 🔴 RULE 2: User Story Workflow (Mandatory, 12 Steps, Every Story)

For every new User Story, follow these steps **in exact order**. Use **GitHub CLI (`gh`)** for all Git and PR operations.

### Step 1 — Branch from main

```bash
git checkout main && git pull
git checkout -b US-{number}-{short-description}
```

### Step 2 — Implement

- Add or modify all required code and files
- Follow Code Quality rules: no `any` types, no unused imports, TypeScript strict

### Step 3 — Write Tests

- Write Playwright E2E tests covering **every** acceptance criteria item
- Use `data-testid` attributes where duplicate DOM elements exist
- File: `e2e/{feature}.spec.ts`

### Step 4 — Run Full Test Suite (100% pass required)

```bash
npx playwright test
```

- Fix ALL failing tests and re-run until completely green
- Do NOT proceed until pass rate is 100%

### Step 5 — Lint & Static Analysis (zero issues required)

```bash
npx eslint src/ e2e/
pnpm exec tsc --noEmit
```

- Fix ALL errors before proceeding — zero tolerance

### Step 6 — Stage & Commit

```bash
git add .
git commit -m "feat|fix|chore|test|docs: description"
```

### Step 7 — Re-verify after commit

- If husky surfaces new errors, fix and commit again until clean

### Step 8 — Push branch

```bash
git push -u origin US-{number}-{short-description}
```

### Step 9 — Create PR via GitHub CLI

```bash
gh pr create \
  --title "feat: [Story Title] (US-{number})" \
  --body-file "tmp/pr_body.md" \
  --head US-{number}-{short-description} \
  --base main
```

- Always use `.github/PULL_REQUEST_TEMPLATE.md` as the body base
- Fill in: Description, `Resolves US-{number}`, Type of Change checkboxes, Quality Checklist
- Write filled body to `tmp/pr_body.md`, delete file after PR is created

### Step 10 — Address review comments

- Fix on same branch → re-run tests + lint → `git add . && git commit && git push`

### Step 11 — Rebase and merge via GitHub CLI

```bash
gh pr merge {PR-number} --rebase --delete-branch
```

- Always `--rebase` for linear history
- `--delete-branch` cleans up remote branch automatically

### Step 12 — Return to main

```bash
git checkout main && git pull
```

---

## 🔴 RULE 3: Command Execution Policy

**For `git push origin` commands only — always pause and wait for explicit developer approval before executing.**

All other commands (tests, lint, TypeScript checks, installs, commits, branch operations, PR creation, merges, etc.) must be executed **automatically and immediately** without waiting for approval — this is required for the 12-step workflow to run autonomously.

### Summary

| Command Type | Behavior |
|---|---|
| `git push origin ...` | ⛔ STOP — show command, explain it, wait for explicit approval |
| Everything else | ✅ Execute automatically and proceed |

### For `git push origin` commands specifically:

- Show the command clearly in a code block
- Explain what it does and why
- Wait for the developer to explicitly confirm before running

---


## 🔴 RULE 4: Code Quality Standards (Non-Negotiable)

1. **No `any` types** — use `unknown`, specific interface, or `{ field?: type }` shape
2. **No unused imports or variables** — common offender: `revalidatePath`
3. **Run `npx eslint src/ e2e/`** and fix ALL errors before every commit
4. **Run `pnpm exec tsc --noEmit`** before every Docker build
5. **All Server Actions** must use `Promise<AuthState>` signature — never `any` for `prevState`
6. **Check ESLint output** after every file edit — do not wait until commit to discover errors

---

## 🔴 RULE 5: Testing Standards (Non-Negotiable)

1. Every acceptance criteria checkbox = one or more Playwright tests
2. A story is NOT complete until `npx playwright test` returns 100% pass
3. Use `--headed` mode to visually verify UI before marking complete
4. Use `data-testid` on elements that share tag names across mobile/desktop variants
5. Accessibility: all form inputs must have `id` + matching `htmlFor` on labels

---

## 🔴 RULE 6: Platform & Environment Policy

1. **Native Windows Environment**: All commands (Docker, Node.js, pnpm, Playwright) **MUST** run natively in the Windows host filesystem and PowerShell terminal.
2. **No WSL Involvement**: Never use `wsl` prefixes or attempt to run commands within the WSL subsystem for this project.
3. **PowerShell First**: All automation scripts (`.ps1`) and terminal commands must be written for and executed in PowerShell.

---

## Knowledge Base Files

| File                   | Location                              | Purpose                                     |
| ---------------------- | ------------------------------------- | ------------------------------------------- |
| `ANTIGRAVITY_RULES.md` | `C:\Users\aadil\.gemini\antigravity\` | Global agent rules (this file)              |
| `GEMINI.md`            | Project root                          | Project-specific rules                      |
| `antigravity.md`       | Project root                          | Status tracking + session history & knowledge |

**On every session start:**

1. Read `GEMINI.md` from the project root for project-level logic/rules
2. Read `antigravity.md` for current project status + full historical context
3. Apply all rules from this file globally

**On every session end (or story completion):**

1. Update the status table in `antigravity.md` (tick completed stories, update "Next Story")
2. Append session log to `antigravity.md`

