import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const titleOverrides = {
  "api": "API",
  "ci": "CI",
  "cd": "CD",
  "ddd": "DDD",
  "cqrs": "CQRS",
  "net": ".NET"
};

const skillProviderNeeds = {
  "api-review.md": ["code-navigation", "symbol-analysis", "project-memory"],
  "architecture-review.md": ["dependency-analysis", "call-path-analysis", "project-memory"],
  "code-review.md": ["code-navigation", "dependency-analysis", "project-memory"],
  "data-access-review.md": ["code-navigation", "schema-analysis", "telemetry"],
  "database-first-review.md": ["schema-analysis", "code-navigation", "project-memory"],
  "dependency-analysis.md": ["dependency-analysis", "call-path-analysis", "knowledge-graph"],
  "devops-review.md": ["pipeline-analysis", "document-search", "project-memory"],
  "migration-analysis.md": ["dependency-analysis", "code-navigation", "document-search"],
  "observability-review.md": ["telemetry", "call-path-analysis", "project-memory"],
  "performance-analysis.md": ["telemetry", "dependency-analysis", "code-navigation"],
  "provider-context-selection.md": ["document-search", "project-memory", "knowledge-graph"],
  "refactoring.md": ["code-navigation", "dependency-analysis", "blast-radius"],
  "release-review.md": ["pipeline-analysis", "document-search", "project-memory"],
  "security-review.md": ["code-navigation", "dependency-analysis", "document-search"],
  "task-planning.md": ["project-memory", "document-search", "code-navigation"],
  "test-impact-analysis.md": ["dependency-analysis", "test-discovery", "blast-radius"],
  "testing-review.md": ["test-discovery", "dependency-analysis", "code-navigation"],
  "token-budgeting.md": ["project-memory", "document-search", "knowledge-graph"]
};

const specRelated = {
  "api-design.md": ["specs/versioning.md", "specs/error-handling.md", "specs/security.md"],
  "azure-backend-patterns.md": ["specs/cloud-native.md", "specs/observability.md", "specs/resilience.md"],
  "caching.md": ["specs/performance.md", "specs/data-access.md", "specs/resilience.md"],
  "ci-cd.md": ["specs/testing.md", "specs/devops.md", "specs/security.md"],
  "clean-architecture.md": ["specs/ddd.md", "specs/dependency-injection.md", "specs/modular-monolith.md"],
  "cloud-native.md": ["specs/containerization.md", "specs/observability.md", "specs/resilience.md"],
  "code-quality.md": ["specs/refactoring.md", "specs/testing.md", "specs/clean-architecture.md"],
  "configuration.md": ["specs/security.md", "specs/cloud-native.md", "specs/devops.md"],
  "containerization.md": ["specs/cloud-native.md", "specs/ci-cd.md", "specs/security.md"],
  "cqrs.md": ["specs/ddd.md", "specs/event-driven.md", "specs/data-access.md"],
  "data-access.md": ["specs/database-first.md", "specs/performance.md", "specs/transactions.md"],
  "data-protection.md": ["specs/security.md", "specs/error-handling.md", "specs/logging.md"],
  "database-first.md": ["specs/data-access.md", "specs/versioning.md", "specs/transactions.md"],
  "ddd.md": ["specs/clean-architecture.md", "specs/cqrs.md", "specs/modular-monolith.md"],
  "dependency-injection.md": ["specs/clean-architecture.md", "specs/testing.md", "specs/code-quality.md"],
  "devops.md": ["specs/ci-cd.md", "specs/observability.md", "specs/security.md"],
  "error-handling.md": ["specs/api-design.md", "specs/security.md", "specs/observability.md"],
  "event-driven.md": ["specs/cqrs.md", "specs/transactions.md", "specs/observability.md"],
  "integration-patterns.md": ["specs/api-design.md", "specs/event-driven.md", "specs/security.md"],
  "logging.md": ["specs/observability.md", "specs/telemetry.md", "specs/security.md"],
  "microservices.md": ["specs/cloud-native.md", "specs/observability.md", "specs/resilience.md"],
  "modular-monolith.md": ["specs/ddd.md", "specs/clean-architecture.md", "specs/refactoring.md"],
  "net-best-practices.md": ["specs/code-quality.md", "specs/testing.md", "specs/performance.md"],
  "observability.md": ["specs/logging.md", "specs/tracing.md", "specs/telemetry.md"],
  "performance.md": ["specs/caching.md", "specs/data-access.md", "specs/observability.md"],
  "refactoring.md": ["specs/code-quality.md", "specs/testing.md", "specs/clean-architecture.md"],
  "resilience.md": ["specs/cloud-native.md", "specs/performance.md", "specs/devops.md"],
  "security.md": ["specs/data-protection.md", "specs/error-handling.md", "specs/devops.md"],
  "telemetry.md": ["specs/observability.md", "specs/logging.md", "specs/tracing.md"],
  "testing.md": ["specs/code-quality.md", "specs/clean-architecture.md", "specs/ci-cd.md"],
  "tracing.md": ["specs/observability.md", "specs/telemetry.md", "specs/performance.md"],
  "transactions.md": ["specs/data-access.md", "specs/event-driven.md", "specs/resilience.md"],
  "versioning.md": ["specs/api-design.md", "specs/testing.md", "specs/devops.md"]
};

function toWords(stem) {
  return stem
    .split("-")
    .map((part) => titleOverrides[part] ?? part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toTopicPhrase(words) {
  const keep = new Set(["API", "CI", "CD", "DDD", "CQRS", ".NET"]);
  return words
    .split(" ")
    .map((word) => (keep.has(word) ? word : word.toLowerCase()))
    .join(" ");
}

function buildSkillContent(fileName) {
  const stem = fileName.replace(/\.md$/, "");
  const topic = toWords(stem);
  const topicPhrase = toTopicPhrase(topic);
  const providerNeeds = skillProviderNeeds[fileName] ?? ["code-navigation", "dependency-analysis", "project-memory"];

  const whenToUse = [
    `Use this skill when a request requires ${topicPhrase} guidance with concrete evidence from the repository.`,
    "Use this skill when trade-offs must be prioritized by risk, impact, and delivery constraints."
  ];

  const procedure = [
    `Identify the scope of the ${topicPhrase} request and the affected components.`,
    "Gather direct evidence from code, configuration, and project context before drawing conclusions.",
    "Map findings to relevant specs and classify each issue by severity and business impact.",
    "Propose actionable recommendations with a safe execution order and validation approach.",
    "Summarize confirmed facts, open risks, and next implementation steps."
  ];

  const failureModes = [
    "Recommendations are generic, not backed by code or configuration evidence.",
    "Critical risks are missed because assumptions are not separated from confirmed findings."
  ];

  return `# ${topic} Skill\n\n## Goal\n\nProvide an evidence-based ${topicPhrase} workflow that turns repository signals into prioritized, actionable guidance.\n\n## When To Use\n\n- ${whenToUse[0]}\n- ${whenToUse[1]}\n\n## Required Inputs\n\n- User request.\n- Relevant specs.\n- Project knowledge if available.\n- Project memory if available.\n- Provider context if available.\n\n## Procedure\n\n1. ${procedure[0]}\n2. ${procedure[1]}\n3. ${procedure[2]}\n4. ${procedure[3]}\n5. ${procedure[4]}\n\n## Provider Needs\n\n${providerNeeds.map((item) => `- ${item}`).join("\n")}\n\n## Output Contract\n\nThe response must include:\n\n- Summary.\n- Findings.\n- Impact.\n- Evidence.\n- Recommended next actions.\n\n## Quality Criteria\n\n- Grounded in evidence.\n- Uses official specs.\n- Distinguishes facts from assumptions.\n- Prioritizes by risk and impact.\n- Avoids unnecessary verbosity.\n\n## Failure Modes\n\n- ${failureModes[0]}\n- ${failureModes[1]}\n\n## SkillOpt Notes\n\nThis skill can be optimized by SkillOpt. Do not place universal knowledge here if it belongs in specs/.\n`;
}

function buildSpecContent(fileName) {
  const stem = fileName.replace(/\.md$/, "");
  const topic = toWords(stem);
  const topicPhrase = toTopicPhrase(topic);
  const related = specRelated[fileName] ?? ["specs/code-quality.md", "specs/testing.md", "specs/security.md"];

  return `# ${topic} Spec\n\n## Purpose\n\nDefine the non-negotiable guidance for ${topicPhrase} decisions in backend systems.\n\nThis spec represents universal backend boost knowledge. It must not contain customer-specific documentation or project-specific one-off decisions.\n\n## Principles\n\n- Keep ${topicPhrase} decisions explicit, traceable, and aligned with system boundaries.\n- Prefer stable contracts and reversible changes over short-term convenience.\n- Optimize for reliability, observability, and long-term maintainability.\n\n## Validation Rules\n\n- Every recommendation must be justified with direct evidence from code, configuration, or runtime behavior.\n- Changes must include a verification strategy (tests, metrics, or rollout checks) before production adoption.\n- Risk-prone modifications must define rollback or containment guidance.\n\n## Anti-Patterns\n\n- Applying ${topicPhrase} advice without checking constraints of the current architecture and workload.\n- Mixing implementation details with policy-level decisions in the same recommendation.\n- Treating style preferences as critical issues when no measurable impact exists.\n\n## Evidence Required\n\nCollect code-level and operational evidence that shows current behavior, affected flows, and impact scope before proposing changes.\n\n## Related Specs\n\n- ${related.join("\n- ")}\n\n## Notes for Agents\n\nUse this spec to anchor decisions, explicitly call out assumptions, and prioritize high-impact remediation first.\n`;
}

function writeSkillFiles() {
  const dir = path.join(root, "skills");
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md"));

  for (const file of files) {
    const content = buildSkillContent(file);
    fs.writeFileSync(path.join(dir, file), content, "utf8");
    console.log(`updated skill ${file}`);
  }
}

function writeSpecFiles() {
  const dir = path.join(root, "specs");
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md"));

  for (const file of files) {
    const content = buildSpecContent(file);
    fs.writeFileSync(path.join(dir, file), content, "utf8");
    console.log(`updated spec ${file}`);
  }
}

function normalizeExampleArtifacts() {
  const dir = path.join(root, "examples");
  if (!fs.existsSync(dir)) {
    return;
  }

  const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md"));
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const current = fs.readFileSync(fullPath, "utf8");
    const updated = current.replace(/`r`n/g, "\n");
    if (updated !== current) {
      fs.writeFileSync(fullPath, updated, "utf8");
      console.log(`normalized example ${file}`);
    }
  }
}

writeSkillFiles();
writeSpecFiles();
normalizeExampleArtifacts();

console.log("Content completion pass finished.");
