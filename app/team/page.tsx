"use client";

import PageHeader from "@/components/page-header";
import TeamCard from "@/components/team-card";
import { teamMembers } from "../../data/team";

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="Team"
        imageUrl="/images/team_header.png"
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamCard key={member.slug} {...member} />
          ))}
        </div>
      </div>

    </>
  );
}
