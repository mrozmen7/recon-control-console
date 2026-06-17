# Recon Control Console - Learning Roadmap

## Main Objective

Build a professional Angular reference project while learning the full course content step by step.

The project follows the course sequence, but each concept is implemented in the Recon Control Console domain.

## Phase 0 - Project Brief And Roadmap

Goal:

Define what the project is, what it is not, and how the course topics map to the portfolio project.

Outputs:

- project brief
- learning roadmap
- Angular foundation glossary
- first README skeleton
- initial git repository

Angular focus:

- no Angular code yet
- project thinking
- architecture boundaries
- portfolio direction

Suggested commit:

```bash
docs: define recon control console learning roadmap
```

## Phase 1 - Angular Scaffold And App Shell

Goal:

Create the Angular app and understand how Angular starts.

Topics:

- Angular CLI
- package.json
- angular.json
- main.ts
- app.config.ts
- app.routes.ts
- standalone components
- application bootstrap
- component, template, selector, router, service, and dependency injection terminology

Project features:

- app shell
- base layout
- first routes
- empty pages

Suggested commit:

```bash
feat: scaffold recon control console angular app
```

## Phase 2 - Professional UI Foundation

Goal:

Build a clean dashboard foundation before adding business behavior.

Topics:

- component composition
- layout structure
- reusable UI primitives
- loading, error, and empty state patterns
- responsive design basics

Project features:

- header or sidebar
- dashboard layout
- cards
- badges
- buttons
- page containers

Suggested commit:

```bash
feat: build professional dashboard shell and ui primitives
```

## Phase 3 - Signal-Based Component Model

Goal:

Learn Angular's modern component model using Signals.

Topics:

- input()
- output()
- model()
- computed()
- linkedSignal()
- template signal reads
- @if
- @for
- @let

Project features:

- CaseCard
- CaseSearch
- parent-child communication
- computed SLA or risk label
- local favorite/watch state

Suggested commit:

```bash
feat: implement signal based case components
```

## Phase 4 - Declarative Data Fetching

Goal:

Load backend data declaratively with signal-aware APIs.

Topics:

- HttpClient
- httpResource
- loading state
- error state
- value guards
- read vs mutation flows

Project features:

- CasesService
- mock API
- case list loading
- search-driven refetch
- archive/delete mutation

Suggested commit:

```bash
feat: add declarative case data fetching with httpResource
```

## Phase 5 - Modern Routing

Goal:

Use modern Angular routing patterns.

Topics:

- Routes
- RouterLink
- route params
- withComponentInputBinding()
- input.required()
- functional guards
- view transitions

Project features:

- /cases
- /cases/:id
- /cases/new
- reviewer/admin guard simulation

Suggested commit:

```bash
feat: add modern routing and case detail flow
```

## Phase 6 - Signal Forms

Goal:

Build a real form using the new Signal Forms API.

Topics:

- form model
- form schema
- required validation
- minLength validation
- debounce
- conditional disable
- dynamic arrays
- submit flow

Project features:

- CreateCase page
- related transaction fields
- validation messages
- API create request
- navigation after submit

Suggested commit:

```bash
feat: build signal forms based create case flow
```

## Phase 7 - Dependency Injection And Shared UI Patterns

Goal:

Apply enterprise-aware Angular architecture without over-engineering.

Topics:

- inject()
- InjectionToken
- factory providers
- core/shared/features boundaries
- content projection
- contentChildren()
- hierarchical DI
- host directives

Project features:

- API_URL and derived endpoint tokens
- UiCard
- TabGroup and Tab
- click logger directive
- scoped tab state

Suggested commit:

```bash
feat: add advanced dependency injection and shared ui patterns
```

## Phase 8 - Rendering And Performance

Goal:

Make the app more production-aware.

Topics:

- zoneless Angular
- SSR
- hydration
- incremental hydration
- @defer
- NgOptimizedImage
- performance thinking

Project features:

- deferred audit/timeline panel
- optimized visual assets
- SSR build verification

Suggested commit:

```bash
feat: enable ssr hydration and performance optimizations
```

## Phase 9 - RxJS Concurrency And Error Patterns

Goal:

Understand safe async action handling for real business workflows.

Topics:

- Observable basics
- mergeMap
- switchMap
- concatMap
- exhaustMap
- inner catchError
- double-submit prevention

Project features:

- approve/review action playground
- duplicate action prevention
- resilient error handling

Suggested commit:

```bash
feat: demonstrate rxjs concurrency for review actions
```

## Phase 10 - Enterprise State With SignalStore

Goal:

Move global review state into a structured store.

Topics:

- @ngrx/signals
- signalStore
- withState
- withComputed
- withMethods
- rxMethod
- optimistic update
- rollback
- reusable request status feature

Project features:

- ReviewQueueStore
- queue count
- add/remove case
- approve with optimistic update
- rollback on error

Suggested commit:

```bash
feat: implement review queue with ngrx signal store
```

## Phase 11 - Testing

Goal:

Add focused tests that prove the important behavior works.

Topics:

- Vitest
- Angular TestBed
- component tests
- SignalStore tests
- HTTP mocking
- component harness
- @defer testing

Project features:

- CaseCard tests
- ReviewQueueStore tests
- CaseDetail tests
- harness example

Suggested commit:

```bash
test: add vitest coverage for signals store and components
```

## Phase 12 - Spring Boot Integration Readiness

Goal:

Prepare the frontend for a future backend integration.

Topics:

- API contracts
- DTO mapping
- environment configuration
- error model
- auth-readiness
- gateway-readiness

Project features:

- documented case API contract
- mock data aligned with future backend shape
- integration notes

Suggested commit:

```bash
docs: document spring boot integration contract
```

## Phase 13 - Portfolio Polish

Goal:

Make the project presentable on GitHub and LinkedIn.

Outputs:

- polished README
- screenshots
- architecture section
- Angular concept map
- setup instructions
- learning notes
- LinkedIn post draft

Suggested commit:

```bash
docs: finalize portfolio readme and project presentation
```
