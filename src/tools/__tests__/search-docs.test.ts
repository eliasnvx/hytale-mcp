import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchDocs } from "../search-docs.js";
import * as searchIndex from "../../cache/search-index.js";

vi.mock("../../cache/search-index.js", () => ({
  searchDocs: vi.fn()
}));

describe("search_docs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns results formatted as markdown", async () => {
    vi.mocked(searchIndex.searchDocs).mockReturnValue([
      { id: "event_PlayerJoinEvent", title: "PlayerJoinEvent (Event)", body: "Fired when a player joins player", url: "url", source: "hytalemodding" }
    ]);
    
    const result = await searchDocs({ query: "join", limit: 5 });
    expect(result.content[0].text).toContain("PlayerJoinEvent");
  });

  it("returns message when no results found", async () => {
    vi.mocked(searchIndex.searchDocs).mockReturnValue([]);
    const result = await searchDocs({ query: "unknown", limit: 5 });
    expect(result.content[0].text).toBe("No results found.");
  });
});
