# ADR 0003 - CI Quality Gates

## Status

Accepted

## Context

The project is intended for GitHub and LinkedIn. Reviewers should see that the
repository is not only hand-tested in a browser, but also verified by repeatable
commands.

## Decision

Add a GitHub Actions workflow that runs:

```text
npm ci
npm test -- --watch=false
npm run build
```

on pushes and pull requests targeting `main`.

## Consequences

Positive:

- dependency installation is reproducible
- tests protect behavior across phases
- build failures are caught before sharing or merging
- the repository looks closer to a professional team workflow

Tradeoff:

- CI time increases slightly
- dependency audit and deployment are documented but not enforced yet

The current scope is enough for a portfolio-grade Angular learning project.
