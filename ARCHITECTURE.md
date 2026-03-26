# Resiliocart Website SPA Architecture

This document serves as the primary blueprint for the `resiliocart-website` SPA, detailing our core technology choices, structural conventions, and user role definitions. (Fulfills **US-01**)

## 1. Tech Stack

Our complete technology stack is thoroughly documented in our [Prerequisites & Tech Stack](./README-Prerequisites.md) guide. 

At a high level, the application relies heavily on:
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with Glassmorphism design system tokens)
- **Database/ORM:** PostgreSQL & Prisma
- **Auth:** NextAuth.js (Auth.js v5)

## 2. Folder Structure & Conventions

To ensure the codebase scales cleanly across the team, we adhere to the following directory layout and file naming conventions:

### Directory Layout

```text
resiliocart-website/
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API route handlers)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Generic, foundational elements (e.g., GlassCard, Button)
│   │   └── features/       # Feature-specific blocks (e.g., ProductGrid, ProfileForm)
│   ├── lib/                # Utility functions, Prisma client instance, constants
│   ├── styles/             # Global CSS and Tailwind configuration directives
│   ├── hooks/              # Custom React hooks (e.g., for data fetching, auth state)
│   └── types/              # Global TypeScript interfaces and type definitions
├── prisma/                 # Database schema definitions and migrations
├── public/                 # Public static assets (images, fonts, favicons)
└── .github/                # GitHub pipelines, Actions, and Issue Templates
```

### File Naming Conventions
- **React Components:** `PascalCase.tsx` (e.g., `GlassCard.tsx`, `SidebarNav.tsx`).
- **Hooks:** `camelCase.ts` starting with `use` (e.g., `useAuth.ts`, `useWindowScroll.ts`).
- **Utility Functions:** `camelCase.ts` (e.g., `formatCurrency.ts`, `dateUtils.ts`).
- **Type Definitions:** `PascalCase.ts` (e.g., `User.ts`, `ProductType.ts`).
- **CSS Styles:** We strictly use Tailwind utility classes. For custom CSS, it belongs in `src/styles/globals.css`.

## 3. Role Definitions & Access Control

The SPA employs a simple but strict Role-Based Access Control (RBAC) system supporting two primary distinct account types:

### 1. User (Regular User)
The default provisioned role applied to individuals who register via the public Sign-up page.
- **Capabilities:**
  - Can view their own profile and account details.
  - Can browse products globally and segment them by department.
  - Can modify their personal settings and login credentials.
- **Restrictions:**
  - Cannot add or provision other user accounts.
  - Stripped of any administrative navigation links (e.g., the `Add User` form is entirely hidden/blocked).

### 2. Super Admin
The administrative, high-level role responsible for system personnel management.
- **Capabilities:**
  - Inherits all Regular User permissions.
  - **Exclusive Access:** Features access to the `Add User` sidebar navigation link and the accompanying isolated provisioning form to manually invite team members without touching the database directly.
- **Restrictions:** None. Access to this role is heavily guarded and strictly controlled via direct database promotion.
