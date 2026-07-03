import { z } from "zod";
import { blocks } from "../cache/index.js";
import { MCPResult } from "../types.js";

export const SearchBlocksInput = z.object({
  query: z.string(),
  category: z.string().optional()
});

export async function searchBlocks(input: z.infer<typeof SearchBlocksInput>): Promise<MCPResult> {
  let filtered = blocks;
  
  if (input.category) {
    filtered = filtered.filter(b => b.category === input.category);
  }
  
  if (input.query) {
    const q = input.query.toLowerCase();
    filtered = filtered.filter(b => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  }
  
  if (filtered.length === 0) {
    return { content: [{ type: "text", text: "No blocks found." }] };
  }
  
  let text = `| ID | Name | Category |\n|---|---|---|\n`;
  for (const b of filtered) {
    text += `| ${b.id} | ${b.name} | ${b.category} |\n`;
  }
  
  return { content: [{ type: "text", text }] };
}
