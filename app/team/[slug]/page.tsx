interface TeamMemberPageProps {
  params: {
    slug: string;
  };
}

export default function TeamMemberPage({ params }: TeamMemberPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Team Member: {params.slug}</h1>
      {/* Render team member details here */}
    </div>
  );
}