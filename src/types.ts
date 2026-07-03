export interface MCPResult {
  content: Array<{ type: "text"; text: string }>
  isError?: boolean
  [key: string]: unknown
}

export interface HytaleEvent {
  name: string
  type: "sync" | "async" | "ecs"
  description: string
  fields: Array<{ name: string; type: string; description: string }>
  example?: string
}

export interface HytaleEntity {
  id: string
  name: string
  description: string
  category: string
}

export interface HytaleBlock {
  id: string
  name: string
  category: string
  description?: string
}

export interface HytaleSound {
  key: string
  category: string
  description?: string
}

export interface JavaClass {
  name: string
  package: string
  description: string
  methods: Array<{ name: string; signature: string; description: string }>
}

export interface CodeExample {
  topic: string
  title: string
  code: string
  source: string
}

export interface ChangelogEntry {
  version: string
  date: string
  changes: Array<{ type: "added" | "changed" | "removed"; description: string }>
}

export interface DocEntry {
  id: string
  title: string
  body: string
  url: string
  source: string
}
