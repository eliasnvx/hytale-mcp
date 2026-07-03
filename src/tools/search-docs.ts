import { z } from "zod";
import { searchDocs as runSearch } from "../cache/search-index.js";
import { MCPResult } from "../types.js";

export const SearchDocsInput = z.object({
  query: z.string(),
  limit: z.number().optional().default(5)
});

export async function searchDocs(input: z.infer<typeof SearchDocsInput>): Promise<MCPResult> {
  const results = runSearch(input.query, input.limit);
  if (results.length === 0) {
    return { content: [{ type: "text", text: "No results found." }] };
  }
  
  const text = results.map(r => `## [${r.title}](${r.url})\nSource: ${r.source}\n\n${r.body}`).join("\n\n---\n\n");
  return { content: [{ type: "text", text }] };
}
