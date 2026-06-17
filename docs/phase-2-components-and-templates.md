# Phase 2 - Components And Templates

## Goal

Phase 2 turns the generated Angular starter into an application structure.

The main learning goal is to understand how Angular screens are built from focused components and templates.

## Why This Matters

In real Angular projects, the root component should not carry the whole UI.

The root component should usually stay small and delegate layout or feature work to child components.

This makes the app:

- easier to read
- easier to test
- easier to change
- easier to grow into feature modules or lazy route boundaries later

## New Terms

### Component Composition

Component composition means building a screen by combining smaller components.

Example:

```text
App
  AppShell
    Header
    Main content
```

Each component owns one clear responsibility.

### Container Component

A container component controls a larger area of the screen.

In this phase, `AppShell` is a container component because it owns the application layout.

### Presentational Component

A presentational component focuses on display.

In this phase, `Header` is mostly presentational. It shows the product name, navigation labels, and project phase.

Later, components such as `CaseCard` and `StatusBadge` will also be presentational.

### Interpolation

Interpolation prints a value in the template.

```html
<h1>{{ title() }}</h1>
```

In this project, `title` is a signal, so it is read with `title()`.

### Property Binding

Property binding passes a value into an HTML property or a component input.

```html
<section [attr.aria-labelledby]="headingId">
```

We will use property binding more heavily when feature components start receiving inputs.

### Event Binding

Event binding listens to user actions.

```html
<button (click)="refresh()">Refresh</button>
```

This phase does not need much event handling yet. Later phases will use it for case actions.

### CSS Encapsulation

Angular component styles are scoped to their component by default.

That means styles in `header.css` affect the header component, not the whole app.

Global styles belong in `src/styles.css`.

## Implementation Plan

This phase introduces:

- `AppShell`
- `Header`

The root `App` component becomes small:

```text
App -> AppShell -> Header + page content
```

## File Direction

```text
src/app/
  app.ts
  app.html
  layout/
    app-shell.ts
    app-shell.css
    header.ts
    header.css
```

This is intentionally modest. We are not creating the full `core/shared/features` structure yet because the next learning step is component fundamentals.

## Portfolio Note

This phase is not just UI cleanup.

It demonstrates that the project is being built deliberately:

- root component stays thin
- layout responsibility is isolated
- display responsibility is isolated
- professional UI direction starts early

## Done Criteria

Phase 2 is complete when:

- `App` delegates layout to `AppShell`
- `Header` renders as a separate component
- the app still builds
- the tests still pass
- the browser renders the new shell
- README and docs reference the learning step

