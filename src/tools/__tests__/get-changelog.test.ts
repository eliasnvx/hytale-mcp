import { describe, it, expect, vi } from "vitest";
import { getChangelog } from "../get-changelog.js";

vi.mock("../../cache/index.js", () => ({
  changelog: [
    { version: "1.0", date: "2026", changes: [{ type: "added", description: "test" }] }
  ]
}));

describe("get_changelog", () => {
  it("returns changelog", async () => {
    const result = await getChangelog({});
    expect(result.content[0].text).toContain("1.0");
    expect(result.content[0].text).toContain("test");
  });
});
