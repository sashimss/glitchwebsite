"use client";


import PageHeader from "@/components/page-header";
import { projects } from "@/data/projects";
import ChromaGrid from "@/components/ui/chroma-grid";
import { ProjectCard } from "@/components/project-card";


export default function ProjectsPage() {
    return (
        <>
            <PageHeader
                title="Projects"
                imageUrl="/images/cannon.png"
            />
            <div className="px-6 py-10 max-w-7xl mx-auto">
         
         
                <ChromaGrid
                    items={projects}
                    columns={{ xs: 1, sm: 2, md: 3 }}
                    renderItem={(item: Project) => <ProjectCard {...item} />}
                  
                    className="gap-8"
                />
                {/* <ChromaGrid/> */}
            </div>
        </>
    );
}