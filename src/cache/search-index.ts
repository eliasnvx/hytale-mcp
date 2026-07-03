import lunr from "lunr";
import { events, entities, blocks, api } from "./index.js";
import { DocEntry } from "../types.js";

// We build the index in memory from the cached data at startup
export const docs: DocEntry[] = [];

// Populate docs array
for (const e of events) {
  docs.push({
    id: `event_${e.name}`,
    title: `${e.name} (Event)`,
    body: `${e.description} ${e.fields.map(f => f.name).join(" ")}`,
    url: `https://hytalemodding.dev/events#${e.name}`,
    source: "hytalemodding.dev"
  });
}

for (const e of entities) {
  docs.push({
    id: `entity_${e.id}`,
    title: `${e.name} (Entity)`,
    body: `${e.description} Category: ${e.category}`,
    url: `https://hytalemodding.dev/entities#${e.id}`,
    source: "hytalemodding.dev"
  });
}

for (const b of blocks) {
  docs.push({
    id: `block_${b.id}`,
    title: `${b.name} (Block)`,
    body: `Block ID: ${b.id} Category: ${b.category}`,
    url: `https://hytalemodding.dev/blocks#${b.id}`,
    source: "hytalemodding.dev"
  });
}

for (const cls of api) {
  docs.push({
    id: `api_${cls.name}`,
    title: `${cls.name} (Java API)`,
    body: `${cls.description} Package: ${cls.package} Methods: ${cls.methods.map(m => m.name).join(" ")}`,
    url: `https://github.com/HytaleModding/patcher/classes/${cls.name}`,
    source: "github.com/HytaleModding/patcher"
  });
}

export const searchIndex = lunr(function() {
  this.ref("id");
  this.field("title", { boost: 10 });
  this.field("body");

  for (const doc of docs) {
    this.add(doc);
  }
});

export function searchDocs(query: string, limit: number = 5): DocEntry[] {
  const results = searchIndex.search(query).slice(0, limit);
  return results.map(r => docs.find(d => d.id === r.ref)!).filter(Boolean);
}
