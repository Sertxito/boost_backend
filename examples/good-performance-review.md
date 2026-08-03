# Good Performance Review Example

## Scenario

An API serving flash-sale traffic is failing its p95 latency SLO and occasionally timing out under burst concurrency.

## User Request

```text
Review this backend for performance bottlenecks and propose the fastest high-impact improvements.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/performance.md
  - specs/caching.md
  - specs/observability.md
- Skills used:
  - skills/performance-analysis.md
  - skills/data-access-review.md
- Providers used:
  - telemetry
  - dependency-analysis
- Project knowledge:
  - Latency profiles, hot routes, and cache hit ratios.

## Good Output Example

Summary:
The largest latency contributors are synchronous I/O in request paths, low cache effectiveness, and repeated payload transformations.

Findings:

- Two critical endpoints perform blocking calls to downstream services.
- Cache hit ratio is below target because keys omit stable dimensions.
- Serialization work is repeated in middleware and controllers.

Impact:

- p95 breaches grow during bursts, risking SLA penalties.
- Infrastructure cost increases due to avoidable CPU load.

Evidence:

- Traces show stacked blocking spans in checkout and pricing endpoints.
- Cache metrics show high miss rates for equivalent requests.
- Profiling indicates repeated JSON transformation hotspots.

Recommended next actions:

1. Convert downstream client calls to fully async with bounded concurrency.
2. Redesign cache key strategy and introduce short-lived stale-while-revalidate.
3. Consolidate serialization path and avoid duplicate transformations.

## Why This Is Good

- It ties recommendations to measurable latency and cost signals.
- It balances quick wins with sustainable architectural improvements.
