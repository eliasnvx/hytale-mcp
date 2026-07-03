import { describe, it, expect, vi } from "vitest";
import { getLore } from "../get-lore.js";

vi.mock("../../cache/index.js", () => ({
  lore: [
    {
      type: "mob",
      id: "trork_brawler",
      name: "Trork Brawler",
      faction: "Trork",
      disposition: "hostile",
      hp: 61,
      zone: "Zone 1",
      behavior: "rushes first player seen, melee club attack, repositions to flank",
      source: "https://www.bisecthosting.com/blog/hytale-mobs-guide-all-mobs-attacks-more"
    },
    {
      type: "mob",
      id: "trork_chieftain",
      name: "Trork Chieftain",
      faction: "Trork",
      disposition: "hostile",
      hp: 124,
      zone: "Zone 1",
      behavior: "rushes first player seen, melee battleaxe attack, repositions to flank",
      source: "https://www.bisecthosting.com/blog/hytale-mobs-guide-all-mobs-attacks-more"
    },
    {
      type: "mob",
      id: "kweebec_elder",
      name: "Kweebec Elder",
      faction: "Kweebec",
      disposition: "passive",
      hp: 38,
      zone: "Emerald Grove / Zone 1",
      behavior: "passive, waves to players, flees when damaged",
      source: "https://www.bisecthosting.com/blog/hytale-mobs-guide-all-mobs-attacks-more"
    },
    {
      type: "item",
      id: "Weapon_Battleaxe_Scythe_Void",
      name: "Void Scythe",
      category: "Weapons",
      rarity: "Common",
      damageMin: 112,
      damageMax: 224,
      durability: 80,
      source: "https://hytaleguide.net/items/void-scythe"
    }
  ]
}));

describe("get_lore", () => {
  it("faction filter returns only Trork entries", async () => {
    const result = await getLore({ faction: "Trork" });
    const text = result.content[0].text;
    expect(text).toContain("Trork Brawler");
    expect(text).toContain("Trork Chieftain");
    expect(text).not.toContain("Kweebec Elder");
    expect(text).not.toContain("Void Scythe");
  });

  it("query 'void scythe' returns the item", async () => {
    const result = await getLore({ query: "void scythe" });
    const text = result.content[0].text;
    expect(text).toContain("Void Scythe");
    expect(text).toContain("Weapons");
    expect(text).toContain("112-224");
    expect(text).not.toContain("Trork");
  });

  it("type 'mob' excludes items from results", async () => {
    const result = await getLore({ type: "mob" });
    const text = result.content[0].text;
    expect(text).toContain("Trork Brawler");
    expect(text).toContain("Kweebec Elder");
    expect(text).not.toContain("Void Scythe");
  });

  it("no args returns a non-empty grouped summary", async () => {
    const result = await getLore({});
    const text = result.content[0].text;
    expect(text).toContain("### Lore Summary");
    expect(text).toContain("Trork");
    expect(text).toContain("Kweebec");
    expect(text).toContain("Weapons");
  });
});
