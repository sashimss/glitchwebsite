import  PageHeader  from "@/components/page-header";



export default function ProjectsPage() {
  return (
    <>
     <PageHeader
        title="Projects"
        imageUrl="/images/cannon.png"
      />
      <div className="p-6">
        <h2 className="text-xl">All Projects</h2>
        {/* Render project cards here */}
      </div>
    </>
  );
}