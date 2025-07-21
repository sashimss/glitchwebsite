"use client";

import PageHeader from "@/components/page-header";
import TeamCard from "@/components/team-card";
import { teamMembers } from "../../data/team";
import CurvedLoop from "@/components/curvedloop";


export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="Team"
        imageUrl="/images/team_header.png"
      />

      <CurvedLoop
        marqueeText="Meet Our Amazing Team ✦"
        speed={2}
        curveAmount={325}
        direction="left"
        interactive={true}
        className="text-md fill-green-400"
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
