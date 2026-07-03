# Hytale MCP — Developer & Architecture Guide

Welcome to the **Hytale MCP** developer documentation. This guide details the internal design, data flow, development workflow, and testing strategies of the Model Context Protocol (MCP) server for Hytale.

---

## ⚡ Design Philosophy: Cache-First & Offline

The core philosophy of this server is **zero-latency at tool execution time**. 

AI coding assistants (like Cursor, Windsurf, and Claude Code) make multiple tool calls in rapid succession. Web scraping or live API querying during tool execution would lead to slow responses, rate-limiting issues, and fragile runs if upstream sites go down.

### Key Rules
- **No live network calls inside tool handlers**: All database reads, documentation scrapes, and registry lookups must pull from the committed `data/` JSON directory.
- **Pre-fetched upstream data**: Upstream community wikis and repositories are fetched once at build-time using `scripts/build-cache.ts` and committed directly to the repository.
- **Fast runtime lookups**: JSON files are loaded synchronously at module initialization. Subsequent lookups are $O(1)$ in-memory operations.

---

## 🗺️ Data Flow

```
   ┌────────────────────┐
   │  Upstream Sources  │
   └─────────┬──────────┘
             │ (weekly CI / npm build)
             ▼
   ┌────────────────────┐
   │ scripts/build-cache│
   └─────────┬──────────┘
             │ (writes pre-built data)
             ▼
   ┌────────────────────┐
   │    data/*.json     │◀─── [npm publish package]
   └─────────┬──────────┘
             │
             │ (synchronous read at startup)
             ▼
   ┌────────────────────┐
   │   src/cache/*.ts   │
   └─────────┬──────────┘
             │
             ▼
   ┌────────────────────┐
   │   src/tools/*.ts   │◀─── [AI Assistant Tool Call]
   └─────────┬──────────┘
             │
             ▼
   ┌────────────────────┐
   │    MCP Response    │
   └────────────────────┘
```

---

## 📁 Codebase Layout

- **`src/index.ts`**: The registry only. It boots the server over STDIO and maps Zod input schemas to tool handlers. No business logic lives here.
- **`src/tools/`**: One file per tool (e.g. `list-events.ts`, `search-docs.ts`). Each tool exports its Zod input schema and a pure handler function returning an `MCPResult`.
- **`src/cache/`**: Synchronous typed data readers. Loads `data/*.json` and builds the `lunr.js` search index at startup.
- **`src/sources/`**: Data scraper adapters (e.g., `hytalemodding.ts`, `github.ts`). Used **only** by the cache builder script.
- **`src/scaffold/`**: Mustache templates (`.mustache`) for generating Hytale plugin files and pack directories.
- **`data/`**: Committed JSON database caches. This acts as the runtime source of truth.
- **`scripts/`**: Build scripts (`build-cache.ts`, `validate-data.ts`) run during development and CI.

---

## 🛠️ Developer Guide: How to Add a New Tool

To extend `Hytale Modding` with a new tool, follow this workflow:

### 1. Define the Tool Handler
Create `src/tools/my-new-tool.ts` and define:
- The input validation schema using `zod`.
- The handler logic (pure function, no side effects, pulling data from `src/cache/`).

```typescript
import { z } from "zod";
import { MCPResult } from "../types.js";
import { myCachedCollection } from "../cache/index.js";

export const MyNewToolInput = z.object({
  query: z.string(),
  limit: z.number().optional().default(3)
});

export async function myNewTool(input: z.infer<typeof MyNewToolInput>): Promise<MCPResult> {
  const results = myCachedCollection.filter(item => item.name.includes(input.query));
  return {
    content: [{ type: "text", text: JSON.stringify(results) }]
  };
}
```

### 2. Register the Tool
In `src/index.ts`, import the schema and handler, then register it:
```typescript
import { myNewTool, MyNewToolInput } from "./tools/my-new-tool.js";

server.tool("my_new_tool", MyNewToolInput.shape, async (args) => await myNewTool(args as any));
```

### 3. Add Unit Tests
Create `src/tools/__tests__/my-new-tool.test.ts` to test your tool logic using Vitest:
```typescript
import { describe, it, expect, vi } from "vitest";
import { myNewTool } from "../my-new-tool.js";

vi.mock("../../cache/index.js", () => ({
  myCachedCollection: [{ name: "hytale:item" }]
}));

describe("my_new_tool", () => {
  it("filters correctly", async () => {
    const res = await myNewTool({ query: "hytale" });
    expect(res.content[0].text).toContain("hytale:item");
  });
});
```

### 4. Update Rule Files & README
- Add the tool's name, input arguments, and description to the tools table in `README.md`.
- Add it to the reference table in `AGENTS.md`.

---

## 🧪 Testing & Validation

We enforce quality via three local stages (which run on every push in the CI pipeline):

### Linter & Typecheck
Ensure strict TypeScript typing and code cleanliness:
```bash
npm run typecheck   # Run tsc compiler check
npm run lint        # Verify code style and imports via ESLint
```

### Data Integrity Check
Validate that all committed cache files under `data/` are correct JSON structures:
```bash
npm run validate:data
```

### Unit & Integration Testing
We use **Vitest** for swift testing. The suite includes:
- Unit tests for all tool handlers using mock configurations.
- Integration tests in `test/integration.test.ts` that spin up the actual compiled MCP server and communicate with it using `@modelcontextprotocol/sdk/client` over standard I/O (STDIO).
```bash
npm run test        # Runs unit and integration suites
```

---

## 🚀 Roadmap

- **v1.1 — Pre-built search index**: Build and serialize the `lunr` index directly into `data/docs-index.json` during the cache build to reduce startup time.
- **v1.2 — Incremental cache updates**: Track ETags and last-modified headers in `meta.json` to scrape only updated endpoints.
- **v1.3 — MCP Resources**: Expose JSON databases as MCP Resources so client IDEs can explore raw registries directly.
