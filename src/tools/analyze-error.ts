import { z } from "zod";
import { knownErrors } from "../cache/index.js";
import { MCPResult } from "../types.js";

export const AnalyzeErrorInput = z.object({
  log: z.string().describe("Raw stack trace or crash log excerpt to analyze"),
});

export async function analyzeError(input: z.infer<typeof AnalyzeErrorInput>): Promise<MCPResult> {
  const { log } = input;
  
  if (!log || log.trim() === "") {
    return {
      content: [{ type: "text", text: "Error: No log provided." }],
      isError: true
    };
  }

  const exceptionRegex = /([a-zA-Z0-9_.]+(?:Exception|Error))/;
  const exMatch = log.match(exceptionRegex);
  const exceptionType = exMatch ? exMatch[1] : "none";

  const frames: Array<{ className: string, methodName: string }> = [];
  const frameRegex = /at\s+([a-zA-Z0-9_.\$]+)\.([a-zA-Z0-9_$\<>]+)\s*\(/g;
  let m;
  while ((m = frameRegex.exec(log)) !== null) {
    frames.push({ className: m[1], methodName: m[2] });
  }

  const matches = knownErrors.map(err => {
    let score = 0;
    
    if (err.exceptionType === exceptionType) {
      score += 5;
    } else if (err.exceptionType === "none" && exceptionType === "none") {
      score += 1;
    }
    
    let frameMatches = 0;
    for (const f of frames) {
      if (err.classPattern && f.className.includes(err.classPattern) && err.methodPattern && f.methodName.includes(err.methodPattern)) {
        frameMatches++;
      }
    }
    
    if (frameMatches > 0) {
      score += frameMatches * 10;
    } else {
      // Fallback for logs without standard stack traces
      if (err.classPattern && log.includes(err.classPattern) && err.methodPattern && log.includes(err.methodPattern)) {
        frameMatches = 1;
        score += 2;
      }
    }
    
    return { err, score, frameMatches };
  }).filter(m => m.frameMatches > 0);

  if (matches.length === 0) {
    return {
      content: [{
        type: "text",
        text: "No known patterns matched your log. We suggest checking `search_docs` or opening an issue with the full log."
      }]
    };
  }

  matches.sort((a, b) => b.score - a.score);
  const topMatches = matches.slice(0, 3);

  let output = "";
  if (topMatches.length > 1) {
    output += `Found ${topMatches.length} possible matches (ranked by confidence):\n\n`;
  }

  for (const { err } of topMatches) {
    output += `### ${err.title}\n\n`;
    output += `**Cause:** ${err.cause}\n\n`;
    
    let statusBadge = "";
    if (err.status === "fixed") {
      statusBadge = `🟢 Fixed in ${err.fixVersion || "latest"}`;
    } else if (err.status === "known-unfixed") {
      statusBadge = `🔴 Known, unfixed`;
    } else if (err.status === "user-config") {
      statusBadge = `🟡 Configuration issue`;
    }
    output += `**Status:** ${statusBadge}\n\n`;
    
    output += `**Recommendation:** ${err.recommendation}\n\n`;
    output += `**Source:** [Link](${err.source})\n\n`;
    output += `---\n\n`;
  }

  return {
    content: [{ type: "text", text: output.trim() }]
  };
}
