# Phase 1 - Angular Foundation And App Shell

## Goal

Phase 1 is where the Angular application starts to exist.

Before writing real features, we need to understand what Angular creates, how the app starts, and what the main building blocks mean.

This phase answers:

- What is an Angular application?
- What is a component?
- What files does Angular generate?
- How does routing work?
- Where do core, shared, and features fit later?

## Big Picture

An Angular app is a client-side application made of components.

The browser loads the app, Angular bootstraps a root component, and then the router decides which screen should be displayed.

In simple terms:

```text
Browser opens index.html
        |
        v
main.ts starts Angular
        |
        v
Angular bootstraps App component
        |
        v
Router renders the current page
        |
        v
Components display data and handle interaction
```

## Important Angular Terms

### Component

A component is a reusable UI building block.

It usually contains:

- a TypeScript class for state and behavior
- a template for HTML
- optional styles
- metadata that tells Angular how to use it

Example idea:

```text
CaseCard component
  input: case data
  output: user clicked archive
  template: card UI
```

In real projects, components are used to split the UI into focused, understandable pieces.

Good component examples:

- AppShell
- CaseListPage
- CaseCard
- CaseSearch
- StatusBadge
- ReviewQueueButton

### Template

A template is the HTML view of a component.

It describes what the user sees.

Angular templates can also contain Angular syntax:

- property binding: `[title]="caseTitle"`
- event binding: `(click)="archiveCase()"`
- interpolation: `{{ case.reference }}`
- control flow: `@if`, `@for`, `@let`

### Selector

A selector is the custom HTML tag used to render a component.

Example:

```ts
@Component({
  selector: 'app-case-card',
})
```

Usage:

```html
<app-case-card />
```

In a company project, selectors help make the UI readable and composable.

### Standalone Component

A standalone component is a component that can declare its own imports directly.

Modern Angular uses standalone components by default.

This reduces the need for old-style NgModules in many apps.

### Root Component

The root component is the first component Angular starts.

In this project, it will be the main application shell.

It normally contains:

- global layout
- header/sidebar
- router outlet

### Router

The router decides which page component should be shown for a URL.

Example:

```text
/cases       -> Case list page
/cases/123   -> Case detail page
/cases/new   -> Create case page
```

### Router Outlet

`router-outlet` is the placeholder where Angular renders the current route's component.

Example:

```html
<router-outlet />
```

If the user opens `/cases/123`, the router can render `CaseDetailPage` inside this outlet.

### Service

A service is a class used for logic that should not live directly inside a component.

Common service responsibilities:

- API calls
- data fetching
- business operations
- reusable logic
- integration with browser APIs

In this project:

```text
CasesService -> loads reconciliation cases from the API
```

### Dependency Injection

Dependency Injection, or DI, is Angular's way of giving a class the dependencies it needs.

Instead of manually creating services, Angular provides them.

Example idea:

```ts
private readonly casesService = inject(CasesService);
```

This makes code easier to test, replace, and configure.

### Provider

A provider tells Angular how to create or supply a dependency.

Examples:

- provide an API base URL
- provide a service instance
- provide a custom configuration value

### Signal

A signal is Angular's modern reactive state primitive.

It stores a value and notifies Angular when that value changes.

Example idea:

```ts
searchQuery = signal('');
```

When `searchQuery` changes, the UI can update automatically.

### Input

An input is data passed from a parent component into a child component.

Modern Angular uses signal inputs:

```ts
case = input.required<ReconCase>();
```

Example:

```html
<app-case-card [case]="case" />
```

### Output

An output is an event sent from a child component back to its parent.

Example:

```ts
archive = output<string>();
```

Usage:

```html
<app-case-card (archive)="archiveCase($event)" />
```

### Model

`model()` is used for two-way binding with signals.

It is useful when parent and child need to share writable state.

Example use case:

```text
CaseSearch component updates the parent search query.
```

### Directive

A directive adds behavior to an existing element or component.

Example:

```text
ClickLogger directive logs analytics when a card is clicked.
```

Directives are useful when behavior should be reusable without creating a new visual component.

### Pipe

A pipe formats values in the template.

Examples:

- date formatting
- currency formatting
- title case

Example:

```html
{{ case.createdAt | date: 'mediumDate' }}
```

### Store

A store manages shared application state.

Not every state needs a store.

Rule for this project:

- local UI state -> signal()
- derived local state -> computed()
- server read state -> httpResource()
- shared cross-feature state -> SignalStore

## Files We Will Meet In Phase 1

### package.json

Defines project scripts and dependencies.

Examples:

- start the dev server
- build the app
- run tests
- install Angular packages

### angular.json

Angular workspace configuration.

It controls:

- build options
- assets
- styles
- test configuration
- SSR configuration later

### src/main.ts

The app entry point.

This file starts Angular in the browser.

### src/app/app.ts

The root app component.

It will hold the global layout and router outlet.

### src/app/app.config.ts

Application-level providers live here.

Examples:

- router configuration
- HTTP client
- zoneless change detection later
- hydration later
- API tokens later

### src/app/app.routes.ts

The application's route table.

It maps URLs to page components.

## Architecture Terms

### core

`core` contains app-wide infrastructure.

Use it for:

- API configuration
- global services
- route guards
- global stores
- tokens
- interceptors later

Do not put reusable visual UI components here.

### shared

`shared` contains reusable building blocks that do not belong to one business feature.

Use it for:

- UI components
- directives
- pipes
- tabs
- badges
- empty states

Shared code should be generic enough to use in multiple features.

### features

`features` contains business screens and feature-specific components.

Use it for:

- cases
- case detail
- create case
- review queue

If a component only makes sense for one feature, keep it inside that feature.

## Phase 1 Scope

In Phase 1, we will keep the scope intentionally small.

We will create:

- the Angular app
- a working app shell
- first routes
- placeholder pages
- clean project structure

We will not build real case features yet. Those begin in later phases.

## Done Criteria

Phase 1 is complete when:

- the app runs locally
- the root route renders
- placeholder routes render
- the folder structure is ready
- the README explains how to run the app
- the project has a clean commit

