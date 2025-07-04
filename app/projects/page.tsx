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
    gradient: "linear-gradient(145deg, #00ff88, #000)", // optional: vary per project
    borderColor: "#00ff88", // optional: green border (like your image)
    year: project.year,
  }));



    return (
        <>
            <PageHeader
                title="Projects"
                imageUrl="/images/cannon.png"
            />
            <div className="px-6 py-10 max-w-7xl mx-auto">
         
         
                    <ChromaGrid items={chromaItems} />
                {/* <ChromaGrid/> */}
            </div>
        </>
    );
}