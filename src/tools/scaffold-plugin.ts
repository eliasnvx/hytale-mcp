import { z } from "zod";
import Mustache from "mustache";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MCPResult } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ScaffoldPluginInput = z.object({
  name: z.string(),
  packageName: z.string(),
  features: z.array(z.enum(["events", "commands", "config", "scheduler", "entities"]))
});

function renderTemplate(name: string, view: any): string {
  const tpl = readFileSync(join(__dirname, "../../src/scaffold/templates", name), "utf8");
  return Mustache.render(tpl, view);
}

export async function scaffoldPlugin(input: z.infer<typeof ScaffoldPluginInput>): Promise<MCPResult> {
  const featuresMap = input.features.reduce((acc, feat) => {
    acc[feat] = true;
    return acc;
  }, {} as Record<string, boolean>);
  
  const view = {
    name: input.name,
    packageName: input.packageName,
    features: featuresMap
  };
  
  const manifest = renderTemplate("plugin-manifest.mustache", view);
  const main = renderTemplate("plugin-main.mustache", view);
  const build = renderTemplate("build-gradle.mustache", view);
  
  const packagePath = input.packageName.replace(/\./g, "/");
  
  let text = `Here is the scaffolded plugin for ${input.name}:\n\n`;
  text += `### plugin.json\n\`\`\`json\n${manifest}\n\`\`\`\n\n`;
  text += `### src/main/java/${packagePath}/${input.name}.java\n\`\`\`java\n${main}\n\`\`\`\n\n`;
  text += `### build.gradle.kts\n\`\`\`kotlin\n${build}\n\`\`\`\n\n`;
  text += `### README.md\n\`\`\`markdown\n# ${input.name}\n\nA Hytale plugin.\n\`\`\`\n`;
  
  return { content: [{ type: "text", text }] };
}
