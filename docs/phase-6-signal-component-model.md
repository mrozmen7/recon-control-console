# Phase 6 - Signal Component Model

## Purpose

This phase turns the cases screen from one large page component into a small
component system with explicit communication contracts.

```text
CasesPage
  |-- input data ------> CaseMetricCard
  |<-- output events --- CaseWorkflowActions
  `-- two-way model <--> CaseSearch
```

The page remains the owner of case state and business calculations. Child
components own focused presentation and interaction responsibilities.

## Component Responsibilities

| Component             | Responsibility                                                        |
| --------------------- | --------------------------------------------------------------------- |
| `CasesPage`           | Owns case state, search state, mutations, and business-derived counts |
| `CaseMetricCard`      | Renders a metric received through required signal inputs              |
| `CaseWorkflowActions` | Emits user intent without mutating business state                     |
| `CaseSearch`          | Manages an editable search draft and a shared committed query         |

## Signal Inputs

`CaseMetricCard` declares required values with `input.required<T>()`:

```text
CasesPage.reviewQueueCount() ---> CaseMetricCard.value()
CasesPage.slaAtRiskCount() -----> CaseMetricCard.value()
```

Each component instance receives independent input values while reusing the
same template and styles.

## Signal Outputs

`CaseWorkflowActions` reports user intent with `output<void>()`:

```text
button click
  -> registerRequested.emit()
  -> CasesPage.registerIncomingCase()
  -> cases.update(...)
```

The child does not own or mutate case state. This keeps one source of truth and
makes the workflow easier to test.

## Model Binding

`CaseSearch.query` uses `model('')`. The parent connects a writable Signal with
two-way binding:

```html
<app-case-search [(query)]="searchQuery" />
```

Conceptually, this combines an input and an output:

```text
[query]="searchQuery()"
(queryChange)="searchQuery.set($event)"
```

## Computed Dependencies

The parent calculates `matchingCaseCount` from two source Signals:

```text
cases ---------\
                -> matchingCaseCount -> resultCount input
searchQuery ----/
```

The child derives a grammatically correct result summary from `query` and
`resultCount`. Business filtering stays in the feature page; display wording
stays in the UI component.

## Linked Editable State

`CaseSearch` separates the text currently being edited from the committed
query:

```text
query model --------> draftQuery linkedSignal
                         |
user types ------------>|
                         |
Search submit <----------'
  -> query.set(...)
```

`draftQuery` can be edited locally. When the source `query` changes,
`linkedSignal` reconnects the draft to that value. This pattern is useful when
editing should not trigger filtering or an API request on every keystroke.

## Binding Terms

- **Property binding:** `[value]` sends component state to a DOM property or child input.
- **Event binding:** `(input)` or `(click)` runs component code after an event.
- **Two-way binding:** `[(query)]` combines value input and change output.
- **Component contract:** The inputs, outputs, and models exposed by a component.
- **Draft state:** Editable local state that has not yet been committed.
- **Committed state:** The value currently applied to business logic.

## Verification

- Component tests prove input rendering and output-driven state transitions.
- Search tests prove draft isolation, model commit, computed result updates, and clear behavior.
- Production build and browser checks verify the integrated component graph.
