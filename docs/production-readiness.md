# Production Readiness

## Purpose

This document defines the quality gates used before treating the project as a
shareable portfolio artifact.

Production readiness here means:

```text
the project can be installed, tested, built, reviewed, and explained reliably
```

It does not mean the mock data is a real production backend.

## Local Quality Gates

Run these commands before publishing a major change:

```bash
npm ci
npm test -- --watch=false
npm run build
npm run prepare:github-pages
```

What each gate proves:

| Gate                           | Purpose                                                       |
| ------------------------------ | ------------------------------------------------------------- |
| `npm ci`                       | installs exactly from `package-lock.json`                     |
| `npm test -- --watch=false`    | runs the automated test suite once                            |
| `npm run build`                | verifies TypeScript, Angular compilation, and bundle creation |
| `npm run prepare:github-pages` | verifies GitHub Pages post-build preparation                  |

## CI/CD Gate

The repository includes a GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

The verification workflow runs on:

- pushes to `main`
- pull requests targeting `main`
- manual runs through `workflow_dispatch`

The verification job checks:

```text
npm ci
npm test -- --watch=false
npm run build
```

The deployment job runs only for pushes to `main`:

```text
npm ci
npm run build
npm run prepare:github-pages
patch index.html with the GitHub Pages base href
write 404.html for Angular route fallback
upload dist/recon-control-console/browser
deploy to GitHub Pages
```

In a real company, this kind of workflow blocks weak pull requests from being
merged before the project can install, test, and build cleanly. The deploy job
then publishes only the verified main branch.

## GitHub Pages Deployment

The app is deployed as a static Angular application under the repository path:

```text
https://mrozmen7.github.io/recon-control-console/
```

Angular needs this base path during deployment:

```text
/recon-control-console/
```

The project exposes a post-build preparation command:

```bash
npm run prepare:github-pages
```

That command executes `scripts/prepare-github-pages.mjs` after `npm run build`.
The script updates the generated `index.html` base href and writes `404.html`.

The `404.html` fallback is important because GitHub Pages does not know Angular
routes such as `/cases/CASE-1001`. The fallback lets the browser load Angular
first, and then Angular Router handles the route.

## Manual Review Checklist

Use this checklist before sharing the project on GitHub or LinkedIn:

- README explains the product and learning purpose.
- Documentation links work.
- ADR records explain the major technical decisions.
- Tests pass locally.
- Build passes locally.
- Git status contains only intentional changes.
- The app opens on `/cases`, `/cases/new`, `/cases/CASE-1001`, and `/queue`.
- The review queue demonstrates optimistic update and rollback.
- The create case page demonstrates Signal Forms validation.
- The case list demonstrates HTTP resource states and template control flow.

## Known Runtime Recommendation

Use Node.js 22 LTS for local development and CI. Odd-numbered Node.js versions
can work locally, but they are not recommended for production-grade validation.

## Out Of Scope

The current project intentionally does not include:

- real authentication
- real authorization
- backend deployment
- environment-specific API URLs
- visual regression tests
- end-to-end browser automation

Those are valid future production topics, but they would distract from the
current Angular learning objective.

## Future Enhancements

Good next steps after this training project:

- connect to the Spring Boot reconciliation backend
- add environment configuration for real API endpoints
- add route-level authorization
- add end-to-end tests for critical workflows
- add accessibility checks in CI
- add deployment preview workflow for pull requests
