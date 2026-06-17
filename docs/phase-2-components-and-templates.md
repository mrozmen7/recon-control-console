# Phase 2 - Components And Templates

## Topic

Angular component composition.

## What Changed

The root `App` component now delegates the page layout to `AppShell`.

```text
App
  -> AppShell
      -> Header
      -> RouterOutlet
```

## Why It Matters

The root component should stay small. Real Angular applications usually move layout responsibilities into shell or layout components.

This keeps the app easier to read, test, and grow.

## Angular Concepts

- `@Component`
- `selector`
- template interpolation
- component imports
- signal input with `input()`
- parent-to-child data binding
- `RouterOutlet`

## Files

```text
src/app/app.ts
src/app/app.html
src/app/app.css
src/app/app.spec.ts
src/app/layout/app-shell.ts
src/app/layout/app-shell.css
src/app/layout/header.ts
src/app/layout/header.css
```

## Key Code Idea

`AppShell` owns the layout title:

```ts
protected readonly title = signal('Recon Control Console');
```

It passes that value into `Header`:

```html
<app-header [title]="title()" />
```

`Header` receives it as a required signal input:

```ts
readonly title = input.required<string>();
```

This pattern will later be reused by `CaseCard`, `CaseSearch`, and other feature components.

