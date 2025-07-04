
import PageHeader from "@/components/page-header";
interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (

    <>
 <PageHeader
        title="Project"
        imageUrl="/images/cannon.png"
      />

    <div>
      <h1 className="text-2xl font-bold">Project: {params.slug}</h1>
      {/* Render detailed project */}
    </div>

    </>
  );
}
