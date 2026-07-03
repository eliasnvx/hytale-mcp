import { z } from "zod";
import Mustache from "mustache";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MCPResult } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ScaffoldPackInput = z.object({
  name: z.string(),
  type: z.enum(["block", "item", "entity", "world"]),
  description: z.string().optional()
});

function renderTemplate(name: string, view: any): string {
  const tpl = readFileSync(join(__dirname, "../../src/scaffold/templates", name), "utf8");
  return Mustache.render(tpl, view);
}

export async function scaffoldPack(input: z.infer<typeof ScaffoldPackInput>): Promise<MCPResult> {
  const view = {
    name: input.name,
    type: input.type,
    description: input.description || "A Hytale pack",
    uuid: "11111111-2222-3333-4444-555555555555",
    moduleUuid: "66666666-7777-8888-9999-aaaaaaaaaaaa"
  };
  
  const manifest = renderTemplate("pack-manifest.mustache", view);
  
  let text = `Here is the scaffolded pack for ${input.name}:\n\n`;
  text += `### pack.json\n\`\`\`json\n${manifest}\n\`\`\`\n\n`;
  
  return { content: [{ type: "text", text }] };
}
