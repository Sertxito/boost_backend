import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const promptDir = path.join(root, "prompts");

const profiles = {
  "api-review.prompt.md": {
    title: "API Review Prompt",
    purpose: "Guide runtime composition for high-signal API design and compatibility assessments.",
    focus: [
      "Contract consistency (resource model, status codes, error schema, pagination).",
      "Compatibility and versioning risk for current and future consumers.",
      "API security controls: authn, authz, input validation, and sensitive data exposure."
    ],
    doNotDo: [
      "Do not report style-only findings as critical defects.",
      "Do not claim a breaking change without concrete consumer impact evidence."
    ]
  },
  "architecture-review.prompt.md": {
    title: "Architecture Review Prompt",
    purpose: "Guide runtime composition for boundary integrity, coupling analysis, and migration-safe architecture recommendations.",
    focus: [
      "Layer and bounded-context dependency direction.",
      "Operational architecture fitness: resilience, observability, deployability.",
      "Incremental migration strategy with risk-controlled sequencing."
    ],
    doNotDo: [
      "Do not propose large rewrites without a staged migration path.",
      "Do not infer architecture from folder names alone; verify with call/dependency evidence."
    ]
  },
  "data-access-review.prompt.md": {
    title: "Data Access Review Prompt",
    purpose: "Guide runtime composition for data correctness, query efficiency, and transaction safety reviews.",
    focus: [
      "Query and access-pattern performance risks (N+1, full scans, missing limits).",
      "Transaction boundaries, idempotency, and consistency behavior under failure.",
      "Schema/index usage aligned to endpoint and workflow patterns."
    ],
    doNotDo: [
      "Do not recommend query rewrites without explaining expected measurable impact.",
      "Do not ignore transaction and side-effect ordering risks in distributed workflows."
    ]
  },
  "devops-review.prompt.md": {
    title: "DevOps Review Prompt",
    purpose: "Guide runtime composition for CI/CD safety, release governance, and recovery readiness.",
    focus: [
      "Pipeline quality gates, promotion controls, and deployment verification.",
      "Rollback, incident response readiness, and operational ownership.",
      "Security and configuration hygiene across environments."
    ],
    doNotDo: [
      "Do not treat tool choice as the primary finding when release risk is the real issue.",
      "Do not mark deployment readiness without rollback feasibility checks."
    ]
  },
  "observability-review.prompt.md": {
    title: "Observability Review Prompt",
    purpose: "Guide runtime composition for diagnosability, telemetry coherence, and alert actionability.",
    focus: [
      "Trace/log/metric correlation across sync and async execution paths.",
      "SLI/SLO coverage and actionable alert routing.",
      "Log schema consistency and sensitive-data redaction practices."
    ],
    doNotDo: [
      "Do not confuse telemetry volume with observability quality.",
      "Do not recommend alerts without threshold rationale and ownership context."
    ]
  },
  "performance-review.prompt.md": {
    title: "Performance Review Prompt",
    purpose: "Guide runtime composition for bottleneck localization and impact-prioritized optimization planning.",
    focus: [
      "Latency/throughput bottlenecks tied to real telemetry signals.",
      "Hot-path compute, I/O, serialization, and caching inefficiencies.",
      "Optimization sequencing with risk and verification criteria."
    ],
    doNotDo: [
      "Do not recommend optimizations without baseline and target metrics.",
      "Do not prioritize micro-optimizations over critical-path bottlenecks."
    ]
  },
  "refactoring.prompt.md": {
    title: "Refactoring Review Prompt",
    purpose: "Guide runtime composition for behavior-safe refactoring plans with clear sequencing.",
    focus: [
      "Complexity and coupling hotspots that block safe change.",
      "Incremental refactor strategy with non-regression checkpoints.",
      "Test adaptation needed to protect behavior during structural changes."
    ],
    doNotDo: [
      "Do not suggest high-risk refactors without rollback or containment strategy.",
      "Do not optimize structure at the cost of domain clarity."
    ]
  },
  "security-review.prompt.md": {
    title: "Security Review Prompt",
    purpose: "Guide runtime composition for exploitability-focused backend security assessment.",
    focus: [
      "Identity and authorization controls across resource boundaries.",
      "Sensitive data handling in storage, transport, and telemetry.",
      "Dependency/configuration exposures and least-privilege enforcement."
    ],
    doNotDo: [
      "Do not output checklist-only findings without exploitability context.",
      "Do not classify severity without business impact and attack path rationale."
    ]
  },
  "testing-review.prompt.md": {
    title: "Testing Review Prompt",
    purpose: "Guide runtime composition for confidence-driven backend testing strategy evaluation.",
    focus: [
      "Critical-path coverage across unit, integration, and contract tests.",
      "Flakiness drivers, determinism gaps, and pipeline feedback quality.",
      "Risk-based prioritization of test improvements."
    ],
    doNotDo: [
      "Do not equate test count with release confidence.",
      "Do not recommend broad test additions without identifying highest-risk gaps first."
    ]
  }
};

function renderPrompt(profile) {
  return `# ${profile.title}\n\n## Purpose\n\n${profile.purpose}\n\n## Runtime Inputs\n\n- Agent identity.\n- Official specs.\n- Official skills.\n- Generated skill if exists.\n- Local override if exists.\n- Project knowledge.\n- Project memory.\n- Provider context.\n- Telemetry constraints.\n\n## Domain Focus\n\n- ${profile.focus[0]}\n- ${profile.focus[1]}\n- ${profile.focus[2]}\n\n## Prompt Structure\n\n\`\`\`text\nYou are executing capability: {capability.id}\n\nAgent:\n{agent}\n\nOfficial Specs:\n{specs}\n\nComposed Skill:\n{skill}\n\nProject Knowledge:\n{knowledge}\n\nProject Memory:\n{memory}\n\nProvider Context:\n{providerContext}\n\nExecution rules:\n- Use evidence first.\n- Distinguish confirmed findings from assumptions.\n- Prioritize by business impact and operational risk.\n- Propose actionable remediation with safe sequencing.\n- Cite file paths and reasoning inputs when available.\n\nDomain-specific guardrails:\n- ${profile.doNotDo[0]}\n- ${profile.doNotDo[1]}\n\`\`\`\n\n## Output Format\n\n- Executive Summary\n- Prioritized Findings (Critical, High, Medium, Low)\n- Impacted Areas\n- Evidence Used\n- Recommended Actions\n- Validation Plan\n- Open Risks / Unknowns\n`;
}

for (const [fileName, profile] of Object.entries(profiles)) {
  const fullPath = path.join(promptDir, fileName);
  fs.writeFileSync(fullPath, renderPrompt(profile), "utf8");
  console.log(`enriched prompt ${fileName}`);
}

console.log("Prompt enrichment completed.");
