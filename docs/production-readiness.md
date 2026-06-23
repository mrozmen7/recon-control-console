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
```

What each gate proves:

| Gate                        | Purpose                                                       |
| --------------------------- | ------------------------------------------------------------- |
| `npm ci`                    | installs exactly from `package-lock.json`                     |
| `npm test -- --watch=false` | runs the automated test suite once                            |
| `npm run build`             | verifies TypeScript, Angular compilation, and bundle creation |

## CI/CD Gate

The repository includes a GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

The workflow runs on:

- pushes to `main`
- pull requests targeting `main`

The workflow checks:

```text
npm ci
npm test -- --watch=false
npm run build
```

In a real company, this kind of workflow blocks weak pull requests from being
merged before the project can install, test, and build cleanly.

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
- add deployment preview workflow
