# Phase 12 - SignalStore, RxJS, Performance, And Testing

## Purpose

This phase moves review queue state out of the component and into an NgRx
SignalStore. The store owns queue state, computed views, async approval work,
optimistic updates, rollback behavior, and testable state transitions.

```text
button click
  -> ReviewQueuePage
    -> ReviewQueueStore.approveCase(caseId)
      -> rxMethod
        -> exhaustMap
          -> optimistic patchState
            -> ReviewQueueApiService
              -> success: keep optimistic state
              -> error: rollback previous state
```

## Why SignalStore

Component-local signals are useful for small UI state. Review queue actions are
feature state because they include:

- a list of cases
- derived ready/escalated/resolved views
- async approval lifecycle
- optimistic state
- rollback behavior
- error messages
- tests that should run without rendering the whole page

`ReviewQueuePage` now displays state and forwards user intent. The store owns
state transitions.

## Store Shape

```text
ReviewQueueState
  cases
  actionInFlightCaseId
  error
  failNextApproval
  lastRollbackCaseId
```

`cases` is the source of truth. `readyCases`, `escalatedCases`, and
`resolvedCases` are computed from it instead of being stored separately.

## SignalStore Building Blocks

```text
withState
  -> store memory

withComputed
  -> derived values from state

withMethods
  -> actions that mutate state or run async work

patchState
  -> controlled state update
```

The store is provided by `ReviewQueuePage`, so its lifetime is scoped to the
routed feature page.

## `rxMethod`

`rxMethod` connects a store method to an RxJS pipeline.

```text
store.approveCase('CASE-1005')
  -> value enters RxJS pipeline
  -> async approval flow starts
```

The component does not subscribe to HTTP work or manage loading/error state.

## `exhaustMap`

`exhaustMap` ignores new approval requests while one approval is still running.

```text
click 1 -> accepted
click 2 -> ignored while click 1 is running
click 3 -> ignored while click 1 is running
```

This is appropriate for state-changing actions where double submit should not
create duplicate backend work.

## Optimistic Update

The store moves the case to `APPROVED` immediately before the API response
arrives.

```text
previousCases = store.cases()
patchState(cases: approved version)
api.approveCase(caseId)
```

The UI feels fast because it reacts to the local state change immediately.

## Rollback

If the API rejects the approval, the store restores the previous case array.

```text
api error
  -> patchState(cases: previousCases)
  -> error message
  -> lastRollbackCaseId
```

Rollback is the safety mechanism that makes optimistic UI acceptable for
business workflows.

## API Boundary

`ReviewQueueApiService` simulates a backend call with an Observable. It can
also simulate a failure for the next approval so the rollback path can be
demonstrated in the UI and tests.

The store depends on the API boundary, not on DOM behavior.

## Performance And `@defer`

The audit panel is moved to a standalone component and rendered through
`@defer`.

```text
Review queue primary content
  -> render immediately

Audit panel
  -> defer until viewport
  -> separate lazy chunk in production build
```

The build emits a dedicated `review-audit-panel` lazy chunk, proving that the
audit UI is separated from the primary route work.

## Testing Strategy

Store tests verify state transitions without rendering the page:

- optimistic move to resolved
- successful approval clears in-flight state
- failed approval rolls back state
- `exhaustMap` ignores a second approval during the first one
- simulated failure is passed to the API boundary

Component tests verify integration:

- store-derived counts render
- projected tabs still switch panels
- approval updates the UI optimistically
- rollback alert appears after simulated failure
- deferred audit placeholder renders before the panel enters the viewport

## Terms

- **Store:** A feature state container.
- **SignalStore:** NgRx store model built on Angular Signals.
- **State:** The current application memory for a feature.
- **Computed state:** Values derived from source state.
- **`rxMethod`:** A store method backed by an RxJS pipeline.
- **Observable:** A stream of values over time.
- **Pipeline:** A sequence of RxJS operators.
- **`exhaustMap`:** Ignores new source values while the current inner Observable is active.
- **Optimistic update:** Updating UI before the backend confirms success.
- **Rollback:** Restoring previous state when an optimistic operation fails.
- **`patchState`:** Controlled SignalStore state update.
- **Concurrency:** How overlapping async actions are handled.
- **`@defer`:** Angular template block that lazy-loads non-critical UI.
- **Placeholder:** Lightweight UI shown before a deferred block renders.

## Verification

- `npm test -- --watch=false` passes.
- `npm run build` passes.
- Production build emits a `review-audit-panel` lazy chunk.
