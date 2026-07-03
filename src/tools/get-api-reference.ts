import { z } from "zod";
import { api } from "../cache/index.js";
import { MCPResult } from "../types.js";

export const GetApiReferenceInput = z.object({
  className: z.string()
});

export async function getApiReference(input: z.infer<typeof GetApiReferenceInput>): Promise<MCPResult> {
  const nameLower = input.className.toLowerCase();
  const cls = api.find(c => c.name.toLowerCase() === nameLower);
  
  if (!cls) {
    const similar = api.filter(c => c.name.toLowerCase().includes(nameLower)).map(c => c.name);
    let msg = `Class ${input.className} not found.`;
    if (similar.length > 0) {
      msg += ` Similar classes: ${similar.join(", ")}`;
    }
    return { content: [{ type: "text", text: msg }] };
  }
  
  let text = `# ${cls.name}\nPackage: \`${cls.package}\`\n\n${cls.description}\n\n## Methods\n`;
  for (const m of cls.methods) {
    text += `- \`${m.signature}\` - ${m.description}\n`;
  }
  
  return { content: [{ type: "text", text }] };
}
