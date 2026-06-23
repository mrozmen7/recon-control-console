# Recon Control Console

Recon Control Console is a portfolio-ready Angular reference project that
demonstrates modern Angular application patterns through a focused
reconciliation operations console.

The project follows an intermediate Angular learning path and applies each
topic in an original product domain. The goal is not to build a large banking
system; the goal is to show clear Angular ownership, state flow, routing, data
access, forms, dependency injection, performance, and testing decisions.

## What This Project Demonstrates

- Standalone Angular application structure
- Component composition, templates, property binding, and event binding
- Modern routing, lazy component loading, route guards, route params, and view transitions
- Signals with `signal()`, `computed()`, `input()`, `output()`, `model()`, and `linkedSignal()`
- Template control flow with `@if`, `@for`, and `@switch`
- Declarative data fetching with `httpResource`
- Signal Forms with typed models, validation, debounce, conditional disable, and submit lifecycle
- Dependency Injection with root providers, scoped providers, `InjectionToken`, directives, host directives, and content children
- NgRx SignalStore with `rxMethod`, RxJS `exhaustMap`, optimistic update, rollback, and store tests
- Rendering and performance behavior with lazy routes and `@defer`
- Unit and component testing with Angular testing utilities and Vitest
- CI quality gates with GitHub Actions
- Architecture documentation and ADR records

## Product Concept

The application helps an operations team monitor reconciliation exceptions and
review case workflow.

Core user flows:

- Review operational case metrics
- Search and filter reconciliation cases
- Open a case detail route
- Create a case with Signal Forms
- Move review items through a SignalStore-powered queue
- Simulate optimistic success and rollback behavior
- Inspect lightweight interaction audit information

The domain is intentionally small so Angular concepts remain the center of the
project.

## Architecture

The project uses enterprise-aware boundaries without creating folders before
they have a real responsibility.

```text
src/app/
  app.*                 application composition
  layout/               stable shell and navigation
  core/                 app-wide infrastructure
  shared/               reusable domain-independent UI and directives
  features/             business capabilities and routed screens
    cases/
    create-case/
    review-queue/
```

Dependency direction:

```text
app root ---> layout
app root ---> features
features ---> core
features ---> shared
layout -----> shared

shared -X-> features
core ---X-> features
```

See [Architecture Overview](docs/architecture-overview.md) and
[Phase 4 Enterprise-Aware Architecture](docs/phase-4-enterprise-architecture.md)
for the detailed rules.

## Documentation

- [Project Brief](docs/project-brief.md)
- [Learning Roadmap](docs/learning-roadmap.md)
- [Architecture Overview](docs/architecture-overview.md)
- [Production Readiness](docs/production-readiness.md)
- [Phase 13 Portfolio Polish](docs/phase-13-portfolio-polish.md)
- [ADR 0001 - Modern Angular Reference Architecture](docs/adr/0001-modern-angular-reference-architecture.md)
- [ADR 0002 - Signal-First State And Data Flow](docs/adr/0002-signal-first-state-and-data-flow.md)
- [ADR 0003 - CI Quality Gates](docs/adr/0003-ci-quality-gates.md)

Learning phase notes:

- [Phase 1 Angular Foundation](docs/phase-1-angular-foundation.md)
- [Phase 2 Components And Templates](docs/phase-2-components-and-templates.md)
- [Phase 3 Routing Basics](docs/phase-3-routing-basics.md)
- [Phase 4 Enterprise-Aware Architecture](docs/phase-4-enterprise-architecture.md)
- [Phase 5 Signals Basics](docs/phase-5-signals-basics.md)
- [Phase 6 Signal Component Model](docs/phase-6-signal-component-model.md)
- [Phase 7 Template Control Flow](docs/phase-7-template-control-flow.md)
- [Phase 8 Declarative Data Fetching](docs/phase-8-http-resource.md)
- [Phase 9 Advanced Routing](docs/phase-9-advanced-routing.md)
- [Phase 10 Signal Forms](docs/phase-10-signal-forms.md)
- [Phase 11 Dependency Injection And Shared Patterns](docs/phase-11-di-shared-patterns.md)
- [Phase 12 SignalStore, RxJS, Performance, And Testing](docs/phase-12-signalstore-rxjs-performance-testing.md)

## Getting Started

Recommended runtime:

- Node.js 22 LTS
- npm 11+

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run start
```

Open:

```text
http://localhost:4200
```

Run production build:

```bash
npm run build
```

Run the test suite once:

```bash
npm test -- --watch=false
```

## Quality Gates

The repository is designed to be checked before every shareable change:

```text
npm ci
npm test -- --watch=false
npm run build
```

The GitHub Actions workflow in
[ci.yml](.github/workflows/ci.yml) runs the same gates on pushes and pull
requests.

## Current Status

Phase 13 is complete: the application has professional documentation,
architecture notes, ADRs, CI quality gates, and final portfolio guidance.

Current verification:

- `npm test -- --watch=false` passes
- `npm run build` passes
- 37 focused tests cover routing, HTTP behavior, resource states, Signal Forms, Dependency Injection, shared directives, generic tabs, SignalStore, RxJS concurrency, rollback, deferred rendering, signals, and component interaction

## Suggested GitHub Repository Details

Description:

```text
Modern Angular reference project for Signals, routing, Signal Forms, DI, SignalStore, RxJS, performance, and testing.
```

Topics:

```text
angular, angular-signals, signalstore, ngrx-signals, rxjs, signal-forms, routing, dependency-injection, vitest, portfolio-project
```
