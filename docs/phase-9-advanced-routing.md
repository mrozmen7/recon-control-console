# Phase 9 - Advanced Routing

## Purpose

This phase turns the URL into a typed application-state contract. A case can be
opened through a shareable deep link, and Angular binds the dynamic URL value
directly to a signal input on a lazily loaded detail component.

```text
case card
  -> RouterLink ['/cases', case.id]
    -> /cases/CASE-1001
      -> route matching
        -> format guard
          -> lazy CaseDetailPage chunk
            -> caseId signal input
              -> computed selected case
```

## Route Table

| URL              | Result        | Loading strategy    |
| ---------------- | ------------- | ------------------- |
| `/cases`         | Case register | Eager primary route |
| `/cases/new`     | Case creation | Lazy                |
| `/cases/:caseId` | Case detail   | Guarded and lazy    |
| `/queue`         | Review queue  | Lazy                |

The primary case register remains eager because it is the application's main
entry screen. Secondary workflows are downloaded only when activated.

## Route Order

Angular uses first-match-wins route selection. Static paths must appear before
overlapping dynamic paths:

```text
cases/new       -> must be checked first
cases/:caseId   -> otherwise "new" could become caseId
cases           -> collection route
**              -> wildcard always last
```

The route test navigates to `/cases/new` and requires `CreateCasePage`. This
turns route order from an undocumented assumption into verified behavior.

## Component Input Binding

`withComponentInputBinding()` allows Router state to bind directly to matching
component inputs.

```text
route key:      :caseId
component key:  caseId = input.required<string>()
```

The names form the contract. `CaseDetailPage` does not inject `ActivatedRoute`,
subscribe to `params`, copy the value into local state, or manually manage a
subscription.

Because `caseId` is a signal input, a navigation from one case ID to another
can update the reused component instance and invalidate `selectedCase`
automatically.

## Deep Linking

`/cases/CASE-1001` fully describes the selected application state. The address
can be bookmarked, shared, entered directly, or restored after a browser
refresh. The detail route creates `CasesService` when necessary and derives the
selected case from the loaded collection.

## Dynamic `RouterLink`

The case card uses a link parameters array:

```text
['/cases', 'CASE-1001'] -> /cases/CASE-1001
```

Angular serializes and navigates this URL without a full document reload.
Using `RouterLink` also preserves native link behavior such as keyboard access,
copying the destination, and opening the detail in another tab.

## Lazy Component Loading

`loadComponent` creates a dynamic import boundary. The production build now
emits separate chunks for case detail, case creation, and review queue.

```text
initial bundle
  -> case register and application shell

detail navigation
  -> download case-detail-page chunk
  -> activate detail route
```

Lazy loading reduces initial JavaScript work without turning the main entry
route into an unnecessary network boundary.

## Functional Guard

`caseIdFormatGuard` accepts the domain URL format `CASE-<digits>`. Invalid
formats return a `UrlTree` for `/cases` instead of activating the detail page.

```text
CASE-1001  -> activate detail
CASE-9999  -> activate detail, then show not found if absent
not-a-case -> redirect before activation
```

Format validity and record existence are different concerns. The guard checks
the route contract; the detail component represents a valid-but-missing
record. This client guard improves navigation behavior but is not a security
boundary. Authorization must also be enforced by the backend.

## View Transitions

`withViewTransitions()` runs route activation inside the browser View
Transitions API when supported. Unsupported browsers continue with normal
routing, so the feature is progressive enhancement.

Transition pseudo-elements live outside Angular component style encapsulation.
Their animations are therefore defined in global `styles.css`. Reduced-motion
preferences disable the custom animation.

The Angular Router integration remains in developer preview at the project's
current framework generation, so business behavior must never depend on the
animation being available.

## Testing Strategy

`RouterTestingHarness` creates a focused Router outlet and performs real Router
navigations in memory.

The tests prove:

- `/cases/CASE-1001` binds `CASE-1001` to the required signal input.
- `/cases/new` activates the static create route before the dynamic route.
- an invalid ID is redirected by the functional guard.
- the detail page represents loading, error, success, retry, and not-found states.
- case cards generate the expected detail URL.
- production output contains the expected lazy chunks.

## Terms

- **Route parameter:** A required dynamic segment embedded in a path.
- **Deep link:** A URL that directly restores a specific application view.
- **Route activation:** Creating and attaching the component selected by Router.
- **First-match wins:** Route selection stops at the first matching configuration.
- **Lazy loading:** Downloading code only when its route is activated.
- **Guard:** A function that approves, redirects, or blocks navigation.
- **`UrlTree`:** Angular's structured representation of a destination URL.
- **Progressive enhancement:** Optional behavior that improves capable browsers without becoming required for core functionality.
- **Router testing harness:** A test utility that performs navigation and exposes the activated component and DOM.

## Verification

- Dynamic detail navigation renders the correct case.
- Static route priority and invalid parameter redirects are covered by tests.
- Component inputs receive Router state without `ActivatedRoute` boilerplate.
- Three secondary pages are emitted as lazy chunks.
- View transitions fall back safely and respect reduced-motion preferences.
- The full Vitest suite and production build pass.
