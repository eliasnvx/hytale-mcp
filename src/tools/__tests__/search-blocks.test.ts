import { describe, it, expect, vi } from "vitest";
import { searchBlocks } from "../search-blocks.js";

vi.mock("../../cache/index.js", () => ({
  blocks: [
    { id: "hytale:dirt", name: "Dirt", category: "terrain" }
  ]
}));

describe("search_blocks", () => {
  it("returns blocks", async () => {
    const result = await searchBlocks({ query: "dirt" });
    expect(result.content[0].text).toContain("Dirt");
  });
});
