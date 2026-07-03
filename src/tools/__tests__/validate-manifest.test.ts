import { describe, it, expect } from "vitest";
import { validateManifest } from "../validate-manifest.js";

describe("validate_manifest", () => {
  it("validates a correct plugin manifest", async () => {
    const json = JSON.stringify({ name: "A", version: "1.0", main: "Main", "api-version": "1.0" });
    const result = await validateManifest({ json, type: "plugin" });
    expect(result.content[0].text).toBe("✅ Manifest is valid");
  });

  it("returns errors for missing fields in plugin", async () => {
    const json = JSON.stringify({ name: "A" });
    const result = await validateManifest({ json, type: "plugin" });
    expect(result.content[0].text).toContain("Missing required field: version");
  });

  it("validates a correct pack manifest automatically", async () => {
    const json = JSON.stringify({ format_version: 1, header: { name: "P", uuid: "id", version: [1,0,0] } });
    const result = await validateManifest({ json });
    expect(result.content[0].text).toBe("✅ Manifest is valid");
  });

  it("returns errors for bad JSON", async () => {
    const result = await validateManifest({ json: "{ bad json" });
    expect(result.content[0].text).toContain("Invalid JSON");
  });
});
