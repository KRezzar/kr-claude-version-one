#!/usr/bin/env node

// PostToolUse hook for Write|Edit|MultiEdit
// Runs TypeScript type-checking after file changes and reports errors.

import { readFileSync } from "fs";
import { execSync } from "child_process";

const input = JSON.parse(readFileSync("/dev/stdin", "utf8"));
const filePath =
  input.tool_input?.file_path ??
  input.tool_input?.path ??
  input.tool_input?.filePath ??
  null;

// Only run tsc for TypeScript files
if (filePath && !/\.(ts|tsx)$/.test(filePath)) {
  process.exit(0);
}

try {
  execSync("npx tsc --noEmit", { stdio: "pipe" });
  process.stderr.write("[tsc] No type errors.\n");
} catch (err) {
  const output = err.stdout?.toString() ?? err.message;
  process.stderr.write(`[tsc] Type errors found:\n${output}\n`);
}

process.exit(0);
