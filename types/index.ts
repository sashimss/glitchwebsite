// types/project.ts



import { ChromaItem } from "@/components/ui/chroma-grid";

export interface Project extends ChromaItem {
  slug: string;
  year: string;
  genre: string;
}