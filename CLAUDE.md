# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language; Claude generates React/JSX code using AI tools, and the result is rendered in a live iframe preview. Without an `ANTHROPIC_API_KEY`, the app falls back to a mock provider returning static components.

## Commands

```bash
npm run setup        # First-time setup: install deps + prisma generate + migrate
npm run dev          # Start dev server (Turbopack) at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run test         # Vitest (all tests)
npm run db:reset     # Reset SQLite database (destructive)
```

Run a single test file:
```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```

## Architecture

### Data Flow for Component Generation

1. User sends prompt via `ChatInterface` → `ChatContext` (wraps Vercel AI SDK `useChat`)
2. `ChatContext` POSTs to `/api/chat/route.ts` with the current virtual file system serialized as JSON
3. The API route calls Claude via `streamText()` with two AI tools: `str_replace_editor` and `file_manager`
4. Claude calls those tools to create/edit files; results stream back as tool call events
5. `FileSystemContext` processes tool calls to update the in-memory virtual file system (VFS)
6. `PreviewFrame` renders the VFS output in an iframe using Babel Standalone for JSX transpilation
7. On completion, the API route persists the project (messages + VFS state) to SQLite via Prisma

### Key Abstractions

**Virtual File System (`src/lib/file-system.ts`)**: An in-memory tree with no disk I/O. Serialized to JSON for database storage. The entry point for generated components is always `/App.jsx`.

**AI Tools (`src/lib/tools/`):**
- `str_replace_editor`: Zod-validated tool for creating/editing file content via string replacement
- `file_manager`: Zod-validated tool for rename/delete operations

**Provider (`src/lib/provider.ts`)**: Returns `anthropic('claude-haiku-4-5')` if `ANTHROPIC_API_KEY` is set, otherwise a `MockLanguageModel` that generates static components.

**Contexts:**
- `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`): Owns VFS state; exposes tool call processing
- `ChatContext` (`src/lib/contexts/chat-context.tsx`): Owns chat state; bridges Vercel AI SDK with FileSystemContext

### Auth

JWT-based (`jose` + `bcrypt`) with HttpOnly cookies. `src/lib/auth.ts` is server-only. Middleware at `src/middleware.ts` enforces session checks. Anonymous usage is supported — `anon-work-tracker.ts` prevents project loss on sign-up.

### UI Layout

`src/app/main-content.tsx` renders a two-panel resizable layout:
- Left (35%): `ChatInterface`
- Right (65%): Tabs for live `PreviewFrame` (iframe) and Monaco `CodeEditor` + `FileTree`

## Code Style

- Comments: only on complex or non-obvious logic.

## Path Aliases

`@/*` resolves to `./src/*` (configured in `tsconfig.json` and `components.json`).

## Database

Prisma with SQLite (`prisma/dev.db`). Reference `prisma/schema.prisma` for the authoritative data structure. After schema changes, run `npx prisma migrate dev`.

## Testing

Vitest with jsdom + React Testing Library. Tests live in `__tests__/` subdirectories alongside the code they test.
