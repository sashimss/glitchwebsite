import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const scores = await prisma.userScore.findMany({
      orderBy: { bestScore: "desc" },
      take: 10, // top 10
    });

    return NextResponse.json(scores);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Front End Usage 
// const res = await fetch("/api/leaderboard");
// const data = await res.json();
