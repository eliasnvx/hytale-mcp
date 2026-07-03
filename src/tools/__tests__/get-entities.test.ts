import { describe, it, expect, vi } from "vitest";
import { getEntities } from "../get-entities.js";

vi.mock("../../cache/index.js", () => ({
  entities: [
    { id: "hytale:trork", name: "Trork", category: "hostile", description: "A trork" }
  ]
}));

describe("get_entities", () => {
  it("returns entities", async () => {
    const result = await getEntities({});
    expect(result.content[0].text).toContain("Trork");
  });
});
