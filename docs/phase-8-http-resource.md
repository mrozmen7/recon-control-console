# Phase 8 - Declarative Data Fetching With `httpResource`

## Purpose

This phase moves case data out of the page component and behind a feature
data-access boundary. Angular owns the GET request lifecycle and exposes its
value and request state as signals.

```text
app.config
  -> provideHttpClient
    -> CasesService
      -> httpResource
        -> GET /mock-data/reconciliation-cases.json
          -> loading | error | empty | success
            -> CasesPage
```

The browser still uses controlled mock data, but it now crosses a real HTTP
boundary. A future Spring Boot endpoint can replace the URL without moving
request ownership back into the component.

## HTTP Infrastructure

`provideHttpClient()` registers Angular's HTTP dependencies in the application
injector. It does not send a request by itself. It makes `HttpClient`-based APIs
available to injected services and resources.

Application-wide technical configuration belongs in `app.config.ts` because it
is required before routed features are created.

## Feature Data Access

`CasesService` lives under `features/cases/data-access/` because it owns data
access for the cases capability.

```text
CasesPage ------> CasesService ------> HTTP endpoint
consumer          adapter              external boundary
```

The service is provided at root scope so the current application shares one
resource instance. A narrower route-level provider can be introduced later if
the required lifetime changes.

At the project's Angular 21 version, `httpResource` is still marked as an
experimental API. Keeping it inside the data-access boundary limits the impact
of future framework API changes.

## Resource State

The resource is more than a value container:

| Resource signal | Meaning                       | UI result                    |
| --------------- | ----------------------------- | ---------------------------- |
| `isLoading()`   | A request is active           | Loading panel                |
| `error()`       | The latest request failed     | Error panel and retry action |
| `value()`       | The latest successful payload | Metrics and case register    |
| `reload()`      | Run the request again         | Retry workflow               |

The template checks loading and error before reading case-derived values. This
prevents computed metrics from reading a resource while it is in an error
state.

```text
isLoading() -> loading branch
error()     -> error branch
otherwise   -> value-dependent branch
```

## Empty States

Two empty states represent different business facts:

```text
cases().length === 0
  -> the endpoint returned no operational cases

cases().length > 0 && filteredCases().length === 0
  -> cases exist, but none match the committed search
```

Keeping these messages separate prevents the interface from presenting a
search problem as an operational-data problem.

## Read And Mutation Boundaries

`httpResource` owns the declarative GET flow in this phase. The existing
register and review actions update the resource value locally so signal
recomputation remains observable during the course.

These local updates are not persisted. A browser reload restores the endpoint
payload. Later mutation phases will use explicit HTTP commands and enterprise
state management for persistence, optimistic updates, and rollback.

## Testing Strategy

The test suite separates responsibilities:

```text
CasesService spec
  -> provideHttpClientTesting
  -> HttpTestingController
  -> request method, payload, empty response, error, reload

CasesPage spec
  -> controlled fake resource signals
  -> loading, error, empty, success, search, and local actions

App spec
  -> fake CasesService
  -> routing behavior without an accidental network request
```

`HttpTestingController` intercepts requests in memory. Tests never require the
development server or the future Spring Boot backend.

## Terms

- **Data-access boundary:** The feature area responsible for external data communication.
- **Declarative fetching:** Describing the request and consuming its state instead of manually coordinating subscriptions.
- **Provider:** Injector configuration that explains how Angular creates or obtains a dependency.
- **Resource:** A signal-aware representation of an asynchronous value and its lifecycle.
- **Payload:** Data carried by an HTTP request or response.
- **Retry:** Repeating a failed operation without rebuilding the component.
- **Deterministic test:** A test whose result does not depend on network availability or timing.
- **Adapter:** Code translating an external interface into a form the application consumes.

## Verification

- The mock endpoint responds with four typed reconciliation cases.
- The page derives `2` open, `1` in-review, and `1` SLA-risk case.
- Loading, error, API-empty, search-empty, and success views are distinct.
- Retry invokes `casesResource.reload()`.
- Service tests prove GET, empty response, HTTP error, and successful reload.
- Component tests prove every visible resource branch.
- The production build and complete Vitest suite pass.
