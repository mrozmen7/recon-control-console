# ADR 0001 - Modern Angular Reference Architecture

## Status

Accepted

## Context

The project is a learning and portfolio application. It needs to demonstrate
real Angular architecture without becoming a large fake enterprise system.

## Decision

Use a standalone Angular architecture with clear boundaries:

```text
app root
layout
core
shared
features
```

Create folders only when a real responsibility exists.

## Consequences

Positive:

- the project remains easy to explain
- feature code stays close to its business behavior
- shared code stays domain-independent
- core code stays infrastructure-focused
- future Spring Boot integration has clear data-access boundaries

Tradeoff:

- some files start small and are split later when the phase needs it

This is intentional. The architecture grows from concrete use cases instead of
empty folders.
