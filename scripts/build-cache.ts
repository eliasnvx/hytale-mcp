import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchEvents, fetchEntities, fetchBlocks, fetchSounds } from "../src/sources/hytalemodding.js";
import { fetchExamples, fetchApi } from "../src/sources/github.js";
import { searchIndex } from "../src/cache/search-index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, "../data");

async function main() {
  console.log("Building cache...");
  
  const events = await fetchEvents();
  if (events.length > 0) writeFileSync(join(DATA_DIR, "events.json"), JSON.stringify(events, null, 2));
  else console.log("Using cached events");

  const entities = await fetchEntities();
  if (entities.length > 0) writeFileSync(join(DATA_DIR, "entities.json"), JSON.stringify(entities, null, 2));
  else console.log("Using cached entities");

  const blocks = await fetchBlocks();
  if (blocks.length > 0) writeFileSync(join(DATA_DIR, "blocks.json"), JSON.stringify(blocks, null, 2));
  else console.log("Using cached blocks");

  const sounds = await fetchSounds();
  if (sounds.length > 0) writeFileSync(join(DATA_DIR, "sounds.json"), JSON.stringify(sounds, null, 2));
  else console.log("Using cached sounds");

  const api = await fetchApi();
  if (api.length > 0) writeFileSync(join(DATA_DIR, "api.json"), JSON.stringify(api, null, 2));
  else console.log("Using cached API");

  const examples = await fetchExamples();
  if (examples.length > 0) writeFileSync(join(DATA_DIR, "examples.json"), JSON.stringify(examples, null, 2));
  else console.log("Using cached examples");

  // Save the lunr index
  writeFileSync(join(DATA_DIR, "docs-index.json"), JSON.stringify(searchIndex.toJSON()));
  console.log("Saved docs-index.json");

  // Write meta
  const meta = {
    builtAt: new Date().toISOString(),
    sources: {
      hytalemodding: "1.0",
      github: "1.0"
    }
  };
  writeFileSync(join(DATA_DIR, "meta.json"), JSON.stringify(meta, null, 2));
  console.log("Cache build complete!");
}

main().catch(console.error);
