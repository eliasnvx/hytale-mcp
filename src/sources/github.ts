import { CodeExample, JavaClass } from "../types.js";

export async function fetchExamples(): Promise<CodeExample[]> {
  try {
    // Stub implementation for github API limits
    return [];
  } catch {
    console.warn("Could not fetch github examples, using fallback cache.");
    return [];
  }
}

export async function fetchApi(): Promise<JavaClass[]> {
  try {
    // Stub implementation
    return [];
  } catch {
    console.warn("Could not fetch github api, using fallback cache.");
    return [];
  }
}
