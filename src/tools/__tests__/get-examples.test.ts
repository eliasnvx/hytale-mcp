import { describe, it, expect, vi } from "vitest";
import { getExamples } from "../get-examples.js";

vi.mock("../../cache/index.js", () => ({
  examples: [
    { topic: "hello", title: "Hello World", code: "print()", source: "github" }
  ]
}));

describe("get_examples", () => {
  it("returns examples", async () => {
    const result = await getExamples({ topic: "hello" });
    expect(result.content[0].text).toContain("Hello World");
  });
});
