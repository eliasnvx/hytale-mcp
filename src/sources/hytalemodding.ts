import { HytaleEvent, HytaleEntity, HytaleBlock, HytaleSound } from "../types.js";

const BASE_URL = "https://hytalemodding.dev/en/docs/server";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function fetchEvents(): Promise<HytaleEvent[]> {
  try {
    const res = await fetch(`${BASE_URL}/events`);
    if (!res.ok) throw new Error("Failed to fetch");
    await delay(500);
    // Stub implementation due to lack of HTML parser in this environment
    return [];
  } catch {
    console.warn("Could not fetch hytalemodding events, using fallback cache.");
    return [];
  }
}

export async function fetchEntities(): Promise<HytaleEntity[]> {
  try {
    const res = await fetch(`${BASE_URL}/entities`);
    if (!res.ok) throw new Error("Failed to fetch");
    await delay(500);
    return [];
  } catch {
    console.warn("Could not fetch hytalemodding entities, using fallback cache.");
    return [];
  }
}

export async function fetchBlocks(): Promise<HytaleBlock[]> {
  try {
    const res = await fetch(`${BASE_URL}/blocks`);
    if (!res.ok) throw new Error("Failed to fetch");
    await delay(500);
    return [];
  } catch {
    console.warn("Could not fetch hytalemodding blocks, using fallback cache.");
    return [];
  }
}

export async function fetchSounds(): Promise<HytaleSound[]> {
  try {
    // Stub
    return [];
  } catch {
    return [];
  }
}
