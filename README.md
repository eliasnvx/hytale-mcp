# hytale-mcp

MCP server for Hytale mod development. Provides docs search, Java API reference,
event/entity/block lookup, plugin and pack scaffolding, and manifest validation to
AI coding assistants over the Model Context Protocol.

Works with Claude Code, Claude Desktop, Antigravity, Cursor, Windsurf, Codex, and any
MCP-compatible client.

[![CI](https://github.com/eliasnvx/hytale-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/eliasnvx/hytale-mcp/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@eliasnvx/hytale-mcp.svg)](https://www.npmjs.com/package/@eliasnvx/hytale-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/node/v/@eliasnvx/hytale-mcp.svg)](package.json)

## Why

Hytale entered Early Access in January 2026 with modding built into the platform from
day one. Documentation is spread across the official site, a community GitBook, and
several GitHub organizations. This server consolidates all of it into a single set of
tools so an AI assistant can answer Hytale modding questions and generate boilerplate
without the developer switching tabs.

## Install

No installation step is required. Add the server to your MCP client configuration and
it runs via `npx` on demand.

### Claude Desktop

Edit the config file for your OS:

| OS | Path |
|---|---|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

```json
{
  "mcpServers": {
    "hytale-mcp": {
      "command": "npx",
      "args": ["-y", "@eliasnvx/hytale-mcp"]
    }
  }
}
```

Restart Claude Desktop completely (quit, not just close the window) after saving.

### Claude Code

```bash
claude mcp add hytale-mcp -- npx -y @eliasnvx/hytale-mcp
```

### Antigravity, Cursor, Windsurf

Add the same `mcpServers` block shown above to the client's MCP configuration file or
through its built-in connector UI.

### Codex CLI

```bash
codex mcp add hytale-mcp -- npx -y @eliasnvx/hytale-mcp
```

## Tools

| Tool | Inputs | Description |
|---|---|---|
| `search_docs` | `query: string, limit?: number` | Full-text search across all cached Hytale modding documentation |
| `get_api_reference` | `className: string` | Java class and method reference from the server API |
| `list_events` | `type?: "sync"\|"async"\|"ecs", query?: string` | Browse all events, optionally filtered by type |
| `get_entities` | `category?: "hostile"\|"passive"\|"neutral"\|"boss", query?: string` | NPC and entity registry, optionally filtered by category |
| `search_blocks` | `query: string, category?: string` | Block and item registry search |
| `scaffold_plugin` | `name: string, packageName: string, features: ("events"\|"commands"\|"config"\|"scheduler"\|"entities")[]` | Generate a plugin skeleton (manifest, main class, Gradle build) |
| `scaffold_pack` | `name: string, type: "block"\|"item"\|"entity"\|"world", description?: string` | Generate a pack skeleton |
| `get_examples` | `topic: string` | Code examples by topic, sourced from community repositories |
| `validate_manifest` | `json: string, type?: "plugin"\|"pack"` | Validate a `plugin.json` or pack manifest against required fields |
| `get_sounds` | `query?: string, category?: string` | Sound key registry, optionally filtered by category |
| `get_changelog` | `since?: string` | Recent Hytale server API changes |
| `analyze_error` | `log: string` | Analyze a stack trace against known engine errors |
| `get_lore` | `query?: string, type?: string, faction?: string` | Search Hytale lore (mobs, items, stats) |

## Example

Once connected, ask your AI assistant something like:

> What events fire when a player breaks a block, and show me a plugin that logs it.

The assistant calls `search_docs` and `list_events` to find `BlockBreakEvent`, then
`scaffold_plugin` to generate a working plugin skeleton with an event listener wired in.

## Architecture & Documentation

All data is pre-fetched at build time and cached to `data/*.json`. Tool handlers never make network calls — they read from the committed cache, so responses are fast and the server has no runtime dependency on upstream sites being reachable.

```
[upstream sources] --build time--> scripts/build-cache.ts --> data/*.json
                                                                     |
                                                         src/tools/*.ts --> MCP response
```

For detailed codebase breakdown, developer setup, a step-by-step tutorial on adding tools, and CI/CD pipelines, check out the **[Developer & Architecture Guide](docs/architecture.md)**.

## Development

```bash
git clone https://github.com/eliasnvx/hytale-mcp.git
cd hytale-mcp
npm install

npm run dev          # start with hot reload
npm run test          # run the test suite
npm run typecheck     # type-check without emitting
npm run lint           # lint src/
npm run inspect        # open MCP Inspector against the built server
npm run cache:build    # rebuild data/ from upstream sources
```

Requires Node.js 22 or later.

### Adding a tool

1. Create `src/tools/<name>.ts` with a zod input schema and an async handler
2. Add a test in `src/tools/__tests__/<name>.test.ts`
3. Register the tool in `src/index.ts`
4. Update the tool table in this README and in `AGENTS.md`

See [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) for the full rule set followed by
AI assistants contributing to this repository.

## Data sources

- [hytalemodding.dev](https://hytalemodding.dev) — events, entities, interactions, sounds
- [Britakee Studios GitBook](https://britakee-studios.gitbook.io/hytale-modding-documentation) — plugin and pack tutorials
- [github.com/HytaleModding](https://github.com/HytaleModding) — plugin template, decompiled source browser
- [hytale-docs.com](https://hytale-docs.com) — community API reference

This project is not affiliated with Hypixel Studios. Data is derived from community
documentation and may lag behind the latest Early Access build.

## Contributing

Issues and pull requests are welcome. Please run `npm run typecheck && npm run test`
before opening a PR — CI enforces both on every push.

## License

[MIT](LICENSE)

## Author

[@eliasnvx](https://github.com/eliasnvx) — [vyxro.dev](https://vyxro.dev)