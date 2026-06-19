# Phase 5 - Signals Basics

## Purpose

This phase introduces local reactive state with Angular Signals and connects it
to a reconciliation operations scenario. One typed case list is the source of
truth for all dashboard metrics.

## Sector Model

```text
ReconciliationCase
  id                -> internal case identity
  reference         -> financial transaction reference
  status            -> OPEN | IN_REVIEW | RESOLVED
  slaHoursRemaining -> time left before the operational deadline
```

The model belongs to `features/cases/model/` because it represents a cases
domain concept rather than application-wide infrastructure or generic UI.

## Reactive State Graph

```text
cases: WritableSignal<ReconciliationCase[]>
                  |
                  +----> openCaseCount: computed
                  +----> reviewQueueCount: computed
                  +----> slaAtRiskCount: computed
                                      |
                                      v
                                   Template
```

`cases` is source state. The three metrics are derived state and cannot be
changed directly.

## Signal APIs

### `signal()`

Creates writable reactive state:

```ts
const cases = signal<ReconciliationCase[]>(initialCases);
```

The value is read by calling the Signal:

```ts
cases();
```

### `set()`

Replaces a writable Signal value directly:

```ts
count.set(0);
```

### `update()`

Produces a new value from the current value:

```ts
cases.update((currentCases) => [...currentCases, newCase]);
```

### `computed()`

Creates read-only state from other Signals:

```ts
const openCaseCount = computed(
  () => cases().filter((reconciliationCase) => reconciliationCase.status === 'OPEN').length,
);
```

## Trigger Lifecycle

```text
User command
    |
    v
cases.update()
    |
    v
New array reference
    |
    v
Dependent computed Signals are invalidated
    |
    v
Template reads the computed values
    |
    v
Dirty computations run and cache their results
    |
    v
Changed DOM values are rendered
```

Computed Signals are lazy and memoized. They run when read, cache their result,
and are invalidated when a Signal read during the computation changes.

## Equality And References

Signals use equality to decide whether a value changed. Array and object state
must be updated with new references:

```ts
return [...currentCases, newCase];
```

Direct mutation does not pass through the Signal update mechanism:

```ts
currentCases.push(newCase); // Avoid for Signal state.
```

## Immutable Status Transition

Moving a case from `OPEN` to `IN_REVIEW` creates both a new case object and a
new array:

```text
OPEN case
    |
    v
New case object with IN_REVIEW status
    |
    v
New cases array
    |
    +----> open count decreases
    +----> review count increases
    +----> SLA rule is reevaluated
```

The guard clause returns the existing array when no open case exists. Because
the reference remains the same, no new state transition is emitted.

## Terms

- **State:** Data that determines current UI or application behavior.
- **Source of truth:** The single authoritative state for a piece of data.
- **Derived state:** A result calculated from source state.
- **Producer:** A Signal that provides a reactive value.
- **Consumer:** A template or computation that reads a Signal.
- **Dependency:** A Signal read while a reactive consumer executes.
- **Lazy:** Evaluated only when the value is requested.
- **Memoized:** The last computed result is cached and reused.
- **Invalidation:** Marking a cached result as potentially outdated.
- **Immutable update:** Producing new references without mutating existing state.

## Verification

- Initial metrics are derived as `2` open, `1` in review, and `1` at SLA risk.
- Registering an incoming case updates the open metric to `3`.
- Moving a case to review updates open and review metrics in opposite directions.
- Repeating the transition when no open case remains leaves the state unchanged.
- Component tests verify behavior through user commands and rendered DOM values.
