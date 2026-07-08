#!/usr/bin/env node
/**
 * Validates GCP Cloud Build + Docker paths so Cloud Build step 1 does not exit 125.
 *
 * Exit 125 = docker CLI failure before build (invalid tag, missing Dockerfile, wrong context).
 *
 * Usage: node scripts/verify-gcp-docker-build-config.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const REQUIRED_FILES = [
  "Dockerfile",
  "cloudbuild.yaml",
  "deploy/gcp/Dockerfile.api",
  "deploy/gcp/cloudbuild.yaml",
  "deploy/gcp/cloudbuild.deploy.yaml",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "artifacts/api-server/package.json",
];

const FORBIDDEN_TAG_PATTERNS = [
  /\$SHORT_SHA\s*$/m, // tag ending with empty SHORT_SHA → invalid reference
  /:\s*$/m, // bare colon at EOL in tag line (heuristic)
];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function checkFiles() {
  const missing = REQUIRED_FILES.filter((f) => !fs.existsSync(path.join(ROOT, f)));
  if (missing.length) {
    console.error("[FAIL] missing files:", missing.join(", "));
    return false;
  }
  console.log("[PASS] required GCP/Docker files present");
  return true;
}

function checkDockerfileParity() {
  const root = read("Dockerfile");
  const gcp = read("deploy/gcp/Dockerfile.api");
  const markers = [
    "FROM node:24-bookworm-slim AS builder",
    'pnpm install --frozen-lockfile --filter "@workspace/api-server..."',
    "pnpm --filter @workspace/api-server run build",
    "/api/healthz",
    "dist/index.mjs",
  ];
  for (const m of markers) {
    if (!root.includes(m) || !gcp.includes(m)) {
      console.error("[FAIL] Dockerfile parity: marker missing in root or deploy/gcp:", m);
      return false;
    }
  }
  console.log("[PASS] root Dockerfile and deploy/gcp/Dockerfile.api are aligned");
  return true;
}

function checkCloudBuildUsesBuildId(rel) {
  const text = read(rel);
  if (!text.includes("$BUILD_ID")) {
    console.error(`[FAIL] ${rel}: must tag images with $BUILD_ID (SHORT_SHA alone causes exit 125)`);
    return false;
  }
  if (/\$SHORT_SHA/.test(text) && !/BUILD_ID/.test(text)) {
    console.error(`[FAIL] ${rel}: uses $SHORT_SHA without $BUILD_ID fallback`);
    return false;
  }
  // docker build must use repo-root context (.)
  if (!text.includes("\n      - .\n") && !text.includes("\n      - .\r\n")) {
    const hasDotContext = /-\s*\n\s*-\s*\./.test(text) || text.includes("- .");
    if (!hasDotContext) {
      console.error(`[FAIL] ${rel}: docker build context must be '.' (repository root)`);
      return false;
    }
  }
  console.log(`[PASS] ${rel}: uses $BUILD_ID and repo-root context`);
  return true;
}

function checkNoBareShortShaTags() {
  for (const rel of ["cloudbuild.yaml", "deploy/gcp/cloudbuild.yaml", "deploy/gcp/cloudbuild.deploy.yaml"]) {
    const text = read(rel);
    if (/:?\$SHORT_SHA\s*$/m.test(text)) {
      console.error(`[FAIL] ${rel}: image tag uses only $SHORT_SHA — use $BUILD_ID`);
      return false;
    }
  }
  console.log("[PASS] no bare $SHORT_SHA-only image tags in cloudbuild files");
  return true;
}

function checkDockerfilePathsInCloudBuild() {
  const rootCb = read("cloudbuild.yaml");
  if (!rootCb.includes("- Dockerfile")) {
    console.error("[FAIL] cloudbuild.yaml must use -f Dockerfile for Console /Dockerfile path");
    return false;
  }
  const gcpCb = read("deploy/gcp/cloudbuild.yaml");
  if (!gcpCb.includes("deploy/gcp/Dockerfile.api")) {
    console.error("[FAIL] deploy/gcp/cloudbuild.yaml must reference deploy/gcp/Dockerfile.api");
    return false;
  }
  console.log("[PASS] cloudbuild Dockerfile paths match documented Console settings");
  return true;
}

function main() {
  let ok = true;
  ok = checkFiles() && ok;
  ok = checkDockerfileParity() && ok;
  ok = checkCloudBuildUsesBuildId("cloudbuild.yaml") && ok;
  ok = checkCloudBuildUsesBuildId("deploy/gcp/cloudbuild.yaml") && ok;
  ok = checkCloudBuildUsesBuildId("deploy/gcp/cloudbuild.deploy.yaml") && ok;
  ok = checkNoBareShortShaTags() && ok;
  ok = checkDockerfilePathsInCloudBuild() && ok;

  if (ok) {
    console.log("\nGCP Docker/Cloud Build config OK. Use build context = repository root (.).");
    process.exit(0);
  }
  console.error("\nFix the issues above before running Cloud Build.");
  process.exit(1);
}

main();
