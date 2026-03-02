#!/usr/bin/env node

// PreToolUse hook for Write|Edit|MultiEdit
// Reads stdin, logs the tool call, and optionally blocks based on rules.

import { readFileSync } from "fs";

const input = JSON.parse(readFileSync("/dev/stdin", "utf8"));
const { tool_name, tool_input } = input;

const filePath =
  tool_input.file_path ?? tool_input.path ?? tool_input.filePath ?? null;

process.stderr.write(
  `[query_hook] ${tool_name} → ${filePath ?? "(no path)"}\n`
);

// Add blocking rules here if needed, e.g.:
// if (filePath?.includes("prisma/schema.prisma")) {
//   console.log(JSON.stringify({ action: "block", message: "Schema edits require manual review." }));
//   process.exit(2);
// }

process.exit(0);
