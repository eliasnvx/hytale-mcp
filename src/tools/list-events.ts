import { z } from "zod";
import { events } from "../cache/index.js";
import { MCPResult } from "../types.js";

export const ListEventsInput = z.object({
  type: z.enum(["sync", "async", "ecs"]).optional(),
  query: z.string().optional()
});

export async function listEvents(input: z.infer<typeof ListEventsInput>): Promise<MCPResult> {
  let filtered = events;
  
  if (input.type) {
    filtered = filtered.filter(e => e.type === input.type);
  }
  
  if (input.query) {
    const q = input.query.toLowerCase();
    filtered = filtered.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
  }
  
  if (filtered.length === 0) {
    return { content: [{ type: "text", text: "No events found." }] };
  }
  
  let text = `| Name | Type | Description |\n|---|---|---|\n`;
  for (const e of filtered) {
    text += `| ${e.name} | ${e.type} | ${e.description} |\n`;
  }
  
  return { content: [{ type: "text", text }] };
}
