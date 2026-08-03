# Good Testing Review Example

## Scenario

The backend has thousands of tests, but production incidents still escape due to low-signal and flaky test coverage.

## User Request

```text
Review our testing approach and propose a practical strategy to improve confidence and reduce flaky failures.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/testing.md
  - specs/clean-architecture.md
  - specs/api-design.md
- Skills used:
  - skills/testing-review/SKILL.md
  - skills/test-impact-analysis/SKILL.md
- Providers used:
  - test-discovery
  - dependency-analysis
- Project knowledge:
  - Incident history, test run trends, and module ownership.

## Good Output Example

Summary:
The current suite optimizes for test volume over confidence. The highest gaps are contract coverage, deterministic integration tests, and risk-based prioritization.

Findings:

- Public API contracts are weakly tested across version boundaries.
- Flaky tests depend on shared mutable fixtures and wall-clock timing.
- Critical payment paths have sparse failure-mode coverage.

Impact:

- Escaped regressions affect external clients.
- Build trust is reduced due to intermittent failures.
- High-severity defects are detected late.

Evidence:

- Contract tests cover only success paths for major endpoints.
- Flaky failures cluster around async timing-sensitive integration tests.
- Mutation/error-path coverage is low for payment workflows.

Recommended next actions:

1. Add contract tests per public endpoint with version compatibility assertions.
2. Isolate flaky tests with deterministic fixtures and controlled clocks.
3. Introduce risk-based test matrix tied to critical business flows.

## Why This Is Good

- It shifts focus from quantity to confidence and failure containment.
- It links recommendations to incident and build-stability outcomes.
