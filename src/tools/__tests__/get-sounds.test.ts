import { describe, it, expect, vi } from "vitest";
import { getSounds } from "../get-sounds.js";

vi.mock("../../cache/index.js", () => ({
  sounds: [
    { key: "sound.1", category: "test", description: "test sound" }
  ]
}));

describe("get_sounds", () => {
  it("returns sounds", async () => {
    const result = await getSounds({ query: "sound" });
    expect(result.content[0].text).toContain("sound.1");
  });
});
