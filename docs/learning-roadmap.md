# Recon Control Console - Learning Roadmap

## Main Objective

Build a professional Angular reference project while learning the complete
Intermediate Angular: Signals and Dependency Injection curriculum step by
step. The course concepts are implemented in an original reconciliation
operations domain rather than copying the course UI.

```text
Angular concept
  -> focused explanation
    -> Recon Control Console implementation
      -> automated verification
        -> phase documentation and commit
```

## Phase Sequence

| Phase | Topic                                                  | Status   |
| ----- | ------------------------------------------------------ | -------- |
| 0     | Project brief and roadmap                              | Complete |
| 1     | Angular scaffold and foundation                        | Complete |
| 2     | Components and templates                               | Complete |
| 3     | Routing basics                                         | Complete |
| 4     | Enterprise-aware architecture                          | Complete |
| 5     | Signals basics                                         | Complete |
| 6     | Signal component model                                 | Complete |
| 7     | Template control flow                                  | Complete |
| 8     | Declarative data fetching with `httpResource`          | Complete |
| 9     | Advanced routing                                       | Complete |
| 10    | Signal Forms                                           | Complete |
| 11    | Dependency Injection and shared UI patterns            | Complete |
| 12    | RxJS, SignalStore, rendering, performance, and testing | Next     |
| 13    | Portfolio polish                                       | Planned  |

## Phase 0 - Project Brief

Define the product boundary, learning objective, original domain, portfolio
direction, and phased delivery process.

## Phase 1 - Angular Scaffold And Foundation

Create the standalone Angular application and understand CLI scaffolding,
bootstrap, application configuration, TypeScript files, and Git setup.

## Phase 2 - Components And Templates

Build the application shell and learn component metadata, selectors,
composition, templates, styles, property binding, and event binding.

## Phase 3 - Routing Basics

Connect browser URLs to routed feature pages with `Routes`, `RouterLink`,
`RouterLinkActive`, redirects, wildcard handling, and `RouterOutlet`.

## Phase 4 - Enterprise-Aware Architecture

Define ownership, boundaries, and dependency direction for app root, layout,
features, future core infrastructure, and future shared building blocks.

## Phase 5 - Signals Basics

Model typed case state with writable signals, immutable updates, and computed
operational metrics.

## Phase 6 - Signal Component Model

Build parent-child communication with `input()`, `output()`, `model()`,
`computed()`, and `linkedSignal()`.

## Phase 7 - Template Control Flow

Render filtered collections, stable item identity, empty branches, and status
variants with `@if`, `@for`, and `@switch`.

## Phase 8 - Declarative Data Fetching

Move case reads into `CasesService`, configure `provideHttpClient()`, load mock
API data with `httpResource`, represent request states, and test the HTTP
boundary with `HttpTestingController`.

## Phase 9 - Advanced Routing

Add case detail routing, route parameters as component inputs,
`withComponentInputBinding()`, functional guards, lazy loading, and view
transitions.

## Phase 10 - Signal Forms

Build case creation with the Signal Forms API, typed form models, validation,
debounce, conditional disable rules, submission, and local draft registration.

## Phase 11 - Dependency Injection And Shared Patterns

Introduce `InjectionToken`, root and scoped providers, shared directives, host
directives, content projection, `contentChildren()`, tabs, and
domain-independent shared UI only when concrete reuse exists.

## Phase 12 - Enterprise State, Async Work, Performance, And Testing

Apply RxJS concurrency, NgRx SignalStore, `rxMethod`, optimistic updates,
rollback, SSR, hydration, incremental hydration, `@defer`, `NgOptimizedImage`,
store tests, component tests, and harness patterns.

## Phase 13 - Portfolio Polish

Finalize README content, architecture diagrams, screenshots, setup guidance,
learning references, Git history, and LinkedIn presentation material.

## Delivery Rule

Each phase ends only when its behavior is explained, implemented, tested,
documented, built successfully, and recorded in Git. Domain complexity remains
limited to what is required to teach the Angular concept.
