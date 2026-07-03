import { describe, it, expect, vi } from "vitest";
import { getApiReference } from "../get-api-reference.js";

vi.mock("../../cache/index.js", () => ({
  api: [
    { name: "IPlayer", package: "dev.hytale", description: "Player", methods: [{ name: "getName", signature: "String getName()", description: "Gets name" }] }
  ]
}));

describe("get_api_reference", () => {
  it("returns class details if found", async () => {
    const result = await getApiReference({ className: "IPlayer" });
    expect(result.content[0].text).toContain("IPlayer");
    expect(result.content[0].text).toContain("String getName()");
  });

  it("suggests similar classes if not found", async () => {
    const result = await getApiReference({ className: "Player" });
    expect(result.content[0].text).toContain("Class Player not found");
    expect(result.content[0].text).toContain("Similar classes: IPlayer");
  });
});
