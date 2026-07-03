import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Integration tests", () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: "node",
      args: [join(__dirname, "../dist/index.js")]
    });

    client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
  }, 10000);

  afterAll(async () => {
    await transport.close();
  });

  it("calls list_events", async () => {
    const result = await client.callTool({
      name: "list_events",
      arguments: {}
    });
    const text = (result.content as any)[0].text;
    expect(text).toContain("PlayerJoinEvent");
  });

  it("calls search_docs", async () => {
    const result = await client.callTool({
      name: "search_docs",
      arguments: { query: "PlayerJoinEvent" }
    });
    const text = (result.content as any)[0].text;
    expect(text).toContain("PlayerJoin");
  });

  it("calls scaffold_plugin", async () => {
    const result = await client.callTool({
      name: "scaffold_plugin",
      arguments: { name: "TestPlugin", packageName: "org.test", features: ["events"] }
    });
    const text = (result.content as any)[0].text;
    expect(text).toContain("TestPlugin");
    expect(text).toContain("plugin.json");
  });

  it("calls validate_manifest", async () => {
    const json = JSON.stringify({ name: "A", version: "1.0", main: "Main", "api-version": "1.0" });
    const result = await client.callTool({
      name: "validate_manifest",
      arguments: { json }
    });
    const text = (result.content as any)[0].text;
    expect(text).toBe("✅ Manifest is valid");
  });
});
