# Good Security Review Example

## Scenario

A multi-tenant backend exposes REST endpoints for invoices, reports, and user management with mixed auth patterns.

## User Request

```text
Review our backend security posture and prioritize exploitable weaknesses.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/security.md
  - specs/data-protection.md
  - specs/error-handling.md
- Skills used:
  - skills/security-review.md
  - skills/api-review.md
- Providers used:
  - code-navigation
  - dependency-analysis
- Project knowledge:
  - Auth middleware, permission model, and audit logging paths.

## Good Output Example

Summary:
The top security risks are broken object-level authorization, over-privileged service credentials, and sensitive data leakage in logs.

Findings:

- Invoice detail endpoint accepts IDs without tenant ownership checks.
- Background worker uses a broad database credential with write access to unrelated schemas.
- Error logs include raw tokens and customer PII fields.

Impact:

- Unauthorized access to tenant data is possible.
- Credential compromise expands blast radius.
- Logging leakage creates compliance and breach-notification risk.

Evidence:

- Authorization guard validates authentication but not resource ownership.
- Worker connection string role grants exceed least-privilege intent.
- Log statements include Authorization header and full request payloads.

Recommended next actions:

1. Enforce tenant-scoped authorization in all resource fetch paths.
2. Rotate and scope service credentials per workload.
3. Add structured log redaction and ban sensitive-field logging by policy.

## Why This Is Good

- It evaluates exploitability and impact, not only checklist compliance.
- It provides concrete remediations aligned with least-privilege principles.
