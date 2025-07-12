"use client";

import React from 'react';
import PageHeader from "@/components/page-header";
interface ProjectPageProps {
  params: Usable<{
    slug: string;
  }>;
}

export default function ProjectPage({params} : ProjectPageProps){
  
    const { slug } = React.use(params);
  
  
  return (
    



    <>
 <PageHeader
        title= {slug}
        imageUrl="/images/cannon.png"
      />

    <div>
      <h1 className="text-2xl font-bold">Project: {slug}</h1>
      {/* Render detailed project */}
    </div>

    </>
  );
}
