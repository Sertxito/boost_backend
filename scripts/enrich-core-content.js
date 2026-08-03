import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const skillProfiles = {
  "api-review.md": {
    title: "API Review Skill",
    goal: "Audit backend APIs for contract quality, correctness, compatibility, and operational safety before release.",
    when: [
      "When reviewing REST/gRPC endpoint design, error contracts, and version compatibility.",
      "When a team needs prioritized API findings with consumer impact and concrete remediation steps."
    ],
    procedure: [
      "Inventory public endpoints, versions, auth model, and request/response contracts.",
      "Validate resource modeling, HTTP semantics, idempotency, and pagination consistency.",
      "Inspect error payload standards, status code usage, and backward compatibility risks.",
      "Cross-check security controls (authz per resource, input validation, data exposure).",
      "Produce risk-ranked recommendations with migration guidance and test requirements."
    ],
    providers: ["code-navigation", "symbol-analysis", "document-search", "project-memory"],
    failures: [
      "Treating API style issues as critical while missing compatibility or data integrity regressions.",
      "Making breaking-change claims without tracing actual consumers and version policy."
    ]
  },
  "architecture-review.md": {
    title: "Architecture Review Skill",
    goal: "Evaluate backend architecture boundaries, dependency direction, and scalability trade-offs with evidence.",
    when: [
      "When reviewing modular monolith or microservice boundaries and coupling risks.",
      "When planning structural changes that can impact delivery speed or reliability."
    ],
    procedure: [
      "Map modules, bounded contexts, and dependency directions from code and runtime flow.",
      "Identify boundary leaks (domain -> infrastructure, controller -> persistence shortcuts).",
      "Assess cross-cutting concerns: transactions, observability, resiliency, and deployability.",
      "Classify findings by blast radius, migration complexity, and operational risk.",
      "Recommend staged remediation with clear sequencing and verification checkpoints."
    ],
    providers: ["dependency-analysis", "call-path-analysis", "knowledge-graph", "project-memory"],
    failures: [
      "Proposing a target architecture without a migration path from current constraints.",
      "Ignoring runtime characteristics while focusing only on static folder structure."
    ]
  },
  "data-access-review.md": {
    title: "Data Access Review Skill",
    goal: "Detect correctness and performance issues in repositories, queries, transaction scopes, and data contracts.",
    when: [
      "When endpoints or jobs show latency spikes, lock contention, or data consistency defects.",
      "When introducing new persistence patterns, ORMs, or cross-database operations."
    ],
    procedure: [
      "Trace data flows from API/service layer to persistence and external dependencies.",
      "Inspect query patterns for N+1, full scans, missing limits, and eager/lazy misuse.",
      "Validate transaction boundaries, isolation assumptions, and side-effect ordering.",
      "Evaluate schema access patterns, indexes, and migration safety constraints.",
      "Recommend measurable fixes with expected impact on latency, throughput, and consistency."
    ],
    providers: ["code-navigation", "schema-analysis", "telemetry", "dependency-analysis"],
    failures: [
      "Optimizing query syntax while leaving transaction and consistency risks unresolved.",
      "Claiming bottlenecks without evidence from plans, traces, or metrics."
    ]
  },
  "devops-review.md": {
    title: "DevOps Review Skill",
    goal: "Assess CI/CD, release governance, rollback readiness, and operational safety for backend delivery.",
    when: [
      "When reviewing pipelines, environment promotion rules, and deployment controls.",
      "When incidents reveal weak release safeguards or poor recovery procedures."
    ],
    procedure: [
      "Inspect pipeline stages, approval gates, test strategy, and artifact promotion flow.",
      "Validate environment parity, secret handling, and configuration drift controls.",
      "Review release safety mechanisms: smoke checks, canaries, rollback automation, runbooks.",
      "Correlate pipeline decisions with operational telemetry and incident history.",
      "Provide prioritized actions balancing speed, compliance, and recovery objectives."
    ],
    providers: ["pipeline-analysis", "document-search", "repository-analysis", "project-memory"],
    failures: [
      "Focusing on tooling preferences instead of release risk and recovery capability.",
      "Marking a pipeline healthy without validating post-deploy verification and rollback paths."
    ]
  },
  "observability-review.md": {
    title: "Observability Review Skill",
    goal: "Evaluate whether logs, metrics, and traces are sufficient to detect, diagnose, and resolve backend failures quickly.",
    when: [
      "When teams struggle to isolate root cause or correlate events across services.",
      "When defining SLO-driven telemetry standards for backend platforms."
    ],
    procedure: [
      "Map critical user and system flows to required telemetry signals.",
      "Validate correlation context propagation across sync and async boundaries.",
      "Assess metric quality (SLI coverage, cardinality control, actionable alerting).",
      "Review log structure, redaction policy, and queryability under incident pressure.",
      "Recommend improvements that reduce MTTD/MTTR with explicit validation metrics."
    ],
    providers: ["telemetry", "call-path-analysis", "code-navigation", "project-memory"],
    failures: [
      "Treating observability as dashboard quantity instead of diagnosability quality.",
      "Recommending alerts without threshold rationale or ownership paths."
    ]
  },
  "performance-analysis.md": {
    title: "Performance Analysis Skill",
    goal: "Identify and prioritize backend bottlenecks affecting latency, throughput, and cost efficiency.",
    when: [
      "When SLOs are violated under load, burst traffic, or long-running workflows.",
      "When optimization work must be sequenced by measurable performance impact."
    ],
    procedure: [
      "Collect baseline latency/throughput/error metrics and hotspot traces.",
      "Localize bottlenecks across compute, I/O, serialization, and data access layers.",
      "Quantify impact and expected gain for each candidate optimization.",
      "Evaluate side effects on correctness, resilience, and operational complexity.",
      "Deliver a phased plan: quick wins, medium-term fixes, and architecture-level changes."
    ],
    providers: ["telemetry", "dependency-analysis", "code-navigation", "knowledge-graph"],
    failures: [
      "Suggesting optimizations without baseline and post-change measurement criteria.",
      "Over-optimizing low-impact paths while critical bottlenecks remain unaddressed."
    ]
  },
  "refactoring.md": {
    title: "Refactoring Skill",
    goal: "Plan and execute behavior-safe backend refactors that reduce complexity and improve maintainability.",
    when: [
      "When hotspots show excessive coupling, high cyclomatic complexity, or fragile tests.",
      "When preparing code for feature expansion, reliability hardening, or architecture shifts."
    ],
    procedure: [
      "Define non-regression boundaries and critical flows to preserve.",
      "Segment changes into safe increments with explicit verification checkpoints.",
      "Improve structure by separating responsibilities and dependency direction.",
      "Upgrade tests from implementation-coupled to behavior-oriented coverage.",
      "Track residual debt and hand off a continuation plan with risk notes."
    ],
    providers: ["code-navigation", "dependency-analysis", "blast-radius", "test-discovery"],
    failures: [
      "Applying large refactors without guardrails, causing hidden behavior regressions.",
      "Reducing readability in the name of abstraction or pattern purity."
    ]
  },
  "security-review.md": {
    title: "Security Review Skill",
    goal: "Surface exploitable backend security weaknesses and prescribe prioritized, evidence-backed remediations.",
    when: [
      "When auditing authentication, authorization, data protection, and secret handling controls.",
      "When preparing external launch, compliance evidence, or post-incident hardening."
    ],
    procedure: [
      "Enumerate trust boundaries, identities, permissions, and externally reachable surfaces.",
      "Validate authN/authZ paths, tenant isolation, and object-level access controls.",
      "Inspect input handling, output encoding, and sensitive data exposure in errors/logs.",
      "Review dependency and configuration risks: secrets, TLS, token lifetime, least privilege.",
      "Produce severity-ranked findings with exploit scenario, impact, and fix strategy."
    ],
    providers: ["code-navigation", "dependency-analysis", "document-search", "project-memory"],
    failures: [
      "Reporting checklist items without exploitability or business impact context.",
      "Ignoring authorization edge cases in async paths and background jobs."
    ]
  },
  "testing-review.md": {
    title: "Testing Review Skill",
    goal: "Assess backend test strategy quality and improve confidence, stability, and release safety.",
    when: [
      "When flaky tests, escaped defects, or low-signal coverage reduce delivery confidence.",
      "When defining risk-based test coverage for critical backend workflows."
    ],
    procedure: [
      "Map critical flows and failure modes to existing unit, integration, and contract tests.",
      "Evaluate signal quality: determinism, isolation, and relevance to production behavior.",
      "Detect coverage gaps in error paths, compatibility contracts, and concurrency behavior.",
      "Correlate test-suite performance with pipeline feedback loops and release cadence.",
      "Recommend prioritized test improvements with ownership and measurable outcomes."
    ],
    providers: ["test-discovery", "dependency-analysis", "code-navigation", "project-memory"],
    failures: [
      "Equating test count with confidence while critical paths remain weakly validated.",
      "Ignoring flakiness root causes and only rerunning unstable tests."
    ]
  }
};

const specProfiles = {
  "api-design.md": {
    title: "API Design Spec",
    purpose: "Define stable, consumer-safe API contracts that are explicit, evolvable, and operationally clear.",
    principles: [
      "Model APIs around business resources and use consistent semantics for read/write behavior.",
      "Design contracts for forward/backward compatibility and explicit deprecation strategy.",
      "Standardize error and pagination contracts to reduce client integration ambiguity."
    ],
    validation: [
      "Every endpoint has clear ownership, auth requirements, and idempotency expectations.",
      "Breaking changes require version strategy, migration path, and consumer impact assessment.",
      "Error payloads and status codes are consistent across bounded contexts."
    ],
    anti: [
      "Inconsistent contract shapes across endpoints that force client-specific workarounds.",
      "Silent behavior changes under the same versioned contract.",
      "Leaking internal persistence models directly as public API contracts."
    ],
    evidence: "Use route definitions, DTO schemas, API docs, and integration test coverage to validate contract quality.",
    related: ["specs/versioning.md", "specs/error-handling.md", "specs/security.md"]
  },
  "clean-architecture.md": {
    title: "Clean Architecture Spec",
    purpose: "Preserve directional boundaries so backend business rules remain independent from delivery and infrastructure concerns.",
    principles: [
      "Domain rules must not depend on framework or infrastructure implementation details.",
      "Application use-cases orchestrate workflows through interfaces, not concrete adapters.",
      "Infrastructure concerns remain replaceable and isolated behind ports/adapters."
    ],
    validation: [
      "Dependency direction always points inward toward domain/application layers.",
      "Controllers and handlers do not access persistence details directly.",
      "Cross-layer communication contracts are explicit and testable."
    ],
    anti: [
      "Domain services importing infrastructure entities or repositories directly.",
      "Transport/controller logic containing business decision rules.",
      "Adapters driving use-case orchestration instead of application services."
    ],
    evidence: "Use import/dependency graphs, call paths, and test boundaries to verify architectural direction.",
    related: ["specs/ddd.md", "specs/dependency-injection.md", "specs/modular-monolith.md"]
  },
  "data-access.md": {
    title: "Data Access Spec",
    purpose: "Ensure data access paths are correct, performant, and resilient under production load.",
    principles: [
      "Align query shape with access patterns and bounded context invariants.",
      "Keep transaction scope minimal and explicit, especially across external side effects.",
      "Treat persistence performance as a first-class design concern, not an afterthought."
    ],
    validation: [
      "High-cardinality reads enforce safe paging, filtering, and ordering contracts.",
      "Hot queries are index-aligned and avoid N+1 or repeated hydration patterns.",
      "Write workflows preserve consistency with clear retry and idempotency behavior."
    ],
    anti: [
      "Unbounded list endpoints on large datasets.",
      "Long-lived transactions including external network I/O.",
      "Entity mapping leaks causing cross-context schema coupling."
    ],
    evidence: "Use query plans, ORM traces, lock metrics, and endpoint latency correlation to justify recommendations.",
    related: ["specs/database-first.md", "specs/performance.md", "specs/transactions.md"]
  },
  "devops.md": {
    title: "DevOps Spec",
    purpose: "Define backend delivery practices that maximize release safety, repeatability, and recovery speed.",
    principles: [
      "Automate build, test, and deployment with explicit control points for risk containment.",
      "Prefer immutable, traceable artifacts across environments.",
      "Design rollback and incident response as mandatory release capabilities."
    ],
    validation: [
      "Pipelines include quality gates tied to test signal and policy checks.",
      "Production promotions require controlled strategy (approval/canary/verification).",
      "Rollback path is documented, tested, and operationally feasible within target RTO."
    ],
    anti: [
      "Direct production deploys with no post-deploy verification stage.",
      "Environment-specific configuration drift with undocumented overrides.",
      "Treating failed rollback as an acceptable operational state."
    ],
    evidence: "Use pipeline configs, deployment logs, incident postmortems, and runbook quality to validate maturity.",
    related: ["specs/ci-cd.md", "specs/observability.md", "specs/security.md"]
  },
  "observability.md": {
    title: "Observability Spec",
    purpose: "Guarantee backend systems emit enough high-quality telemetry to explain behavior under normal and failure conditions.",
    principles: [
      "Instrument around user journeys and business-critical flows, not only infrastructure health.",
      "Maintain end-to-end correlation context across synchronous and asynchronous boundaries.",
      "Treat telemetry schema consistency as a contract across services."
    ],
    validation: [
      "Critical flows have traces, logs, and metrics with shared correlation identifiers.",
      "SLIs and alerts map to actionable ownership and remediation paths.",
      "Logs are structured, queryable, and redacted for sensitive data."
    ],
    anti: [
      "High telemetry volume with low diagnostic value.",
      "Alerts disconnected from SLOs and on-call ownership.",
      "Trace context dropped at queue/event boundaries."
    ],
    evidence: "Use dashboards, trace samples, log schemas, and incident timelines to verify diagnosability.",
    related: ["specs/logging.md", "specs/tracing.md", "specs/telemetry.md"]
  },
  "performance.md": {
    title: "Performance Spec",
    purpose: "Define measurable performance engineering practices for backend latency, throughput, and efficiency.",
    principles: [
      "Base optimization on profiling and production telemetry, not assumptions.",
      "Prioritize changes by user impact and system-wide bottleneck contribution.",
      "Protect correctness and reliability when introducing performance improvements."
    ],
    validation: [
      "Each optimization includes baseline, target, and verification metrics.",
      "P95/P99 and saturation metrics are tracked for critical endpoints and jobs.",
      "Resource and cost effects are evaluated alongside latency gains."
    ],
    anti: [
      "Micro-optimizing non-critical code paths while major bottlenecks persist.",
      "Deploying performance changes without rollback criteria.",
      "Ignoring serialization and I/O overhead in hot execution paths."
    ],
    evidence: "Use traces, flamegraphs, benchmark data, and capacity metrics to validate improvements.",
    related: ["specs/caching.md", "specs/data-access.md", "specs/observability.md"]
  },
  "refactoring.md": {
    title: "Refactoring Spec",
    purpose: "Define safe, incremental backend refactoring standards that preserve behavior while reducing design debt.",
    principles: [
      "Refactor in small, test-protected increments aligned to bounded responsibilities.",
      "Preserve externally observable behavior unless contract changes are explicitly approved.",
      "Use refactoring to improve clarity, dependency direction, and changeability."
    ],
    validation: [
      "Critical behavior is protected by deterministic tests before structural changes.",
      "Each step reduces complexity or coupling with measurable before/after evidence.",
      "Migration sequencing includes rollback or containment strategy for risky moves."
    ],
    anti: [
      "Large-scale rewrites with no staged verification gates.",
      "Introducing abstraction layers that hide business intent.",
      "Refactoring style without addressing maintainability bottlenecks."
    ],
    evidence: "Use complexity metrics, dependency graphs, and regression results to prove refactor value.",
    related: ["specs/code-quality.md", "specs/testing.md", "specs/clean-architecture.md"]
  },
  "security.md": {
    title: "Security Spec",
    purpose: "Define mandatory backend security controls for identity, authorization, data protection, and operational hardening.",
    principles: [
      "Apply least privilege and explicit authorization at every resource boundary.",
      "Protect sensitive data in transit, at rest, and in telemetry outputs.",
      "Continuously reduce attack surface through secure defaults and verification."
    ],
    validation: [
      "AuthN/AuthZ controls are enforced consistently across sync and async entry points.",
      "Secrets, tokens, and credentials follow rotation and scope minimization policies.",
      "Input/output and dependency surfaces are reviewed for exploitability and abuse paths."
    ],
    anti: [
      "Authorization checks only at route-level without object-level validation.",
      "Sensitive data leakage in logs, errors, or debug traces.",
      "Shared high-privilege credentials across unrelated workloads."
    ],
    evidence: "Use code paths, IAM config, logs, and dependency manifests to validate effective controls.",
    related: ["specs/data-protection.md", "specs/error-handling.md", "specs/devops.md"]
  },
  "testing.md": {
    title: "Testing Spec",
    purpose: "Define backend testing strategy that optimizes confidence, defect prevention, and delivery speed.",
    principles: [
      "Design tests around behavior and risk, not raw test volume.",
      "Maintain deterministic, isolated tests with clear ownership.",
      "Cover failure modes and contract boundaries of critical workflows."
    ],
    validation: [
      "Critical business flows include unit, integration, and contract-level protection as needed.",
      "Flaky tests are tracked, triaged, and prevented through deterministic design rules.",
      "Test feedback latency supports release cadence and risk posture."
    ],
    anti: [
      "Counting assertion volume as confidence without critical-path coverage.",
      "Fragile tests coupled to private implementation details.",
      "Ignoring negative-path and concurrency scenarios in backend workflows."
    ],
    evidence: "Use coverage by risk area, flake trends, and escaped-defect analysis to prioritize improvements.",
    related: ["specs/code-quality.md", "specs/clean-architecture.md", "specs/ci-cd.md"]
  },
  "error-handling.md": {
    title: "Error Handling Spec",
    purpose: "Define consistent backend error semantics that improve recoverability, observability, and client behavior.",
    principles: [
      "Expose predictable error contracts with stable machine-readable fields.",
      "Classify errors by responsibility (client, domain, infrastructure, transient).",
      "Preserve actionable context while protecting sensitive details."
    ],
    validation: [
      "Error payload structure is consistent across endpoints and services.",
      "Retryability and user-actionability are explicit in error semantics.",
      "Internal traces/logs retain diagnostic context tied to error identifiers."
    ],
    anti: [
      "Returning generic 500 responses for known business validation failures.",
      "Leaking stack traces or sensitive internals to external clients.",
      "Error taxonomies that differ between services without translation rules."
    ],
    evidence: "Use controller/handler responses, middleware behavior, and logs to validate consistency and safety.",
    related: ["specs/api-design.md", "specs/security.md", "specs/observability.md"]
  },
  "versioning.md": {
    title: "Versioning Spec",
    purpose: "Define explicit version evolution rules that protect clients while enabling backend change.",
    principles: [
      "Treat contract evolution as a planned compatibility process.",
      "Document deprecations with timelines, migration guidance, and consumer communication.",
      "Automate compatibility verification through tests and policy checks."
    ],
    validation: [
      "Breaking changes require explicit version transition strategy and rollout sequencing.",
      "Consumer-visible behavior changes are tested against previous supported versions.",
      "Deprecation metadata is discoverable and consistent in docs and runtime responses."
    ],
    anti: [
      "Shipping breaking changes under unchanged version contracts.",
      "Multiple versioning rules applied inconsistently across endpoints.",
      "Deprecation without migration support or sunset communication."
    ],
    evidence: "Use API definitions, compatibility tests, changelogs, and client feedback to validate version discipline.",
    related: ["specs/api-design.md", "specs/testing.md", "specs/devops.md"]
  },
  "transactions.md": {
    title: "Transactions Spec",
    purpose: "Define safe transactional behavior for backend workflows under concurrency and failure conditions.",
    principles: [
      "Keep transactional boundaries minimal and aligned with business invariants.",
      "Design for idempotency and replay safety in distributed operations.",
      "Prefer explicit consistency strategies over accidental coupling."
    ],
    validation: [
      "Write operations define isolation expectations and conflict handling behavior.",
      "Cross-boundary side effects use reliable coordination (outbox, saga, compensations).",
      "Retries do not violate business invariants or duplicate effects."
    ],
    anti: [
      "Holding DB transactions across external network calls.",
      "Mixing unrelated aggregate updates in one implicit transaction scope.",
      "Retrying non-idempotent operations without deduplication safeguards."
    ],
    evidence: "Use transaction scopes, lock/timeout traces, and workflow state transitions to verify safety.",
    related: ["specs/data-access.md", "specs/event-driven.md", "specs/resilience.md"]
  }
};

function renderSkill(profile) {
  return `# ${profile.title}\n\n## Goal\n\n${profile.goal}\n\n## When To Use\n\n- ${profile.when[0]}\n- ${profile.when[1]}\n\n## Required Inputs\n\n- User request.\n- Relevant specs.\n- Project knowledge if available.\n- Project memory if available.\n- Provider context if available.\n\n## Procedure\n\n1. ${profile.procedure[0]}\n2. ${profile.procedure[1]}\n3. ${profile.procedure[2]}\n4. ${profile.procedure[3]}\n5. ${profile.procedure[4]}\n\n## Provider Needs\n\n- ${profile.providers.join("\n- ")}\n\n## Output Contract\n\nThe response must include:\n\n- Summary.\n- Findings.\n- Impact.\n- Evidence.\n- Recommended next actions.\n\n## Quality Criteria\n\n- Grounded in evidence.\n- Uses official specs.\n- Distinguishes facts from assumptions.\n- Prioritizes by risk and impact.\n- Avoids unnecessary verbosity.\n\n## Failure Modes\n\n- ${profile.failures[0]}\n- ${profile.failures[1]}\n\n## SkillOpt Notes\n\nThis skill can be optimized by SkillOpt. Do not place universal knowledge here if it belongs in specs/.\n`;
}

function renderSpec(profile) {
  return `# ${profile.title}\n\n## Purpose\n\n${profile.purpose}\n\nThis spec represents universal backend boost knowledge. It must not contain customer-specific documentation or project-specific one-off decisions.\n\n## Principles\n\n- ${profile.principles[0]}\n- ${profile.principles[1]}\n- ${profile.principles[2]}\n\n## Validation Rules\n\n- ${profile.validation[0]}\n- ${profile.validation[1]}\n- ${profile.validation[2]}\n\n## Anti-Patterns\n\n- ${profile.anti[0]}\n- ${profile.anti[1]}\n- ${profile.anti[2]}\n\n## Evidence Required\n\n${profile.evidence}\n\n## Related Specs\n\n- ${profile.related.join("\n- ")}\n\n## Notes for Agents\n\nUse this spec to anchor decisions, explicitly call out assumptions, and prioritize high-impact remediation first.\n`;
}

for (const [file, profile] of Object.entries(skillProfiles)) {
  const fullPath = path.join(root, "skills", file);
  fs.writeFileSync(fullPath, renderSkill(profile), "utf8");
  console.log(`enriched skill ${file}`);
}

for (const [file, profile] of Object.entries(specProfiles)) {
  const fullPath = path.join(root, "specs", file);
  fs.writeFileSync(fullPath, renderSpec(profile), "utf8");
  console.log(`enriched spec ${file}`);
}

console.log("Core domain enrichment completed.");
