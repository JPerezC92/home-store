// Link entity interface (shared TypeScript type)
export interface Link {
  id: number;
  title: string;
  url: string;
  description: string;
}

// Response types
export type LinkResponse = Link;
export type LinkListResponse = Link[];
