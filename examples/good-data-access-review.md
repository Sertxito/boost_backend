# Good Data Access Review Example

## Scenario

An e-commerce backend has growing latency on product and order list endpoints, with heavy ORM usage and inconsistent query patterns.

## User Request

```text
Review our data access layer and call out the highest-impact performance and correctness issues.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/data-access.md
  - specs/performance.md
  - specs/transactions.md
- Skills used:
  - skills/data-access-review.md
  - skills/performance-analysis.md
- Providers used:
  - schema-analysis
  - dependency-analysis
- Project knowledge:
  - Query plans, ORM mappings, and transaction boundaries.

## Good Output Example

Summary:
The data access layer has three high-impact issues: N+1 patterns, unbounded queries, and transaction scope leaks.

Findings:

- Product listing loads related entities in per-row loops.
- Pagination is optional on high-cardinality endpoints.
- A write workflow spans external API calls within the same database transaction.

Impact:

- Latency and database CPU increase non-linearly with dataset growth.
- Memory pressure spikes in API nodes under high concurrency.
- Long-lived transactions raise lock contention and deadlock probability.

Evidence:

- Repeated SELECT patterns in tracing for list endpoints.
- Endpoint contract allows requests without page limits.
- Transaction scope includes network I/O in payment confirmation flow.

Recommended next actions:

1. Replace N+1 loads with joined or batched query strategies.
2. Enforce server-side pagination defaults and hard caps.
3. Split transaction boundaries around external I/O and use outbox/event coordination.

## Why This Is Good

- It connects query behavior directly to scalability failure modes.
- It gives concrete, implementable changes with clear operational benefits.
