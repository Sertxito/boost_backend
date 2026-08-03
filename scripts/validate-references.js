import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mcpeePath = path.join(root, "mcpee.json");

if (!fs.existsSync(mcpeePath)) {
  console.error("[ERROR] mcpee.json not found.");
  process.exit(1);
}

const content = fs.readFileSync(mcpeePath, "utf8");
let mcpee;

try {
  mcpee = JSON.parse(content);
} catch (error) {
  console.error("[ERROR] mcpee.json is not valid JSON.");
  console.error(String(error));
  process.exit(1);
}

const requiredTopLevel = ["schemaVersion", "name", "version", "type", "domain", "capabilities"];
const missingTopLevel = requiredTopLevel.filter((key) => !(key in mcpee));
if (missingTopLevel.length > 0) {
  console.error(`[ERROR] mcpee.json is missing top-level keys: ${missingTopLevel.join(", ")}`);
  process.exit(1);
}

if (!Array.isArray(mcpee.capabilities) || mcpee.capabilities.length === 0) {
  console.error("[ERROR] mcpee.json must include a non-empty capabilities array.");
  process.exit(1);
}

const capabilityIds = new Set();
let hasError = false;

const resolveRef = (refPath) => path.join(root, refPath);
const checkPath = (capabilityId, refType, refPath) => {
  if (typeof refPath !== "string" || refPath.trim().length === 0) {
    console.error(`[ERROR] ${capabilityId} has invalid ${refType} reference.`);
    hasError = true;
    return;
  }

  const fullPath = resolveRef(refPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[ERROR] ${capabilityId} references missing ${refType}: ${refPath}`);
    hasError = true;
  }
};

for (const capability of mcpee.capabilities) {
  const requiredCapabilityKeys = ["id", "title", "agent", "skills", "specs", "prompts", "evals", "providerNeeds"];
  for (const key of requiredCapabilityKeys) {
    if (!(key in capability)) {
      console.error(`[ERROR] Capability is missing key '${key}': ${JSON.stringify(capability)}`);
      hasError = true;
    }
  }

  if (typeof capability.id !== "string" || capability.id.trim().length === 0) {
    console.error("[ERROR] Capability with empty id found.");
    hasError = true;
    continue;
  }

  if (capabilityIds.has(capability.id)) {
    console.error(`[ERROR] Duplicate capability id: ${capability.id}`);
    hasError = true;
  }
  capabilityIds.add(capability.id);

  checkPath(capability.id, "agent", capability.agent);

  for (const refType of ["skills", "specs", "prompts", "evals"]) {
    const value = capability[refType];
    if (!Array.isArray(value) || value.length === 0) {
      console.error(`[ERROR] ${capability.id} must include a non-empty ${refType} array.`);
      hasError = true;
      continue;
    }

    for (const refPath of value) {
      checkPath(capability.id, refType.slice(0, -1), refPath);
    }
  }

  if (!Array.isArray(capability.providerNeeds) || capability.providerNeeds.length === 0) {
    console.error(`[ERROR] ${capability.id} must include a non-empty providerNeeds array.`);
    hasError = true;
  }
}

if (hasError) {
  process.exitCode = 1;
} else {
  console.log(`Reference validation passed for ${mcpee.capabilities.length} capabilities.`);
}
