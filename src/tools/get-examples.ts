import { z } from "zod";
import { examples } from "../cache/index.js";
import { MCPResult } from "../types.js";
import lunr from "lunr";

export const GetExamplesInput = z.object({
  topic: z.string()
});

const exampleIndex = lunr(function() {
  this.ref("topic");
  this.field("topic");
  this.field("title");
  
  for (const ex of examples) {
    this.add(ex);
  }
});

export async function getExamples(input: z.infer<typeof GetExamplesInput>): Promise<MCPResult> {
  const q = input.topic;
  let results = examples.filter(e => e.topic.toLowerCase().includes(q.toLowerCase()) || e.title.toLowerCase().includes(q.toLowerCase()));
  
  if (results.length === 0) {
    const res = exampleIndex.search(q);
    results = res.map(r => examples.find(e => e.topic === r.ref)!).filter(Boolean);
  }
  
  if (results.length === 0) {
    return { content: [{ type: "text", text: `No examples found for topic: ${input.topic}` }] };
  }
  
  let text = `Examples for "${input.topic}":\n\n`;
  for (const ex of results) {
    text += `### ${ex.title}\nSource: ${ex.source}\n\`\`\`java\n${ex.code}\n\`\`\`\n\n`;
  }
  
  return { content: [{ type: "text", text }] };
}
