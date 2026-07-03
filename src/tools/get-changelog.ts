import { z } from "zod";
import { changelog } from "../cache/index.js";
import { MCPResult } from "../types.js";

export const GetChangelogInput = z.object({
  since: z.string().optional()
});

export async function getChangelog(input: z.infer<typeof GetChangelogInput>): Promise<MCPResult> {
  let filtered = changelog;
  
  if (input.since) {
    const sinceIdx = changelog.findIndex(c => c.version === input.since);
    if (sinceIdx !== -1) {
      filtered = changelog.slice(sinceIdx);
    }
  }
  
  if (filtered.length === 0) {
    return { content: [{ type: "text", text: "No changelog entries found." }] };
  }
  
  let text = `# Changelog\n\n`;
  for (const entry of filtered) {
    text += `## ${entry.version} (${entry.date})\n`;
    for (const change of entry.changes) {
      text += `- **[${change.type.toUpperCase()}]** ${change.description}\n`;
    }
    text += `\n`;
  }
  
  return { content: [{ type: "text", text }] };
}
