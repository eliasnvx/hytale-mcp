import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { searchDocs, SearchDocsInput } from "./tools/search-docs.js";
import { getApiReference, GetApiReferenceInput } from "./tools/get-api-reference.js";
import { listEvents, ListEventsInput } from "./tools/list-events.js";
import { getEntities, GetEntitiesInput } from "./tools/get-entities.js";
import { searchBlocks, SearchBlocksInput } from "./tools/search-blocks.js";
import { scaffoldPlugin, ScaffoldPluginInput } from "./tools/scaffold-plugin.js";
import { scaffoldPack, ScaffoldPackInput } from "./tools/scaffold-pack.js";
import { getExamples, GetExamplesInput } from "./tools/get-examples.js";
import { validateManifest, ValidateManifestInput } from "./tools/validate-manifest.js";
import { getSounds, GetSoundsInput } from "./tools/get-sounds.js";
import { getChangelog, GetChangelogInput } from "./tools/get-changelog.js";

const server = new McpServer({
  name: "Hytale Modding",
  version: "1.0.0"
});

server.tool("search_docs", SearchDocsInput.shape, async (args) => await searchDocs(args as any));
server.tool("get_api_reference", GetApiReferenceInput.shape, async (args) => await getApiReference(args as any));
server.tool("list_events", ListEventsInput.shape, async (args) => await listEvents(args as any));
server.tool("get_entities", GetEntitiesInput.shape, async (args) => await getEntities(args as any));
server.tool("search_blocks", SearchBlocksInput.shape, async (args) => await searchBlocks(args as any));
server.tool("scaffold_plugin", ScaffoldPluginInput.shape, async (args) => await scaffoldPlugin(args as any));
server.tool("scaffold_pack", ScaffoldPackInput.shape, async (args) => await scaffoldPack(args as any));
server.tool("get_examples", GetExamplesInput.shape, async (args) => await getExamples(args as any));
server.tool("validate_manifest", ValidateManifestInput.shape, async (args) => await validateManifest(args as any));
server.tool("get_sounds", GetSoundsInput.shape, async (args) => await getSounds(args as any));
server.tool("get_changelog", GetChangelogInput.shape, async (args) => await getChangelog(args as any));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("hytale-mcp server started");
}

main().catch(console.error);
