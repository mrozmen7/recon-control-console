# ADR 0004 - GitHub Pages Deployment

## Status

Accepted

## Context

The project is intended to be shared on GitHub and LinkedIn. Reviewers should
be able to open a live Angular application without cloning the repository.

The app is frontend-only and uses mock JSON data from `public/mock-data`, so it
does not require a server-side runtime.

## Decision

Deploy the production build to GitHub Pages from the `main` branch.

The deployment build uses:

```text
npm run build
npm run prepare:github-pages
```

The preparation command executes `scripts/prepare-github-pages.mjs` to set the
generated `index.html` base href to `/recon-control-console/`.

The GitHub Actions workflow uploads:

```text
dist/recon-control-console/browser
```

The same script writes `404.html` so direct route refreshes can fall back to
Angular Router.

## Consequences

Positive:

- the live demo is hosted close to the source code
- no separate hosting account is required
- the deployment is automated after CI passes on `main`
- reviewers can inspect both the code and the running app from GitHub

Tradeoff:

- GitHub Pages is static hosting, so backend behavior is still mocked
- Angular routes require the `404.html` fallback
- the app must be built with the repository base path

This is acceptable for the current portfolio scope.
