# Recon Control Console

Recon Control Console is a modern Angular reference project for learning and demonstrating professional Angular application patterns through a focused reconciliation operations dashboard.

The project is built as a portfolio-ready learning journey. It follows the structure of an intermediate Angular curriculum while using an original domain and UI direction.

## Primary Goal

Learn modern Angular deeply and practically:

- Signals
- signal inputs and outputs
- computed and linked signals
- declarative data fetching
- modern routing
- signal forms
- dependency injection
- shared UI architecture
- SSR and hydration
- RxJS concurrency
- SignalStore
- Vitest testing

## Product Concept

The app helps an operations team review reconciliation cases.

Initial capabilities:

- list active reconciliation cases
- search and filter cases
- open case details
- create a new case
- manage a review queue
- review lightweight audit and timeline details

The domain is intentionally limited so the project stays focused on Angular concepts.

## Architecture Direction

The project will use an enterprise-aware structure without unnecessary complexity:

```text
src/app/
  core/
    api/
    config/
    guards/
    stores/
  shared/
    ui/
    directives/
    tabs/
  features/
    cases/
    case-detail/
    create-case/
    review-queue/
```

## Documentation

- [Project Brief](docs/project-brief.md)
- [Learning Roadmap](docs/learning-roadmap.md)
- [Phase 1 Angular Foundation](docs/phase-1-angular-foundation.md)
- [Phase 2 Components And Templates](docs/phase-2-components-and-templates.md)

## Getting Started

Recommended runtime:

- Node.js 22 LTS or another Angular-supported LTS version
- npm 11+

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run start
```

Build the project:

```bash
npm run build
```

Run tests:

```bash
npm test -- --watch=false
```

## Status

Phase 2 is in progress: component composition, templates, and the first professional app shell.

Current verification:

- `npm run build` passes
- `npm test -- --watch=false` passes
