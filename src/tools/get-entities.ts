import { z } from "zod";
import { entities } from "../cache/index.js";
import { MCPResult } from "../types.js";

export const GetEntitiesInput = z.object({
  category: z.enum(["hostile", "passive", "neutral", "boss"]).optional(),
  query: z.string().optional()
});

export async function getEntities(input: z.infer<typeof GetEntitiesInput>): Promise<MCPResult> {
  let filtered = entities;
  
  if (input.category) {
    filtered = filtered.filter(e => e.category === input.category);
  }
  
  if (input.query) {
    const q = input.query.toLowerCase();
    filtered = filtered.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
  }
  
  if (filtered.length === 0) {
    return { content: [{ type: "text", text: "No entities found." }] };
  }
  
  let text = `| ID | Name | Category | Description |\n|---|---|---|---|\n`;
  for (const e of filtered) {
    text += `| ${e.id} | ${e.name} | ${e.category} | ${e.description} |\n`;
  }
  
  return { content: [{ type: "text", text }] };
}
