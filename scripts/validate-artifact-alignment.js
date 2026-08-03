import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mcpeePath = path.join(root, "mcpee.json");

if (!fs.existsSync(mcpeePath)) {
  console.error("[ERROR] mcpee.json not found.");
  process.exit(1);
}

const mcpee = JSON.parse(fs.readFileSync(mcpeePath, "utf8"));
const capabilities = Array.isArray(mcpee.capabilities) ? mcpee.capabilities : [];

if (capabilities.length === 0) {
  console.error("[ERROR] mcpee.json capabilities must be a non-empty array.");
  process.exit(1);
}

const collectRefs = (key) => {
  const refs = new Set();
  for (const capability of capabilities) {
    const values = capability[key];
    if (Array.isArray(values)) {
      for (const value of values) {
        if (typeof value === "string" && value.trim().length > 0) {
          refs.add(value);
        }
      }
    }
  }
  return refs;
};

const toRepoPath = (dir, fileName) => `${dir}/${fileName}`;
const listFiles = (dir, extensionMatcher) => {
  const dirPath = path.join(root, dir);
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((name) => extensionMatcher(name))
    .map((name) => toRepoPath(dir, name));
};

const skillRefs = collectRefs("skills");
const specRefs = collectRefs("specs");
const promptRefs = collectRefs("prompts");
const evalRefs = collectRefs("evals");

const skillRoot = path.join(root, "skills");
const flatSkillFiles = fs.existsSync(skillRoot)
  ? fs.readdirSync(skillRoot).filter((name) => name.endsWith(".md"))
  : [];
const specs = listFiles("specs", (name) => name.endsWith(".md"));
const prompts = listFiles("prompts", (name) => name.endsWith(".prompt.md"));
const evals = listFiles("evals", (name) => name.endsWith(".json"));

const findUnreferenced = (allFiles, refSet) => allFiles.filter((file) => !refSet.has(file));

const unreferenced = {
  specs: findUnreferenced(specs, specRefs),
  prompts: findUnreferenced(prompts, promptRefs),
  evals: findUnreferenced(evals, evalRefs)
};

let hasError = false;

if (flatSkillFiles.length > 0) {
  hasError = true;
  console.error("[ERROR] Legacy flat skill files are not allowed. Use skills/<name>/SKILL.md:");
  for (const file of flatSkillFiles) {
    console.error(`  - skills/${file}`);
  }
}

for (const ref of skillRefs) {
  if (!/^skills\/[a-z0-9-]+\/SKILL\.md$/.test(ref)) {
    hasError = true;
    console.error(`[ERROR] Skill reference must follow skills/<name>/SKILL.md: ${ref}`);
  }
}

for (const [kind, files] of Object.entries(unreferenced)) {
  if (files.length > 0) {
    hasError = true;
    console.error(`[ERROR] Unreferenced ${kind} files:`);
    for (const file of files) {
      console.error(`  - ${file}`);
    }
  }
}

if (hasError) {
  process.exitCode = 1;
} else {
  console.log("Artifact alignment validation passed: all skills/specs/prompts/evals are referenced.");
}
