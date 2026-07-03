import { describe, it, expect } from "vitest";
import { scaffoldPlugin } from "../scaffold-plugin.js";

describe("scaffold_plugin", () => {
  it("scaffolds plugin files", async () => {
    const result = await scaffoldPlugin({ name: "MyPlugin", packageName: "org.test", features: ["events"] });
    expect(result.content[0].text).toContain("MyPlugin");
    expect(result.content[0].text).toContain("plugin.json");
    expect(result.content[0].text).toContain("build.gradle.kts");
  });
});
