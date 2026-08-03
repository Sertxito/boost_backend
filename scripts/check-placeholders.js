import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const targets = [
  "skills",
  "specs",
  "prompts",
  "evals",
  "examples",
  "README.md",
  "docs"
];

const blockedPatterns = [
  "To be completed",
  "Pending case",
  "Describe the user request here",
  "Pendiente de rellenar",
  "Prompt de composicion para ejecucion runtime"
];

const includeExtensions = new Set([".md", ".json"]);

function walk(fileOrDir, collector) {
  if (!fs.existsSync(fileOrDir)) {
    return;
  }

  const stat = fs.statSync(fileOrDir);
  if (stat.isFile()) {
    collector.push(fileOrDir);
    return;
  }

  for (const entry of fs.readdirSync(fileOrDir)) {
    walk(path.join(fileOrDir, entry), collector);
  }
}

const files = [];
for (const target of targets) {
  walk(path.join(root, target), files);
}

let hasError = false;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!includeExtensions.has(ext)) {
    continue;
  }

  const content = fs.readFileSync(file, "utf8");
  for (const pattern of blockedPatterns) {
    if (content.includes(pattern)) {
      const rel = path.relative(root, file).replaceAll("\\", "/");
      console.error(`[ERROR] Placeholder pattern \"${pattern}\" found in ${rel}`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exitCode = 1;
} else {
  console.log("No blocked placeholder patterns found.");
}
