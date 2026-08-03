import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const evalDir = path.join(root, "evals");
const mcpeePath = path.join(root, "mcpee.json");

const requiredTopLevel = ["schemaVersion", "capability", "description", "qualityDimensions", "cases"];
const requiredCaseFields = ["id", "title", "input", "expected", "reasoning"];

if (!fs.existsSync(mcpeePath)) {
  console.error("[ERROR] mcpee.json not found.");
  process.exit(1);
}

const mcpee = JSON.parse(fs.readFileSync(mcpeePath, "utf8"));
const capabilities = new Set((mcpee.capabilities ?? []).map((c) => c.id));

if (!fs.existsSync(evalDir)) {
  console.error("[ERROR] evals directory not found.");
  process.exit(1);
}

const evalFiles = fs.readdirSync(evalDir).filter((name) => name.endsWith(".json"));
if (evalFiles.length === 0) {
  console.error("[ERROR] No eval files found in evals/.");
  process.exit(1);
}

let hasError = false;

for (const file of evalFiles) {
  const fullPath = path.join(evalDir, file);
  let data;

  try {
    data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    console.error(`[ERROR] ${file} is not valid JSON.`);
    console.error(String(error));
    hasError = true;
    continue;
  }

  for (const key of requiredTopLevel) {
    if (!(key in data)) {
      console.error(`[ERROR] ${file} is missing top-level key: ${key}`);
      hasError = true;
    }
  }

  if (data.schemaVersion !== "1.0") {
    console.error(`[ERROR] ${file} schemaVersion must be \"1.0\".`);
    hasError = true;
  }

  if (!capabilities.has(data.capability)) {
    console.error(`[ERROR] ${file} references unknown capability: ${data.capability}`);
    hasError = true;
  }

  if (!Array.isArray(data.qualityDimensions) || data.qualityDimensions.length < 3) {
    console.error(`[ERROR] ${file} must include at least 3 qualityDimensions.`);
    hasError = true;
  }

  if (!Array.isArray(data.cases) || data.cases.length === 0) {
    console.error(`[ERROR] ${file} must include at least one case.`);
    hasError = true;
    continue;
  }

  const ids = new Set();
  for (const [index, item] of data.cases.entries()) {
    for (const field of requiredCaseFields) {
      if (!(field in item)) {
        console.error(`[ERROR] ${file} case #${index + 1} is missing field: ${field}`);
        hasError = true;
      }
    }

    if (typeof item.id !== "string" || item.id.trim().length === 0) {
      console.error(`[ERROR] ${file} case #${index + 1} has invalid id.`);
      hasError = true;
    } else if (ids.has(item.id)) {
      console.error(`[ERROR] ${file} has duplicated case id: ${item.id}`);
      hasError = true;
    } else {
      ids.add(item.id);
    }

    if (typeof item.title !== "string" || item.title.trim().length < 10) {
      console.error(`[ERROR] ${file} case #${index + 1} title must be at least 10 characters.`);
      hasError = true;
    }

    if (typeof item.input !== "string" || item.input.trim().length < 20) {
      console.error(`[ERROR] ${file} case #${index + 1} input must be at least 20 characters.`);
      hasError = true;
    }

    if (typeof item.reasoning !== "string" || item.reasoning.trim().length < 20) {
      console.error(`[ERROR] ${file} case #${index + 1} reasoning must be at least 20 characters.`);
      hasError = true;
    }

    const expected = item.expected;
    if (typeof expected !== "object" || expected === null) {
      console.error(`[ERROR] ${file} case #${index + 1} expected must be an object.`);
      hasError = true;
      continue;
    }

    if (!Array.isArray(expected.mustInclude) || expected.mustInclude.length < 2) {
      console.error(`[ERROR] ${file} case #${index + 1} expected.mustInclude must contain at least 2 items.`);
      hasError = true;
    }

    if (!Array.isArray(expected.mustNotInclude) || expected.mustNotInclude.length < 1) {
      console.error(`[ERROR] ${file} case #${index + 1} expected.mustNotInclude must contain at least 1 item.`);
      hasError = true;
    }
  }

  console.log(`[OK] ${file}`);
}

if (hasError) {
  process.exitCode = 1;
} else {
  console.log(`Eval validation passed for ${evalFiles.length} files.`);
}
