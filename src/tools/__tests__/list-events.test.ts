import { describe, it, expect, vi } from "vitest";
import { listEvents } from "../list-events.js";

vi.mock("../../cache/index.js", () => ({
  events: [
    { name: "PlayerJoin", type: "sync", description: "join", fields: [] }
  ]
}));

describe("list_events", () => {
  it("returns events", async () => {
    const result = await listEvents({});
    expect(result.content[0].text).toContain("PlayerJoin");
  });
});
