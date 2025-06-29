
interface BlogPageProps {
  params: {
    slug: string;
  };
}


export default function BlogPostPage({ params }: BlogPageProps ) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Blog: {params.slug}</h1>
      {/* Render content dynamically */}
    </div>
  );
}