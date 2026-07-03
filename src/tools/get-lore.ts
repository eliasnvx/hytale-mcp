import { z } from "zod";
import { lore } from "../cache/index.js";
import { MCPResult, LoreMob, LoreItem } from "../types.js";

export const GetLoreInput = z.object({
  query: z.string().optional().describe("Search by mob or item name"),
  type: z.enum(["mob", "item"]).optional(),
  faction: z.string().optional().describe("Filter mobs by faction, e.g. 'Kweebec', 'Trork'"),
});

export async function getLore(input: z.infer<typeof GetLoreInput>): Promise<MCPResult> {
  const { query, type, faction } = input;
  
  let results = lore;
  
  if (type) {
    results = results.filter(item => item.type === type);
  }
  
  if (faction) {
    results = results.filter(item => item.type === "mob" && item.faction.toLowerCase() === faction.toLowerCase());
  }
  
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(item => 
      item.id.toLowerCase().includes(q) || 
      item.name.toLowerCase().includes(q)
    );
  }
  
  if (!query && !type && !faction) {
    // No args: return a summary grouped by faction/category
    const factions = new Set<string>();
    const categories = new Set<string>();
    
    for (const item of lore) {
      if (item.type === "mob" && item.faction) {
        factions.add(item.faction);
      } else if (item.type === "item" && item.category) {
        categories.add(item.category);
      }
    }
    
    let summary = "### Lore Summary\n\n";
    if (factions.size > 0) {
      summary += "**Mob Factions:**\n" + Array.from(factions).map(f => `- ${f}`).join("\n") + "\n\n";
    }
    if (categories.size > 0) {
      summary += "**Item Categories:**\n" + Array.from(categories).map(c => `- ${c}`).join("\n") + "\n\n";
    }
    
    return {
      content: [{ type: "text", text: summary.trim() }]
    };
  }
  
  if (results.length === 0) {
    return {
      content: [{ type: "text", text: "No lore entries found matching your criteria." }]
    };
  }
  
  let output = "";
  
  const mobs = results.filter((item): item is LoreMob => item.type === "mob");
  const items = results.filter((item): item is LoreItem => item.type === "item");
  
  if (mobs.length > 0) {
    output += "### Mobs\n\n";
    output += "| Name | Faction | HP | Behavior |\n";
    output += "|---|---|---|---|\n";
    for (const mob of mobs) {
      output += `| ${mob.name} | ${mob.faction} | ${mob.hp} | ${mob.behavior} |\n`;
    }
    output += "\n";
  }
  
  if (items.length > 0) {
    output += "### Items\n\n";
    output += "| Name | Category | Damage | Durability |\n";
    output += "|---|---|---|---|\n";
    for (const item of items) {
      const dmg = item.damageMin && item.damageMax ? `${item.damageMin}-${item.damageMax}` : (item.damageMin || item.damageMax || "-");
      const durability = item.durability || "-";
      output += `| ${item.name} | ${item.category} | ${dmg} | ${durability} |\n`;
    }
    output += "\n";
  }
  
  return {
    content: [{ type: "text", text: output.trim() }]
  };
}
