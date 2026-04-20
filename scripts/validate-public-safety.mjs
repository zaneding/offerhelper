import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function fail(message) {
  console.error(`Public safety validation failed: ${message}`);
  process.exit(1);
}

function read(pathname) {
  return readFileSync(resolve(root, pathname), "utf8");
}

if (!existsSync(resolve(root, ".gitignore"))) {
  fail("missing .gitignore");
}

const gitignore = read(".gitignore");
const requiredIgnoreEntries = [
  "references/candidate-profile.md",
  "references/resume-layout-map.md",
  "references/private-config.md",
  "private/",
  ".private/",
];

for (const entry of requiredIgnoreEntries) {
  if (!gitignore.includes(entry)) {
    fail(`.gitignore is missing required ignore entry: ${entry}`);
  }
}

const tracked = execFileSync("git", ["ls-files"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const presentTracked = tracked.filter((pathname) => {
  const fullPath = resolve(root, pathname);
  return existsSync(fullPath) && statSync(fullPath).isFile();
});

const forbiddenTrackedPaths = new Set([
  "references/candidate-profile.md",
  "references/canva-layout-map.md",
  "references/private-config.example.md",
]);

for (const pathname of presentTracked) {
  if (forbiddenTrackedPaths.has(pathname)) {
    fail(`forbidden tracked path still present: ${pathname}`);
  }
}

const exemptFromContentScan = new Set([
  "scripts/validate-public-safety.mjs",
]);

const forbiddenMarkers = [
  { pattern: /Zijian Ding/i, label: "full name marker" },
  { pattern: /https?:\/\/www\.canva\.com\/d\//i, label: "Canva edit URL" },
  { pattern: /DAHHVMTPJIg/, label: "private design ID" },
  { pattern: /DAHHVLmJjNQ/, label: "old private design ID" },
  { pattern: /PBRmJK6zMjKljv3w/, label: "private page ID" },
  { pattern: /MAHHVDYfg2E/, label: "private asset ID" },
  { pattern: /Yer Deutschland/i, label: "private employer detail" },
  { pattern: /Dräxlmaier/i, label: "private employer detail" },
  { pattern: /Technische Universität Berlin/i, label: "private education detail" },
  { pattern: /references\/canva-layout-map\.md/i, label: "old private layout filename" },
];

for (const pathname of presentTracked) {
  if (exemptFromContentScan.has(pathname)) {
    continue;
  }

  if (pathname.endsWith(".png") || pathname.endsWith(".jpg") || pathname.endsWith(".jpeg") || pathname.endsWith(".pdf")) {
    continue;
  }

  const content = read(pathname);
  for (const marker of forbiddenMarkers) {
    if (marker.pattern.test(content)) {
      fail(`found ${marker.label} in ${pathname}`);
    }
  }
}

console.log("Public safety validation passed.");
