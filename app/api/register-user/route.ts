import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebaseadmin";
import prisma from "@/lib/prisma";


const normalizeEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  return `${localPart.toUpperCase()}@${domain.toLowerCase()}`;
};

export async function POST(req: NextRequest) {
  try {
    // 🔒 Verify Firebase token
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing Firebase token" }, { status: 401 });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 🧠 Get body (we’ll send email + name from frontend)
    const { email, name } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    console.log("Registering user:", { uid, email, name });

    // 🔍 Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { uid } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" });
    }

    // 🏠 Find hostel_id via StudentHostels table

const normalizedEmail = normalizeEmail(email);    
const studentHostel = await prisma.studentHostels.findUnique({ where: { email: normalizedEmail} });

    // 🧾 Insert new user into DB
    await prisma.user.create({
      data: {
        uid,
        name: name || null,
        hostel_id: studentHostel?.hostel_id || null,
      },
    });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
