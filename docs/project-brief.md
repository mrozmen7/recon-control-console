# Recon Control Console - Project Brief

## Purpose

Recon Control Console is a modern Angular reference project for learning and demonstrating current Angular application development patterns through a realistic, but intentionally limited, reconciliation operations domain.

The primary goal is Angular mastery, not deep banking-domain modeling. The reconciliation domain gives the app a professional business context while keeping the scope focused on the Angular concepts from the course.

## Learning Goal

This project follows the structure of the Intermediate Angular course content, but it will not copy the course app, UI, wording, or domain. Instead of an event management app, this project uses a reconciliation case management console.

The project is designed to become a portfolio-ready and reusable reference for:

- signal-based component design
- declarative data fetching
- modern routing
- signal forms
- dependency injection patterns
- shared UI architecture
- rendering and performance
- RxJS concurrency
- enterprise state management with SignalStore
- Angular testing with Vitest

## Product Scenario

Recon Control Console helps an operations team review reconciliation cases.

The app will support:

- viewing a list of reconciliation cases
- searching and filtering cases
- opening a case detail page
- creating a new case
- adding cases to a review queue
- approving or reviewing a case action
- viewing lightweight audit/timeline details

This is enough domain complexity to make the Angular patterns meaningful, without turning the project into a full banking platform.

## Target User

The imagined user is an internal operations analyst working on settlement or reconciliation exceptions.

They need to:

- scan active cases quickly
- understand status, priority, amount, and ownership
- open details when needed
- submit or review actions safely
- avoid duplicate actions on slow network requests

## What This Project Is

- A learning project with professional standards.
- A modern Angular reference implementation.
- A GitHub and LinkedIn portfolio project.
- A frontend that can later be aligned with a Spring Boot reconciliation backend.

## What This Project Is Not

- It is not a full banking product.
- It is not a clone of the course project.
- It is not a complex enterprise platform.
- It is not a place for unnecessary abstractions.

## Core Principle

Enterprise-aware, portfolio-ready, but not over-engineered.

Every architectural choice should support one of these goals:

- teach an Angular concept clearly
- make the project easier to maintain
- make the portfolio presentation stronger
- prepare the app for future Spring Boot integration

## Domain Mapping From The Course

| Course App | Recon Control Console |
| --- | --- |
| Event list | Case list |
| Event card | Case card |
| Search events | Search cases |
| Event details | Case details |
| Create event | Create case |
| Buy ticket | Add to review queue / approve action |
| Ticket count | Review queue count |
| Speakers tab | Audit log / timeline |
| Venue map | Evidence / settlement trace panel |
| EventsService | CasesService |
| CartStore | ReviewQueueStore |

## Initial Feature Set

The first complete version should include:

- dashboard shell
- case list page
- case card or row component
- case search component
- case detail page
- create case page
- review queue state
- reusable UI card, badge, and tab components
- mock API with JSON data
- tests for critical signal and store behavior
- professional README and architecture notes

## Technical Direction

The project will use:

- Angular standalone components
- Angular Signals
- Angular Router
- Angular HTTP APIs
- Signal Forms
- NgRx SignalStore
- RxJS
- Vitest
- SSR and hydration when the course reaches rendering/performance

## Future Backend Direction

The app should later be able to connect to a Spring Boot reconciliation backend.

For now, the API will be mocked with JSON data. The frontend should still keep API access behind services and injection tokens so the backend can be replaced without rewriting components.

