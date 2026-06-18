# Phase 4 - Enterprise-Aware Architecture

## Purpose

This phase defines the architectural boundaries, dependency rules, and code
ownership responsibilities of the application. The goal is to support the
Angular learning journey without introducing folders or abstractions before
they solve a real problem.

Architecture in this project means:

```text
ownership + boundaries + dependency direction
```

## Current Structure

```text
src/app/
  app.ts
  app.html
  app.css
  app.config.ts
  app.routes.ts
  app.spec.ts

  layout/
    app-shell.ts
    header.ts

  features/
    cases/
    create-case/
    review-queue/
```

The current structure is intentionally small. `core/` and `shared/` will be
created only when the course introduces code that genuinely belongs there.

## Ownership Boundaries

| Area | Responsibility | Project examples |
| --- | --- | --- |
| App root | Application composition and configuration | `app.config.ts`, `app.routes.ts` |
| `layout/` | Stable application frame and navigation | `AppShell`, `Header` |
| `features/` | Business capabilities and routed screens | cases, case creation, review queue |
| `core/` | Application-wide technical infrastructure | API configuration, authentication, error handling |
| `shared/` | Domain-independent reusable building blocks | tabs, generic UI, directives, utilities |
| `docs/` | Learning notes and architectural decisions | phase documents and roadmap |

## Dependency Direction

If `A` imports `B`, then `A` depends on `B`:

```text
A ----------------> B
consumer         dependency
```

The project follows these directions:

```text
App root -------> layout
App routes -----> features
Layout ---------> shared
Features -------> shared
Features -------> core

Shared ---X-----> features
Core -----X-----> features
Feature A -X----> Feature B internals
```

`X` marks a dependency that is not allowed. These rules keep lower-level,
reusable code independent from business-specific screens.

## Feature Evolution

A feature starts with the smallest useful structure:

```text
features/cases/
  cases-page.ts
  cases-page.css
```

Subfolders appear only when the feature gains those responsibilities:

```text
features/cases/
  cases-page.ts
  model/
  ui/
  data-access/
```

- `model/` defines business data shapes and types.
- `ui/` contains case-specific presentation components.
- `data-access/` owns HTTP communication and feature state.
- The routed page coordinates data and child components.

## Course-Aligned Growth

| Course phase | Expected artifact | Intended location |
| --- | --- | --- |
| Signals | case state and models | `features/cases/` |
| Signal component model | case cards and search UI | `features/cases/ui/` |
| `httpResource` | case data service | `features/cases/data-access/` |
| Signal Forms | case creation form | `features/create-case/` |
| DI and shared patterns | generic tabs and directives | `shared/` |
| SignalStore | review queue state | `features/review-queue/data-access/` |

## Placement Questions

Use these questions before creating or moving a file:

1. Does it understand a business concept? Keep it in its feature.
2. Is it application-wide technical infrastructure? Place it in `core/`.
3. Is it reusable and independent of the business domain? Place it in `shared/`.
4. Does it define the stable application frame? Place it in `layout/`.
5. Does it compose the application? Keep it at the app root.

## Terms

- **Boundary:** A responsibility border between parts of the application.
- **Dependency:** Code required by another piece of code to work.
- **Dependency direction:** The allowed direction of imports between areas.
- **Cohesion:** How closely the responsibilities inside one area belong together.
- **Coupling:** How strongly separate areas depend on each other.
- **Scope:** The part of the application in which a provider instance lives.
- **Singleton:** A service with one shared instance for the application lifetime.

## Patterns To Avoid

- Creating empty folders to make the project look enterprise-sized.
- Treating `shared/` as a folder for code with unclear ownership.
- Placing feature-specific services or stores in `core/`.
- Importing the internal files of one feature from another feature.
- Adding abstractions before there is a concrete use case.

## Phase Decision

No runtime files are moved in this phase. The existing app root, layout, and
feature boundaries already match the current project size. Future phases will
create `core/`, `shared/`, and feature subfolders when real Angular examples
require them.
