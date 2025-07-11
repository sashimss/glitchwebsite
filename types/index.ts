// types/project.ts



import { ChromaItem } from "@/components/ui/chroma-grid";

export interface Project extends ChromaItem {
  slug: string;
  year: string;
  genre: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  tag: string;
  image: string;
  bio: string;
  email: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}
