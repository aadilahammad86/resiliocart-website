# Prerequisites & Tech Stack

This document outlines the core technologies and prerequisites for the Resiliocart Website SPA.

## Runtime & Package Manager
- **Node.js**: v18+ (LTS recommended)
- **npm / pnpm / yarn**: pnpm preferred for speed

## Framework & Core Libraries
- **Next.js**: v14+ with App Router
- **React**: v18+ (bundled with Next.js)
- **TypeScript**: v5+

## Styling
- **Tailwind CSS**: v3+ with JIT mode
- **tailwind-merge**: conflict-free class merging
- **clsx**: conditional classNames utility
- **CSS backdrop-filter support**: for glassmorphism blur effects

## Authentication
- **NextAuth.js (Auth.js v5)**: session & JWT management
- **bcryptjs**: password hashing
- **jose**: JWT signing / verification (edge-compatible)

## Form Handling & Validation
- **React Hook Form**: performant form state
- **Zod**: schema validation (pairs with RHF via @hookform/resolvers)

## State Management
- **React Context API**: lightweight global state (auth, role)
- **Zustand (optional)**: if state grows beyond Context scope

## Data Fetching
- **Next.js Server Components / Route Handlers**: primary data layer
- **SWR or TanStack Query**: client-side caching & revalidation

## Database & ORM
- **PostgreSQL / MySQL / SQLite**: choose per hosting constraints
- **Prisma ORM**: type-safe DB client with migrations

## UI Component Utilities
- **Radix UI (Primitives)**: accessible headless components
- **Lucide React**: icon set
- **Framer Motion**: animations & page transitions

## Dev Tooling
- **ESLint**: with Next.js and TypeScript rules
- **Prettier**: code formatting
- **Husky + lint-staged**: pre-commit quality gates
- **VS Code**: with Tailwind IntelliSense & Prisma extensions

## Testing
- **Jest + React Testing Library**: unit & component tests
- **Playwright or Cypress**: end-to-end / auth flow testing
- **axe-core / Lighthouse**: accessibility auditing

## Version Control & CI/CD
- **Git + GitHub / GitLab**: source control with branch protection
- **GitHub Actions**: lint, test, and build pipeline
- **Vercel**: hosting & preview deployments (Next.js optimised)

## Environment Configuration
- **DATABASE_URL**: connection string for Prisma
- **NEXTAUTH_SECRET**: random 32-byte string for session encryption
- **NEXTAUTH_URL**: canonical app URL per environment
- **.env.local / .env.staging / .env.production**: separate env files per stage
