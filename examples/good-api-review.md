# Good Api Review Example

## Scenario

A public order-management API supports mobile and web clients. The API has inconsistent error payloads, weak idempotency handling, and mixed versioning conventions.

## User Request

```text
Review this backend API design and list the highest-risk issues we should fix before opening it to third-party consumers.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/api-design.md
  - specs/error-handling.md
  - specs/versioning.md
  - specs/security.md
- Skills used:
  - skills/api-review/SKILL.md
  - skills/testing-review/SKILL.md
- Providers used:
  - code-navigation
  - symbol-analysis
- Project knowledge:
  - API routes, DTO contracts, and auth middleware behavior.

## Good Output Example

Summary:
The API is close to launch-ready but has three contract-level risks that can cause duplicate writes, client integration failures, and authorization bypasses.

Findings:

- Idempotency is missing for POST /orders, which allows duplicate order creation on retry.
- Error payload shape is inconsistent across controllers, making client error handling brittle.
- Resource-level authorization is validated on collection endpoints but missing on get-by-id for invoices.

Impact:

- Duplicate orders lead to direct revenue and reconciliation issues.
- Inconsistent contracts increase partner integration cost and support burden.
- Authorization gap creates tenant data exposure risk.

Evidence:

- POST /orders handler writes immediately without idempotency key checks.
- Three distinct error formats found in order, payment, and invoice endpoints.
- Invoice detail endpoint validates authentication but not tenant ownership.

Recommended next actions:

1. Add idempotency-key support with request-hash verification for mutating endpoints.
2. Standardize RFC-style problem details for all 4xx/5xx responses.
3. Enforce tenant-scoped authorization in resource lookup layer and add regression tests.

## Why This Is Good

- It is grounded in concrete endpoint behavior rather than generic API advice.
- It prioritizes business and security impact with actionable remediation steps.
