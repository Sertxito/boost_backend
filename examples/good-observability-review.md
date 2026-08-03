# Good Observability Review Example

## Scenario

A distributed backend processes synchronous API requests and asynchronous jobs, but incidents are difficult to diagnose due to fragmented telemetry.

## User Request

```text
Review our backend observability and prioritize the changes that will most reduce incident diagnosis time.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/observability.md
  - specs/tracing.md
  - specs/logging.md
  - specs/telemetry.md
- Skills used:
  - skills/observability-review.md
  - skills/dependency-analysis.md
- Providers used:
  - telemetry
  - call-path-analysis
- Project knowledge:
  - Logging schema, metric catalog, tracing setup, and on-call runbooks.

## Good Output Example

Summary:
Observability coverage is broad but not coherent. The top gaps are missing cross-service trace correlation, low-signal metrics, and unstructured logs.

Findings:

- Request IDs are generated at the edge but not propagated into worker queues.
- Metrics focus on infrastructure health, with limited business-SLI visibility.
- Logs are inconsistent across services and lack stable fields for querying.

Impact:

- Mean time to detect and resolve incidents is higher than necessary.
- Root-cause analysis requires manual stitching across systems.
- SLO breaches are identified late.

Evidence:

- Traces terminate at queue publish boundaries.
- Dashboard lacks SLI views for checkout success rate and payment latency.
- Log samples show mixed formats and missing correlation fields.

Recommended next actions:

1. Propagate trace context through queue payload metadata.
2. Add service-level and business-level SLIs with alert thresholds.
3. Standardize structured logging fields across all services.

## Why This Is Good

- It prioritizes diagnosability outcomes, not only tooling features.
- It provides a clear bridge between telemetry data and operational improvements.
