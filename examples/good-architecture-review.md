# Good Architecture Review Example

## Scenario

A modular monolith backend evolved quickly and now has domain logic inside controllers and direct infrastructure dependencies in core services.

## User Request

```text
Please review the backend architecture and identify boundary violations that will block safe scaling of the system.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/clean-architecture.md
  - specs/ddd.md
  - specs/modular-monolith.md
- Skills used:
  - skills/architecture-review.md
  - skills/dependency-analysis.md
- Providers used:
  - dependency-analysis
  - call-path-analysis
- Project knowledge:
  - Module boundaries, dependency graph, and startup composition root.

## Good Output Example

Summary:
The architecture has a clear module intent, but current dependency direction breaks core boundaries and increases change-cascade risk.

Findings:

- Controllers call repositories directly, bypassing application services.
- Domain services reference ORM entities and infrastructure adapters.
- Cross-module synchronous calls implement shared workflows without anti-corruption boundaries.

Impact:

- Testing cost rises because business behavior is coupled to persistence concerns.
- Module changes produce broad regression risk.
- Incremental extraction to services will be expensive if boundary violations continue.

Evidence:

- Call paths from HTTP handlers to repository implementations skip application layer.
- Domain package imports infrastructure package types.
- Two modules exchange persistence DTOs instead of domain contracts.

Recommended next actions:

1. Introduce application service interfaces per module and route controllers through them.
2. Invert domain dependencies to remove infrastructure type references.
3. Add anti-corruption mappers for cross-module interactions.

## Why This Is Good

- It highlights structural defects through dependency evidence.
- It proposes staged remediation that preserves delivery continuity.
