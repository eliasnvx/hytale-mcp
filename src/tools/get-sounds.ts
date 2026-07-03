import { z } from "zod";
import { sounds } from "../cache/index.js";
import { MCPResult } from "../types.js";

export const GetSoundsInput = z.object({
  query: z.string().optional(),
  category: z.string().optional()
});

export async function getSounds(input: z.infer<typeof GetSoundsInput>): Promise<MCPResult> {
  let filtered = sounds;
  
  if (input.category) {
    filtered = filtered.filter(s => s.category === input.category);
  }
  
  if (input.query) {
    const q = input.query.toLowerCase();
    filtered = filtered.filter(s => s.key.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)));
  }
  
  if (filtered.length === 0) {
    return { content: [{ type: "text", text: "No sounds found." }] };
  }
  
  let text = `| Key | Category | Description |\n|---|---|---|\n`;
  for (const s of filtered) {
    text += `| ${s.key} | ${s.category} | ${s.description || ""} |\n`;
  }
  
  return { content: [{ type: "text", text }] };
}
