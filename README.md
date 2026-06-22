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

The project uses enterprise-aware boundaries without unnecessary complexity:

```text
src/app/
  app.*
  layout/
  features/
    cases/
    create-case/
    review-queue/
```

`core/`, `shared/`, and feature subfolders are introduced when a concrete
course example requires them. See the Phase 4 document for ownership and
dependency rules.

## Documentation

- [Project Brief](docs/project-brief.md)
- [Learning Roadmap](docs/learning-roadmap.md)
- [Phase 1 Angular Foundation](docs/phase-1-angular-foundation.md)
- [Phase 2 Components And Templates](docs/phase-2-components-and-templates.md)
- [Phase 3 Routing Basics](docs/phase-3-routing-basics.md)
- [Phase 4 Enterprise-Aware Architecture](docs/phase-4-enterprise-architecture.md)
- [Phase 5 Signals Basics](docs/phase-5-signals-basics.md)
- [Phase 6 Signal Component Model](docs/phase-6-signal-component-model.md)
- [Phase 7 Template Control Flow](docs/phase-7-template-control-flow.md)
- [Phase 8 Declarative Data Fetching](docs/phase-8-http-resource.md)
- [Phase 9 Advanced Routing](docs/phase-9-advanced-routing.md)

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

Phase 9 is complete: case cards open shareable detail routes, dynamic route
parameters bind directly to signal inputs, secondary pages load lazily, and
functional guards plus native view transitions extend the Router lifecycle.

Current verification:

- `npm run build` passes
- `npm test -- --watch=false` passes
- 21 focused tests cover routing, HTTP behavior, resource states, signals, and component interaction
