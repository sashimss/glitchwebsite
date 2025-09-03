import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserScoreInput, UserScoreResponse } from "@/types";

export async function POST(req: Request): Promise<NextResponse<UserScoreResponse>> {
  try {
    let name: string, hostelName: string, score: number;
    
    // Try to get data from request body first
    try {
      const bodyData: UserScoreInput = await req.json();
      name = bodyData.name;
      hostelName = bodyData.hostelName;
      score = bodyData.score;
      console.log("JSON Parsing Success");
      console.log("JSON Body: ", bodyData);
    } catch {
      // If JSON parsing fails, try query parameters
      const url = new URL(req.url);
      name = url.searchParams.get('name') || '';
      hostelName = url.searchParams.get('hostelName') || '';


      const scoreParam = url.searchParams.get('score');

      console.log("JSON Parsing Failed");
      console.log("Query Parameters: ", url.searchParams);
      
      score = scoreParam ? parseInt(scoreParam, 10) : 0;
      console.log("Score: ", score);
      console.log("Hostel Name: ", hostelName);
      console.log("Name: ", name);
    }

    if (!name || !hostelName || typeof score !== "number" || isNaN(score)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Update if score is higher, else keep existing
    const existing = await prisma.userScore.findUnique({ where: { name } });

    if (existing) {
      if (score > existing.bestScore) {
        await prisma.userScore.update({
          where: { name },
          data: { bestScore: score, hostelName },
        });
      }
    } else {
      await prisma.userScore.create({
        data: { name, hostelName, bestScore: score },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Example usage:
// Method 1: JSON body
// fetch("/api/scores", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name: "Alice", hostelName: "Hostel A", score: 250 }),
//   });

// Method 2: Query parameters
// fetch("/api/scores?name=Alice&hostelName=Hostel%20A&score=250", {
//     method: "POST",
//   });