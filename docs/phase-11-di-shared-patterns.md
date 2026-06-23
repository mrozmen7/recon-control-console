# Phase 11 - Dependency Injection And Shared Patterns

## Purpose

This phase introduces architecture patterns that appear when an Angular
application starts to grow: dependency boundaries, reusable shared UI,
application-wide infrastructure, scoped state, and projected component content.

```text
ReviewQueuePage
  -> injects config token
  -> injects root logger service
  -> owns scoped session service
  -> uses shared tabs
  -> uses shared click directive
```

## `core/`

`core/` contains application-wide infrastructure. It should not know feature
screen details.

```text
src/app/core/
  config/
    recon-console.config.ts
  logging/
    interaction-logger.service.ts
```

In this phase:

- `RECON_CONSOLE_CONFIG` provides application configuration.
- `InteractionLoggerService` records local interaction audit entries.

## `shared/`

`shared/` contains reusable, domain-independent building blocks.

```text
src/app/shared/
  directives/
    click-logger.directive.ts
  tabs/
    tab-group.ts
    tab-panel.ts
```

Shared code can be imported by features, but it must not depend on feature
internals.

```text
features/review-queue -> shared/tabs
shared/tabs           -X-> features/review-queue
```

## Dependency Injection

Dependency Injection means a class asks Angular for the things it needs rather
than constructing them manually.

```text
component
  -> inject(ServiceOrToken)
    -> injector
      -> provider record
        -> instance or value
```

`ReviewQueuePage` injects:

- `RECON_CONSOLE_CONFIG`
- `InteractionLoggerService`
- `ReviewQueueSessionService`

## Provider Scopes

Provider scope controls how long a dependency instance lives.

| Scope              | Example                     | Lifetime                       |
| ------------------ | --------------------------- | ------------------------------ |
| root               | `InteractionLoggerService`  | whole application              |
| token root factory | `RECON_CONSOLE_CONFIG`      | whole application              |
| component          | `ReviewQueueSessionService` | one `ReviewQueuePage` instance |

`ReviewQueueSessionService` is provided directly on `ReviewQueuePage`, so each
page instance receives its own session ID and action count.

## InjectionToken

`InjectionToken` lets Angular inject values that are not classes.

```text
config object
  -> InjectionToken
    -> inject(RECON_CONSOLE_CONFIG)
```

This keeps configuration testable and replaceable without hard-coding values
inside feature components.

## Shared Directive

`ClickLoggerDirective` adds behavior to any element with `[appClickLogger]`.

```text
button click
  -> directive HostListener
    -> InteractionLoggerService.log()
      -> audit signal updates
```

The directive is reusable because it does not know about review queues or
reconciliation cases. It only knows how to log an interaction label and
optional metadata.

## Host Directive

`TabGroup` attaches `ClickLoggerDirective` through `hostDirectives`.

```text
TabGroup component host
  -> ClickLoggerDirective behavior attached by the component definition
```

This demonstrates Angular's directive composition model: a component can carry
shared behavior without requiring every consumer to write the directive in the
template.

## Content Projection

`TabPanel` uses `ng-content`:

```text
<app-tab-panel>
  external content
</app-tab-panel>

TabPanel template
  -> <ng-content />
```

The panel owns the frame and accessibility role, while the feature supplies the
actual business content.

## `contentChildren()`

`TabGroup` reads the projected `TabPanel` children:

```text
<app-tab-group>
  <app-tab-panel title="Ready">
  <app-tab-panel title="Escalations">
</app-tab-group>

TabGroup
  -> contentChildren(TabPanel)
  -> creates tab buttons
  -> activates selected panel
```

This is how the parent component coordinates child components that were passed
through content projection.

## Generic Tabs

The tab components do not mention reconciliation, review queue, or cases. They
only understand:

- titles
- values
- active panel state
- projected content
- tab accessibility attributes

This makes them usable by other features later.

## Review Queue Integration

`ReviewQueuePage` now demonstrates the whole pattern:

```text
core/config
  -> product name and SLA threshold

core/logging
  -> local interaction audit entries

feature scoped provider
  -> session action count

shared/tabs
  -> ready/escalation/resolved workspaces

shared/directives
  -> review action click logging
```

## Testing Strategy

The tests cover:

- click directive logging behavior
- tab projection and active panel switching
- review queue page integration
- injected config rendering
- scoped session action count

## Terms

- **Dependency:** A value, service, or object a class needs to work.
- **Dependency Injection:** Asking Angular to provide dependencies instead of creating them manually.
- **Provider:** A record that tells Angular how to create or return a dependency.
- **Injector:** Angular's lookup system for providers and dependency instances.
- **Scope:** The lifetime and visibility boundary of a provider instance.
- **Scoped provider:** A provider registered at a route or component boundary instead of globally.
- **InjectionToken:** A typed DI key for non-class values such as config objects.
- **Directive:** An Angular class that adds behavior to an element or component.
- **Host directive:** A directive attached to a component host through component metadata.
- **Content projection:** Passing external content into a component through `ng-content`.
- **`contentChildren()`:** A query that reads projected child components.
- **Shared UI component:** A reusable component that is independent of business domain details.
- **Generic tabs:** A tab component that works with any projected content.

## Verification

- `npm test -- --watch=false` passes.
- `npm run build` passes.
