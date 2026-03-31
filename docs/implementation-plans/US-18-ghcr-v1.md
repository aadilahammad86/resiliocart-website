# Implementation Plan: US-18 Build & Push to GHCR (Verified Locally)

The objective is to automate the building and pushing of Docker images to **GitHub Container Registry (GHCR)** while enforcing a strict "Local First" testing policy.

## User Review Required

> [!IMPORTANT]
> **Registry**: We will use **GHCR**. I will use the `GITHUB_TOKEN` for authentication, meaning no manual secret setup is required. The image will be hosted at `ghcr.io/${{ github.repository }}`.

> [!CAUTION]
> **Local-First Policy**: As per your instruction, we will **never** push to `main` until I have manually run `.\scripts\verify.ps1` and achieved a **100% pass rate (27 Chromium tests)**. The GitHub Action acts as the final "Gated" build.

## Proposed Changes

### CI/CD Workflow

#### [NEW] [docker-publish.yml](file:///c:/Users/aadil/Project/resiliocart-website/.github/workflows/docker-publish.yml)
- **Triggers**: On push to `main` and `release/*`.
- **Jobs**:
  - `verify`: Runs `pnpm lint` and `pnpm build` (ensures artifact generation is safe).
  - `build-push`:
    - Authenticates to `ghcr.io`.
    - Builds the production image using the multi-stage `Dockerfile`.
    - Tags: `latest`, `sha-${GITHUB_SHA}`, and `v${package.json.version}`.

### Repository Files

#### [MODIFY] [Dockerfile](file:///c:/Users/aadil/Project/resiliocart-website/Dockerfile)
- Ensure the Dockerfile is optimized for build caches in a CI environment.

## Open Questions

- None at this stage. I am clear on GHCR and the local testing requirement.

## Verification Plan

### Automated Verification
- Observe the GitHub Actions checkmark after the push.
- Verify the "Packages" section on your GitHub repository page shows the new image.

### Manual Verification
1. **Local Pre-Check**:
   ```powershell
   .\scripts\verify.ps1
   ```
2. **Approval**: Once the local script passes, I will show you the `git push` command for approval as per Rule 3.
3. **Pull Check**:
   ```powershell
   docker pull ghcr.io/<your-username>/resiliocart-website:latest
   ```
