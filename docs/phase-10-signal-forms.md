# Phase 10 - Signal Forms

## Purpose

This phase turns the case creation route into a real intake workflow using
Angular Signal Forms. The form keeps its source data in a writable signal,
derives field state through a `FieldTree`, validates operational rules, and
submits a local case draft.

```text
user input
  -> [formField]
    -> field value signal
      -> form model signal
        -> validation signals
          -> UI state
            -> submit action
```

## Source Of Truth

The form starts with one typed model signal:

```text
caseModel
  reference
  owner
  priority
  slaHoursRemaining
  description
  requiresManagerReview
```

`caseModel` is the source of truth. Signal Forms does not create a separate
copy of the data. When a user changes an input, the related field updates the
same model signal.

## Field Tree

`form(caseModel, schema, options)` creates `caseForm`, a `FieldTree` that
mirrors the model shape:

```text
caseForm
  reference()
  owner()
  priority()
  slaHoursRemaining()
  description()
  requiresManagerReview()
```

Each field exposes state as signals:

```text
value()
valid()
invalid()
touched()
dirty()
errors()
disabled()
submitting()
```

The template binds fields to native controls with `[formField]`:

```text
caseForm.reference -> input
caseForm.priority  -> select
caseForm.description -> textarea
```

## Validation Rules

The schema defines business rules close to the form model:

| Field                   | Rule                                                 |
| ----------------------- | ---------------------------------------------------- |
| `reference`             | required, debounced, must match `TXN-2026-005` style |
| `owner`                 | required, at least 3 characters                      |
| `slaHoursRemaining`     | between 1 and 72                                     |
| `description`           | required, at least 12 characters                     |
| `requiresManagerReview` | required only for critical cases                     |

Validation is reactive. When an input changes, Angular recomputes the related
field state and any UI reading that state updates.

## Debounce

The reference field uses debounce:

```text
typing TXN-2026-005
  -> immediate control value
  -> short wait
  -> committed field value
  -> validation recalculates
```

Debounce is useful when a field may later trigger expensive work such as
checking whether a transaction reference already exists.

## Conditional Disable

Manager review is available only for critical priority cases:

```text
priority !== CRITICAL
  -> manager review checkbox disabled

priority === CRITICAL
  -> manager review checkbox enabled
  -> unchecked checkbox becomes validation error
```

This is a real workflow rule. The UI prevents irrelevant input, and the schema
still validates the critical case requirement.

## Submission

The `<form [formRoot]="caseForm">` directive wires native form submission to
the Signal Forms submit lifecycle.

```text
submit
  -> prevent native browser submission
  -> validate field tree
  -> if invalid: set submitted state and show errors
  -> if valid: create local case draft
  -> reset form model
```

This phase stores created cases locally in the page. When the backend phase
arrives, the submit action can become an HTTP `POST` without changing the form
boundary.

## UI States

The page now shows:

- validation errors after submit, touch, or dirty field state
- live draft preview derived from the form model
- manager-review enablement driven by priority
- successful local case registration
- session-created case list

## Testing Strategy

The component tests cover:

- invalid empty submission
- valid local case creation
- conditional manager review disabled state
- critical-case manager review validation

The tests interact with the DOM the same way a user would: input events,
select changes, checkbox clicks, and form submit events.

## Terms

- **Signal Form:** Angular form system that exposes form state through signals.
- **Form model:** The typed object that represents the form's data.
- **Source of truth:** The single data structure treated as the real current state.
- **FieldTree:** The form-shaped object created by `form()` from the model signal.
- **FieldState:** The reactive state of one field, such as value, errors, dirty, and touched.
- **Schema:** The place where validation and field logic rules are defined.
- **Validation:** Rules that decide whether submitted data is acceptable.
- **Debounce:** Waiting briefly before committing rapid input changes.
- **Conditional disable:** Enabling or disabling a field based on another field's state.
- **Submit lifecycle:** The path from form submit to validation, action, and success or invalid state.

## Verification

- `npm test -- --watch=false` passes.
- `npm run build` passes.
