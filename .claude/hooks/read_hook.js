#!/usr/bin/env node

// PostToolUse hook for Read
// Logs which files Claude is reading during a session.

import { readFileSync } from "fs";

const input = JSON.parse(readFileSync("/dev/stdin", "utf8"));
const { tool_name, tool_input } = input;

const filePath =
  tool_input.file_path ?? tool_input.path ?? tool_input.filePath ?? null;

process.stderr.write(
  `[read_hook] ${tool_name} → ${filePath ?? "(no path)"}\n`
);

process.exit(0);
