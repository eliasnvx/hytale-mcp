import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, "../data");

function checkFile(name: string) {
  try {
    const content = readFileSync(join(DATA_DIR, name), "utf8");
    const parsed = JSON.parse(content);
    if (!parsed || (typeof parsed !== "object")) {
      throw new Error(`${name} is not a valid JSON object/array`);
    }
    console.log(`✅ ${name} is valid JSON`);
  } catch (e: any) {
    throw new Error(`Failed to validate ${name}: ${e.message}`);
  }
}

try {
  checkFile("events.json");
  checkFile("entities.json");
  checkFile("blocks.json");
  checkFile("sounds.json");
  checkFile("api.json");
  checkFile("examples.json");
  checkFile("changelog.json");
  checkFile("meta.json");
  console.log("All data files validated successfully!");
  process.exit(0);
} catch (e: any) {
  console.error("Data validation failed:", e.message);
  process.exit(1);
}
