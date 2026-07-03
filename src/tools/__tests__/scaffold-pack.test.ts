import { describe, it, expect } from "vitest";
import { scaffoldPack } from "../scaffold-pack.js";

describe("scaffold_pack", () => {
  it("scaffolds pack files", async () => {
    const result = await scaffoldPack({ name: "MyPack", type: "block" });
    expect(result.content[0].text).toContain("MyPack");
    expect(result.content[0].text).toContain("pack.json");
  });
});
