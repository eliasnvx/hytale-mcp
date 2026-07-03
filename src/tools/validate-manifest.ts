import { z } from "zod";
import { MCPResult } from "../types.js";

export const ValidateManifestInput = z.object({
  json: z.string(),
  type: z.enum(["plugin", "pack"]).optional()
});

export async function validateManifest(input: z.infer<typeof ValidateManifestInput>): Promise<MCPResult> {
  let parsed: any;
  try {
    parsed = JSON.parse(input.json);
  } catch (e: any) {
    return { content: [{ type: "text", text: `Invalid JSON: ${e.message}` }] };
  }
  
  const errors: string[] = [];
  const type = input.type || (parsed.format_version ? "pack" : "plugin");
  
  if (type === "plugin") {
    if (!parsed.name) errors.push("Missing required field: name");
    if (!parsed.version) errors.push("Missing required field: version");
    if (!parsed.main) errors.push("Missing required field: main");
    if (!parsed["api-version"]) errors.push("Missing required field: api-version");
  } else {
    if (!parsed.format_version) errors.push("Missing required field: format_version");
    if (!parsed.header) {
      errors.push("Missing required object: header");
    } else {
      if (!parsed.header.name) errors.push("Missing required field: header.name");
      if (!parsed.header.uuid) errors.push("Missing required field: header.uuid");
      if (!parsed.header.version) errors.push("Missing required field: header.version");
    }
  }
  
  if (errors.length > 0) {
    let text = `Manifest has validation errors:\n\n` + errors.map(e => `- ${e}`).join("\n");
    return { content: [{ type: "text", text }] };
  }
  
  return { content: [{ type: "text", text: "✅ Manifest is valid" }] };
}
