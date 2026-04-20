import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const readmePath = resolve(root, "README.md");

function fail(message) {
  console.error(`README validation failed: ${message}`);
  process.exit(1);
}

function assertIncludes(content, snippet, label) {
  if (!content.includes(snippet)) {
    fail(`missing ${label}`);
  }
}

function assertExists(pathname) {
  const fullPath = resolve(root, pathname);
  if (!existsSync(fullPath)) {
    fail(`referenced path does not exist: ${pathname}`);
  }
}

if (!existsSync(readmePath)) {
  fail("README.md not found");
}

const readme = readFileSync(readmePath, "utf8");

const requiredSnippets = [
  ["# OfferHelper", "main title"],
  ['<a href="#中文">中文</a> · <a href="#english">English</a>', "language switch links"],
  ["```mermaid", "mermaid workflow block"],
  ['<details open>', "open Chinese details block"],
  ['<summary><strong>中文</strong></summary>', "Chinese summary block"],
  ['<summary><strong>English</strong></summary>', "English summary block"],
  ['<a id="中文"></a>', "Chinese anchor"],
  ['<a id="english"></a>', "English anchor"],
  ["## 快速开始", "Chinese quick start section"],
  ["## Quick Start", "English quick start section"],
  ["## FAQ", "FAQ section"],
  ["Public repo ships no personal data", "public/private split note"],
  ["/plugin marketplace add offerhelper github:zaneding/offerhelper", "marketplace install command"],
  ["/plugin install offerhelper@offerhelper", "plugin install command"],
];

for (const [snippet, label] of requiredSnippets) {
  assertIncludes(readme, snippet, label);
}

const detailsOpenCount = (readme.match(/^\s*<details(?:\s+open)?>\s*$/gm) || []).length;
const detailsCloseCount = (readme.match(/^\s*<\/details>\s*$/gm) || []).length;

if (detailsOpenCount !== 2 || detailsCloseCount !== 2) {
  fail(`expected 2 details blocks, found open=${detailsOpenCount}, close=${detailsCloseCount}`);
}

const referencedPaths = [
  ".claude-plugin/plugin.json",
  ".gitignore",
  "LICENSE",
  "README.md",
  "package.json",
  "scripts/validate-readme.mjs",
  "scripts/validate-public-safety.mjs",
  "skills/offerhelper/SKILL.md",
  "skills/offerhelper/references/candidate-profile-template.md",
  "skills/offerhelper/references/private-config.example.md",
  "skills/offerhelper/references/resume-layout-map-template.md",
];

for (const pathname of referencedPaths) {
  assertExists(pathname);
}

console.log("README validation passed.");
