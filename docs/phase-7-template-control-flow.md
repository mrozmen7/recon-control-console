# Phase 7 - Template Control Flow

## Purpose

This phase renders operational case data with Angular's built-in template
control flow. The template declares what should exist for each state while
Angular owns DOM creation, reuse, and removal.

```text
cases + searchQuery
        |
        v
  filteredCases
        |
        +-- empty --> @if empty state
        |
        `-- values -> @for case cards
                         |
                         `-- @switch status view
```

## `@if`

`@if` conditionally creates a template block. An `@else` block handles the
opposite state.

The cases page uses it to choose between the result grid and a useful empty
state. The case card also uses it to show SLA information only when relevant.

Unlike CSS hiding, a false `@if` branch is not kept as hidden DOM. Angular
removes that branch and creates the selected branch.

## `@for`

`@for` creates one `ReconciliationCaseCard` instance for every item returned
by `filteredCases`.

```text
filteredCases[0] -> card instance for CASE-1001
filteredCases[1] -> card instance for CASE-1002
```

The `track reconciliationCase.id` expression gives Angular stable business
identity. When the array changes, Angular can preserve unchanged component
instances and update only added, removed, moved, or changed entries.

Array position is not used as identity because filtering and server responses
can change positions while the underlying case remains the same.

## `@switch`

`@switch` selects exactly one status presentation:

```text
OPEN       -> Open badge
IN_REVIEW  -> In review badge
RESOLVED   -> Resolved badge
other      -> Unknown fallback
```

This keeps mutually exclusive UI variants together and is clearer than a long
series of unrelated conditions.

## State Ownership

`CasesPage` owns the case collection, committed query, and filtering rule.
`ReconciliationCaseCard` receives one typed case with a required signal input
and owns only its presentation.

```text
CasesPage.filteredCases
  -> @for
    -> ReconciliationCaseCard.reconciliationCase input
```

This prevents a presentation component from reaching into page state or
duplicating feature filtering rules.

## Terms

- **Control flow:** Rules deciding which template blocks run.
- **Branch:** One possible template path selected by a condition.
- **Iteration:** Repeating a block for collection items.
- **Identity:** The stable key connecting data to a rendered component instance.
- **Empty state:** Purposeful UI shown when a collection contains no displayable items.
- **Declarative UI:** Describing the desired result for state instead of manually editing DOM nodes.

## Verification

- The initial state renders four case cards.
- A committed search renders only matching cards.
- A missing query renders the empty branch.
- Status values select the correct badge branch.
- Unit tests and the production build verify the integrated control-flow graph.
