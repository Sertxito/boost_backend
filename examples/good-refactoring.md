# Good Refactoring Example

## Scenario

A critical backend service grew into a large class with tightly coupled dependencies and fragile tests.

## User Request

```text
Review this codebase and propose a safe refactoring sequence that improves maintainability without regressions.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/refactoring.md
  - specs/clean-architecture.md
  - specs/code-quality.md
- Skills used:
  - skills/refactoring.md
  - skills/test-impact-analysis.md
- Providers used:
  - code-navigation
  - blast-radius
- Project knowledge:
  - Critical flows, test ownership, and deployment cadence.

## Good Output Example

Summary:
Refactoring is feasible with low business risk if performed in four controlled increments.

Findings:

- Service class mixes orchestration, validation, persistence, and integration concerns.
- Tests assert private implementation details instead of behavioral contracts.
- Shared utility module introduces hidden coupling across bounded contexts.

Impact:

- Change velocity is low and bug probability rises on each feature.
- Teams avoid modifications in high-risk areas, creating delivery bottlenecks.

Evidence:

- Dependency graph shows 19 direct collaborators for one service.
- Test suite fails on harmless internal reordering.
- Utility module is imported by unrelated domains.

Recommended next actions:

1. Extract pure domain logic behind behavior-focused tests.
2. Introduce application service interfaces and move side effects behind ports.
3. Decompose shared utility module into explicit domain adapters.
4. Roll out changes behind feature flags with progressive verification.

## Why This Is Good

- It uses a safe sequence that protects runtime behavior.
- It identifies both technical debt and organizational delivery impact.
