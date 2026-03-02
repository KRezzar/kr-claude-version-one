import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state = "call",
  result?: unknown
) {
  return { toolName, args, state, result };
}

test("str_replace_editor / create shows 'Creating App.jsx'", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" })}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("str_replace_editor / str_replace shows 'Editing utils.ts'", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/utils.ts" })}
    />
  );
  expect(screen.getByText("Editing utils.ts")).toBeDefined();
});

test("str_replace_editor / view shows 'Viewing index.tsx'", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/index.tsx" })}
    />
  );
  expect(screen.getByText("Viewing index.tsx")).toBeDefined();
});

test("str_replace_editor / undo_edit shows 'Editing ...'", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "undo_edit", path: "/foo.tsx" })}
    />
  );
  expect(screen.getByText("Editing foo.tsx")).toBeDefined();
});

test("file_manager / rename shows 'Renaming old.tsx'", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/old.tsx" })}
    />
  );
  expect(screen.getByText("Renaming old.tsx")).toBeDefined();
});

test("file_manager / delete shows 'Deleting old.tsx'", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/old.tsx" })}
    />
  );
  expect(screen.getByText("Deleting old.tsx")).toBeDefined();
});

test("unknown tool shows 'Running tool'", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation("unknown_tool", {})}
    />
  );
  expect(screen.getByText("Running tool")).toBeDefined();
});

test("pending state shows spinner and no green dot", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "call")}
    />
  );
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeNull();
});

test("done state shows green dot and no spinner", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "result", { ok: true })}
    />
  );
  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeNull();
});
