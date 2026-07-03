import { describe, it, expect, vi } from "vitest";
import { analyzeError } from "../analyze-error.js";

vi.mock("../../cache/index.js", () => ({
  knownErrors: [
    {
      id: "pickup-item-null-target-ref",
      exceptionType: "java.lang.NullPointerException",
      classPattern: "PickupItemSystem",
      methodPattern: "tick",
      title: "Null target reference in PickupItemSystem",
      cause: "A `PickupItemComponent` was created without using the constructors that set `targetRef`",
      status: "fixed",
      recommendation: "Ensure `PickupItemComponent` is always created via its constructor.",
      source: "https://github.com/John-Willikers/hyfixes"
    },
    {
      id: "duplicate-block-component",
      exceptionType: "java.lang.IllegalArgumentException",
      classPattern: "BlockComponentChunk",
      methodPattern: "addEntityReference",
      title: "Duplicate block component registration",
      cause: "A duplicate block component was detected.",
      status: "known-unfixed",
      recommendation: "Avoid registering the same block component twice on one block entity.",
      source: "https://github.com/John-Willikers/hyfixes"
    },
    {
      id: "generic-system-tick",
      exceptionType: "java.lang.NullPointerException",
      classPattern: "System",
      methodPattern: "tick",
      title: "Generic System Tick",
      cause: "A tick failed",
      status: "known-unfixed",
      recommendation: "Fix the tick",
      source: "https://example.com"
    },
    {
      id: "another-npe",
      exceptionType: "java.lang.NullPointerException",
      classPattern: "PickupItemSystem",
      methodPattern: "tick",
      title: "Another NPE",
      cause: "Another cause",
      status: "fixed",
      recommendation: "Fix it",
      source: "https://example.com"
    },
    {
      id: "yet-another-npe",
      exceptionType: "java.lang.NullPointerException",
      classPattern: "PickupItemSystem",
      methodPattern: "tick",
      title: "Yet Another NPE",
      cause: "Yet Another cause",
      status: "fixed",
      recommendation: "Fix it",
      source: "https://example.com"
    }
  ]
}));

describe("analyze_error", () => {
  it("exact match on PickupItemSystem.tick NPE returns entry #1", async () => {
    const log = `java.lang.NullPointerException: some message
	at com.hypixel.hytale.systems.PickupItemSystem.tick(PickupItemSystem.java:45)`;
    
    const result = await analyzeError({ log });
    expect(result.content[0].text).toContain("Null target reference in PickupItemSystem");
    expect(result.content[0].text).toContain("Found"); // Could be multiple, but entry #1 is included
  });

  it("log with no recognizable Hytale class returns the 'no match' response", async () => {
    const log = `java.lang.NullPointerException: some message
	at com.random.lib.RandomClass.doThing(RandomClass.java:10)`;
    
    const result = await analyzeError({ log });
    expect(result.content[0].text).toContain("No known patterns matched your log");
  });

  it("log matching multiple patterns returns ranked list capped at 3", async () => {
    const log = `java.lang.NullPointerException: some message
	at com.hypixel.hytale.systems.PickupItemSystem.tick(PickupItemSystem.java:45)`;
    
    const result = await analyzeError({ log });
    // This will match 'pickup-item-null-target-ref', 'generic-system-tick', 'another-npe', 'yet-another-npe'
    // They should be capped at 3.
    const text = result.content[0].text;
    expect(text).toContain("Found 3 possible matches");
    
    // Make sure we have 3 recommendations output
    const recCount = (text.match(/\*\*Recommendation:\*\*/g) || []).length;
    expect(recCount).toBe(3);
  });

  it("empty string input returns a validation error", async () => {
    const result = await analyzeError({ log: "" });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Error: No log provided");
  });
});
