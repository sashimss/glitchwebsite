interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Project: {params.slug}</h1>
      {/* Render detailed project */}
    </div>
  );
}
