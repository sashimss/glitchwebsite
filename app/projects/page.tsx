"use client";


import PageHeader from "@/components/page-header";
import { projects } from "@/data/projects";
import ChromaGrid, { ChromaItem } from "@/components/ui/chroma-grid"; // or wherever it lives
export default function ProjectsPage() {


const chromaItems: ChromaItem[] = projects.map((project) => ({
    image: project.image,
    title: project.title,
    subtitle: project.genre,
    url: `/projects/${project.slug}`,
    // gradient: "linear-gradient(145deg, #00ff88, #000)", // optional: vary per project
    // borderColor: "#00ff88", // optional: green border (like your image)

    gradient : project.gradient || "linear-gradient(145deg, #00ff88, #000)",
    borderColor: project.borderColor || "#00ff88",
    year: project.year,
  }));



    return (
        <>
            <PageHeader
                title="Projects"
                imageUrl="/images/cannon.png"
            />
            <div >
                 <ChromaGrid items={chromaItems} className="py-20"  />
                    
            </div>
        </>
    );
}