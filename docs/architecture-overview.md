# Architecture Overview

## Purpose

This document explains how Recon Control Console is organized and why the
project uses this structure. It is written for future reviewers, interviewers,
and maintainers who want to understand the application boundaries quickly.

The guiding rule is:

```text
architecture = ownership + dependency direction + change isolation
```

## Application Shape

```text
src/app/
  app.*                 application root and composition
  layout/               stable frame: shell, header, primary navigation
  core/                 app-wide infrastructure and configuration
  shared/               reusable UI/directives without business knowledge
  features/             routed business capabilities
```

## Runtime Composition

```text
App
  -> AppShell
      -> Header
      -> RouterOutlet
          -> CasesPage
          -> CaseDetailPage
          -> CreateCasePage
          -> ReviewQueuePage
```

`App` owns the application root. `AppShell` owns the stable screen frame.
`RouterOutlet` is the placeholder where Angular renders the page that matches
the current browser URL.

## Ownership Rules

| Area        | Owns                                        | Does not own                  |
| ----------- | ------------------------------------------- | ----------------------------- |
| `app.*`     | bootstrap, routes, app-wide providers       | feature business logic        |
| `layout/`   | shell, header, top navigation               | feature state                 |
| `core/`     | config tokens, app-wide services            | case-specific UI              |
| `shared/`   | generic tabs, reusable directives           | reconciliation business rules |
| `features/` | routed pages, feature models, feature state | global infrastructure         |

## Dependency Direction

If file `A` imports file `B`, then `A` depends on `B`.

Allowed direction:

```text
app root ---> layout
app root ---> features
layout -----> shared
features ---> shared
features ---> core
```

Blocked direction:

```text
shared -X-> features
core ---X-> features
feature A -X-> feature B internals
```

This keeps reusable and infrastructure code independent from business screens.

## Feature Structure

A feature starts small:

```text
features/cases/
  cases-page.ts
  cases-page.css
```

Subfolders appear only when there is real responsibility:

```text
features/cases/
  model/        typed business data
  data-access/  HTTP/resource boundary
  ui/           case-specific presentation components
  guards/       route protection for this feature
```

This avoids fake enterprise complexity while still showing professional
separation of concerns.

## State Strategy

The project uses different state levels intentionally:

| State type            | Location            | Example                            |
| --------------------- | ------------------- | ---------------------------------- |
| Local component state | component file      | search query, local form model     |
| Derived state         | `computed()`        | metrics, filtered lists            |
| Remote resource state | data-access service | `httpResource` loading/error/value |
| Workflow state        | SignalStore         | review queue approval and rollback |
| Application config    | core token          | `RECON_CONSOLE_CONFIG`             |

## Testing Strategy

Tests are placed near the behavior they protect:

```text
*.spec.ts beside component/service/store
```

The suite covers:

- routing behavior
- HTTP resource states
- Signal Forms validation
- component communication
- shared directives and tabs
- SignalStore optimistic update and rollback
- deferred rendering behavior

## Portfolio Value

This architecture demonstrates that the project is not only a UI exercise. It
shows that Angular concepts are connected to maintainability:

```text
clear boundaries
  -> safer changes
    -> easier tests
      -> better production confidence
```
