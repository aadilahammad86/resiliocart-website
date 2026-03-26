# Phase: Development

## Epic: Authentication

### US-07: Implement Sign-up page
**Labels:** `user story`, `Phase: Development`, `Epic: Authentication`, `Priority: Critical`  
**Points:** 5  
**User Story:**  
As a **User**,  
I want to **register with my First Name, Last Name, Username, and Password**,  
so that **I can create an account and access the application**.

**Acceptance Criteria:**
- [ ] All four fields rendered and validated (required, min-length for password)
- [ ] Duplicate username returns a clear error message
- [ ] On success, user is redirected to the login page or dashboard
- [ ] Form is accessible (label associations, keyboard navigation)

---

### US-08: Implement Login page
**Labels:** `user story`, `Phase: Development`, `Epic: Authentication`, `Priority: Critical`  
**Points:** 3  
**User Story:**  
As a **User**,  
I want to **log in with my Username and Password**,  
so that **I can securely access my personalised dashboard**.

**Acceptance Criteria:**
- [ ] Username and Password fields rendered and validated
- [ ] Invalid credentials show a user-friendly error
- [ ] Successful login stores session/token and redirects to main content
- [ ] Remember me or persistent session handled per spec

---

### US-09: Implement protected routes & session management
**Labels:** `user story`, `Phase: Development`, `Epic: Authentication`, `Priority: Critical`  
**Points:** 3  
**User Story:**  
As a **Developer**,  
I want to **restrict all authenticated pages so unauthenticated users are redirected to login**,  
so that **the application is secure and unauthorised access is prevented**.

**Acceptance Criteria:**
- [ ] Middleware or HOC guards all non-auth routes
- [ ] Expired/invalid tokens redirect to login with a toast notification
- [ ] Logout clears session/token and redirects to login

---

## Epic: Navigation

### US-10: Build left sidebar navigation component
**Labels:** `user story`, `Phase: Development`, `Epic: Navigation`, `Priority: High`  
**Points:** 3  
**User Story:**  
As a **User**,  
I want to **see and use the sidebar to navigate between sections**,  
so that **I can move through the app efficiently without losing context**.

**Acceptance Criteria:**
- [ ] Sidebar renders Settings, Profile, Account Details, and Logout for all users
- [ ] Active link is visually highlighted
- [ ] Sidebar is responsive (collapses to icon or drawer on mobile)
- [ ] Role-based items render conditionally from the user role prop

---

### US-11: Implement role-based sidebar (Super Admin — Add User)
**Labels:** `user story`, `Phase: Development`, `Epic: Navigation`, `Priority: High`  
**Points:** 2  
**User Story:**  
As a **Super Admin**,  
I want to **see an 'Add User' option in the sidebar that regular users cannot see**,  
so that **I can manage users without exposing admin controls to non-admins**.

**Acceptance Criteria:**
- [ ] Add User menu item hidden for non-Super-Admin roles
- [ ] Role is derived from auth token/session, not client-side override
- [ ] Navigating to /add-user directly as a regular user returns 403 or redirect

---

## Epic: Settings

### US-12: Build Profile settings page
**Labels:** `user story`, `Phase: Development`, `Epic: Settings`, `Priority: Medium`  
**Points:** 3  
**User Story:**  
As a **User**,  
I want to **view and update my profile information**,  
so that **I can keep my personal details up to date**.

**Acceptance Criteria:**
- [ ] First Name and Last Name fields are pre-filled and editable
- [ ] Save action updates data and shows a success notification
- [ ] Validation prevents empty required fields

---

### US-13: Build Account Details settings page
**Labels:** `user story`, `Phase: Development`, `Epic: Settings`, `Priority: Medium`  
**Points:** 3  
**User Story:**  
As a **User**,  
I want to **update my Username and Password from the Account Details section**,  
so that **I have control over my credentials without contacting support**.

**Acceptance Criteria:**
- [ ] Current password required before setting a new password
- [ ] Username change checks for duplicates
- [ ] Changes are persisted and reflected immediately in the UI

---

## Epic: Admin

### US-14: Build Add User page (Super Admin only)
**Labels:** `user story`, `Phase: Development`, `Epic: Admin`, `Priority: High`  
**Points:** 5  
**User Story:**  
As a **Super Admin**,  
I want to **add new users to the system by filling in their details**,  
so that **I can onboard team members without database-level access**.

**Acceptance Criteria:**
- [ ] Form includes First Name, Last Name, Username, Password, and Role fields
- [ ] Submission creates the user and shows confirmation
- [ ] Page is inaccessible to non-Super-Admin roles (server-side guard)
- [ ] Duplicate username prevention with inline error

---

## Epic: Main Content

### US-15: Build department-wise product grid
**Labels:** `user story`, `Phase: Development`, `Epic: Main Content`, `Priority: High`  
**Points:** 5  
**User Story:**  
As a **User**,  
I want to **view all products organised by department with price tags on the main page**,  
so that **I can quickly browse and find products relevant to my department**.

**Acceptance Criteria:**
- [ ] Products fetched from API/mock data and grouped by department
- [ ] Each card displays product name, department, and formatted price
- [ ] Grid is responsive across desktop, tablet, and mobile
- [ ] Loading skeleton shown while data is fetching
- [ ] Empty state shown if no products are available

---

## Epic: QA & Deployment

### US-16: Cross-browser testing & accessibility audit
**Labels:** `user story`, `Phase: Development`, `Epic: QA & Deployment`, `Priority: Medium`  
**Points:** 3  
**User Story:**  
As a **QA Engineer**,  
I want to **verify the SPA works correctly across major browsers and meets basic accessibility standards**,  
so that **all users regardless of browser or ability can use the application**.

**Acceptance Criteria:**
- [ ] Tested on Chrome, Firefox, Safari, and Edge
- [ ] No critical accessibility violations (axe or Lighthouse audit)
- [ ] Glassmorphism effects degrade gracefully on unsupported browsers

---

### US-17: Deploy application to staging environment
**Labels:** `user story`, `Phase: Development`, `Epic: QA & Deployment`, `Priority: Medium`  
**Points:** 2  
**User Story:**  
As a **DevOps / Developer**,  
I want to **deploy the SPA to a staging URL for stakeholder review**,  
so that **stakeholders can validate the product before production release**.

**Acceptance Criteria:**
- [ ] App deployed to Vercel (or agreed platform) with CI/CD pipeline
- [ ] Environment variables correctly configured for staging
- [ ] Staging URL shared with stakeholders
