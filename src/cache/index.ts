import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { HytaleEvent, HytaleEntity, HytaleBlock, HytaleSound, JavaClass, CodeExample, ChangelogEntry } from "../types.js";

// Ensure compatibility if import.meta.dirname is not supported in the exact Node version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadJson<T>(filename: string): T {
  try {
    const raw = readFileSync(join(__dirname, "../../data", filename), "utf8");
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Failed to load ${filename}`, e);
    return [] as unknown as T; // Fallback
  }
}

export const events = loadJson<HytaleEvent[]>("events.json");
export const entities = loadJson<HytaleEntity[]>("entities.json");
export const blocks = loadJson<HytaleBlock[]>("blocks.json");
export const sounds = loadJson<HytaleSound[]>("sounds.json");
export const api = loadJson<JavaClass[]>("api.json");
export const examples = loadJson<CodeExample[]>("examples.json");
export const changelog = loadJson<ChangelogEntry[]>("changelog.json");
export const meta = loadJson<{builtAt: string, sources: Record<string, string>}>("meta.json");
