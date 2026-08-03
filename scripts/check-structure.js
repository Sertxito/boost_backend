import fs from "node:fs";

const requiredFiles = [
  "README.md",
  "LICENSE",
  ".github/CODEOWNERS",
  "package.json",
  "mcpee.json"
];

const requiredReadmeSections = ["## Overview", "## Quick Start"];

let hasError = false;

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`[ERROR] Missing required file: ${file}`);
    hasError = true;
  } else {
    console.log(`[OK] Found required file: ${file}`);
  }
}

if (fs.existsSync("README.md")) {
  const readme = fs.readFileSync("README.md", "utf8");
  for (const section of requiredReadmeSections) {
    if (!readme.includes(section)) {
      console.error(`[ERROR] README is missing required section: ${section}`);
      hasError = true;
    } else {
      console.log(`[OK] README contains section: ${section}`);
    }
  }
}

if (!fs.existsSync("docs")) {
  console.error("[ERROR] Missing docs directory referenced by package files.");
  hasError = true;
} else {
  console.log("[OK] docs directory exists.");
}

if (hasError) {
  process.exitCode = 1;
} else {
  console.log("Structure checks passed.");
}
