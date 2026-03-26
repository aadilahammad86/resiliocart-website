# Phase: Design

## Epic: UI / Design System

### US-03: Create glassmorphism design system & component library
**Labels:** `user story`, `Phase: Design`, `Epic: UI / Design System`, `Priority: High`  
**Points:** 5  
**User Story:**  
As a **UI Designer**,  
I want to **establish a reusable glassmorphism token set (colors, blur, opacity, border-radius) and core components**,  
so that **all screens have a consistent, polished aesthetic without per-screen redesign**.

**Acceptance Criteria:**
- [ ] Design tokens defined in Tailwind config or CSS variables
- [ ] Glass card, glass button, glass input components created
- [ ] Light and dark backdrop variants documented
- [ ] Figma or Storybook reference available for devs

---

### US-04: Design authentication screens (Sign-up & Login)
**Labels:** `user story`, `Phase: Design`, `Epic: UI / Design System`, `Priority: High`  
**Points:** 3  
**User Story:**  
As a **UI Designer**,  
I want to **produce high-fidelity mockups for the Sign-up and Login pages**,  
so that **developers have pixel-accurate references and no ambiguity on layout**.

**Acceptance Criteria:**
- [ ] Sign-up screen shows First Name, Last Name, Username, Password fields
- [ ] Login screen shows Username and Password fields
- [ ] Error and success states are mocked
- [ ] Mobile-responsive layout included

---

### US-05: Design left sidebar navigation
**Labels:** `user story`, `Phase: Design`, `Epic: UI / Design System`, `Priority: High`  
**Points:** 3  
**User Story:**  
As a **UI Designer**,  
I want to **design the sidebar with all navigation items and role-based conditional states**,  
so that **developers know exactly what to show per user role without guessing**.

**Acceptance Criteria:**
- [ ] Sidebar shows Settings (Profile, Account Details) for all users
- [ ] Add User menu item visible only in Super Admin mock
- [ ] Logout action is present and clearly styled
- [ ] Collapsed/expanded states designed (if applicable)

---

### US-06: Design department-wise product grid
**Labels:** `user story`, `Phase: Design`, `Epic: UI / Design System`, `Priority: High`  
**Points:** 3  
**User Story:**  
As a **UI Designer**,  
I want to **design the main content area showing products grouped by department with price tags**,  
so that **the dev team can build the grid without layout ambiguity**.

**Acceptance Criteria:**
- [ ] Products displayed in a responsive grid
- [ ] Each product card shows name, department label, and price tag
- [ ] Empty state and loading skeleton designed
- [ ] Glassmorphism styling applied to product cards
