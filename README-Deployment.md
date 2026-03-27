# Phase: Deployment

This document covers all deployment-phase user stories for the Resiliocart SPA (US-17 to US-26).

---

## Epic: QA & Deployment

### US-17: Deploy containerised stack to on-premise staging

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: Medium`
**Points:** 5
**User Story:**
As a **DevOps / Developer**,
I want to **deploy the containerised application stack to an on-premise staging server**,
so that **stakeholders can validate the product before production release**.

**Acceptance Criteria:**

- On-premise staging server provisioned with Docker and Docker Compose via Ansible playbook
- Three containers defined and running via Docker Compose: Website, PostgreSQL DB, and Nginx reverse proxy
- Nginx configured as reverse proxy in front of the website container, serving on port 80/443
- PostgreSQL container uses a named volume for data persistence across restarts
- Environment variables (DB credentials, connection strings, app config) managed via `.env` file, not hardcoded in Compose file
- Staging URL or IP shared with stakeholders and accessible on the local network
- CI/CD pipeline approach documented as a decision to be made before production deployment

---

### US-18: Build & push versioned Docker images via CI/CD pipeline

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: High`
**Points:** 5
**User Story:**
As a **DevOps / Developer**,
I want to **build and push versioned Docker images for the Next.js application via an automated CI/CD pipeline**,
so that **every code change produces a reproducible, traceable artefact ready for deployment**.

**Acceptance Criteria:**

- GitHub Actions (or chosen CI tool) workflow triggers on push to `main` and `release/*` branches
- Pipeline stages: lint → unit test → build Docker image → push to container registry
- Docker image tagged with both the Git SHA and a semantic version (e.g. `v1.2.3`)
- Registry credentials stored as CI secrets, never in source code
- Failed pipeline prevents image push and notifies the team via configured channel
- Build logs retained for at least 30 days for audit purposes

---

### US-19: Provision production server via Ansible playbook

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: High`
**Points:** 5
**User Story:**
As a **DevOps / Developer**,
I want to **provision and configure the on-premise production server using an Ansible playbook**,
so that **the production environment is reproducible, version-controlled, and requires no manual SSH setup**.

**Acceptance Criteria:**

- Ansible playbook idempotently installs Docker, Docker Compose, and Nginx on the target host
- Firewall rules configured: ports 80 and 443 open, all others closed except SSH from admin subnet
- Non-root deploy user created with least-privilege access to Docker socket
- Playbook variables externalised into a vault-encrypted vars file (no plaintext secrets in repo)
- Playbook run produces a green `changed/ok` summary with zero failures
- Re-running the playbook on an already-configured server causes no unintended changes

---

### US-20: Deploy production stack with zero-downtime strategy

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: Critical`
**Points:** 8
**User Story:**
As a **DevOps / Developer**,
I want to **deploy the production Docker Compose stack to the on-premise server with zero-downtime strategy**,
so that **the live application is updated without interrupting active user sessions**.

**Acceptance Criteria:**

- Docker Compose production file defines three services: `app` (Next.js), `db` (PostgreSQL), `proxy` (Nginx)
- Rolling update achieved by pulling the new image, starting the new container, then stopping the old one
- Nginx upstream config updated automatically via container labels or deployment script
- Healthcheck endpoint (`/api/health`) polled before traffic is switched to the new container
- Rollback script documented and tested: re-deploys the previous image tag within 5 minutes
- Deployment script accepts `IMAGE_TAG` as an argument for targeted version promotion
- Deployment run logged with timestamp, actor, and image tag to a persistent audit log file

---

### US-21: Configure TLS termination on Nginx reverse proxy

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: High`
**Points:** 5
**User Story:**
As a **DevOps / Developer**,
I want to **configure TLS termination on the Nginx reverse proxy using a trusted certificate**,
so that **all traffic between clients and the server is encrypted and the browser shows a secure connection**.

**Acceptance Criteria:**

- TLS certificate obtained and installed (internal CA or Let's Encrypt, depending on network access)
- Nginx configured to redirect all HTTP (port 80) traffic to HTTPS (port 443)
- TLS 1.2 and 1.3 enabled; TLS 1.0 and 1.1 explicitly disabled in Nginx config
- HSTS header (`Strict-Transport-Security`) set with a minimum `max-age` of 180 days
- Certificate expiry date documented and a renewal reminder or automation set up
- SSL Labs or equivalent internal scan returns grade A or A+

---

### US-22: Automate PostgreSQL backups & verify restore procedures

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: High`
**Points:** 5
**User Story:**
As a **DevOps / Developer**,
I want to **automate PostgreSQL database backups and verify restore procedures**,
so that **data can be recovered to a known-good state in the event of corruption or accidental deletion**.

**Acceptance Criteria:**

- Cron job (or Docker scheduled task) runs `pg_dump` nightly and writes compressed dump to a dedicated backup volume
- Backup files retained for a minimum of 14 days with automatic deletion of older files
- Backup script sends a success/failure notification to the admin channel after each run
- Restore procedure documented step-by-step in the runbook
- Test restore performed on staging: dump from production restored successfully without errors
- Backup volume excluded from application container restarts (named volume, not bind mount)

---

### US-23: Set up centralised log aggregation for all containers

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: Medium`
**Points:** 3
**User Story:**
As a **DevOps / Developer**,
I want to **set up centralised log aggregation for all Docker containers on the production server**,
so that **application errors and infrastructure issues can be diagnosed without SSH-ing into the server**.

**Acceptance Criteria:**

- All containers configured with the `json-file` or `syslog` Docker logging driver with log rotation (max 10 MB, 5 files)
- Logs from `app`, `db`, and `proxy` containers streamed to a central location (Loki, ELK, or equivalent)
- Log dashboard or query interface accessible to the admin team
- Application-level errors (HTTP 5xx, uncaught exceptions) produce structured JSON log entries
- Retention policy set: logs older than 30 days archived or deleted

---

### US-24: Implement uptime & resource monitoring with alerting

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: Medium`
**Points:** 3
**User Story:**
As a **DevOps / Developer**,
I want to **implement uptime and resource monitoring with alerting for the production stack**,
so that **the team is notified proactively when the application is down or the server is under stress**.

**Acceptance Criteria:**

- Uptime check configured for the HTTPS endpoint with a check interval of 60 seconds or less
- Alert triggered if the endpoint is unreachable for more than 3 consecutive checks
- CPU, RAM, and disk usage metrics collected from the host via `node_exporter` or equivalent
- Alert triggered if disk usage exceeds 80% or RAM usage exceeds 90%
- Alert notifications delivered to the admin email and/or messaging channel
- Monitoring stack runs as a separate Compose service or external SaaS (not co-located with the app)

---

### US-25: Run pre-production smoke test suite before each release

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: Medium`
**Points:** 3
**User Story:**
As a **QA Engineer**,
I want to **run a pre-production smoke test suite against the staging deployment before every production release**,
so that **critical user journeys are verified on real infrastructure before end users are affected**.

**Acceptance Criteria:**

- Smoke test suite covers: login, load product grid, settings update, and (Super Admin) add user flows
- Tests execute against the staging URL using Playwright in headless mode
- Smoke tests triggered automatically at the end of the staging deployment pipeline
- A failing smoke test blocks the production deployment job and notifies the team
- Test report (pass/fail per scenario, screenshots on failure) uploaded as a CI artefact
- Suite completes in under 5 minutes to avoid blocking the pipeline

---

### US-26: Document deployment runbook & hand over to operations

**Labels:** `user story`, `Phase: Deployment`, `Epic: QA & Deployment`, `Priority: Medium`
**Points:** 2
**User Story:**
As a **DevOps / Developer**,
I want to **document the full deployment runbook and hand it over to the operations team**,
so that **any team member can deploy, rollback, or troubleshoot the application without tribal knowledge**.

**Acceptance Criteria:**

- Runbook covers: initial server provisioning, routine deployment, emergency rollback, certificate renewal, and backup restore
- Each procedure includes exact commands, expected outputs, and common error resolutions
- Runbook stored in the project repository under `/docs/runbook.md` and linked from the README
- A junior team member completes a dry-run deployment using only the runbook without assistance
- Runbook reviewed and signed off by at least one senior team member before production go-live
