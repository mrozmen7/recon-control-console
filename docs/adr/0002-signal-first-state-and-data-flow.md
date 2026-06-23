# ADR 0002 - Signal-First State And Data Flow

## Status

Accepted

## Context

The learning objective is centered on modern Angular Signals and Dependency
Injection. The project needs to show how state changes flow through components,
services, forms, and stores.

## Decision

Use a signal-first model:

```text
component state      -> signal()
derived values       -> computed()
component API        -> input(), output(), model()
remote data          -> httpResource
form state           -> Signal Forms
workflow state       -> NgRx SignalStore
async store methods  -> rxMethod + RxJS
```

## Consequences

Positive:

- state reads are explicit in templates
- derived values are colocated with the data they depend on
- HTTP request states are declarative
- forms are typed and state-driven
- workflow state can be tested separately from the UI

Tradeoff:

- the project uses modern Angular APIs that may be unfamiliar to developers
  who only know older NgModule or Observable-heavy patterns

The tradeoff is acceptable because the project is intentionally a modern
Angular reference.
