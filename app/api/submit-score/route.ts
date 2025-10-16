import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebaseadmin";
import forge from "node-forge";
import prisma from "@/lib/prisma";







export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Verify Firebase token
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing Firebase token" }, { status: 401 });
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2️⃣ Get and decrypt payload
    const body = await req.json();
    const { data } = body;
    if (!data) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    // // Decrypt using RSA-OAEP
    const privateKeyPem = process.env.PRIVATE_KEY!.replace(/\\n/g, "\n");
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    let decryptedStr: string;
    try {


       decryptedStr = privateKey.decrypt(
  forge.util.decode64(body.data),
  "RSAES-PKCS1-V1_5"
);

      console.log("Decrypted string:", decryptedStr);
    } catch (err) {
      return NextResponse.json({ error: "Failed to decrypt data" }, { status: 400 });
    }

    // 3️⃣ Parse GAMEID_UID_SCORE
    const [gameIdStr, receivedUid, scoreStr] = decryptedStr.split("_");
    if (receivedUid !== uid) return NextResponse.json({ error: "UID mismatch" }, { status: 401 });

    const gameId = parseInt(gameIdStr, 10);
    const score = parseInt(scoreStr, 10);
    if (!gameId || score == null) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    // 4️⃣ Insert user if not exists
    let user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      const firebaseUser = await admin.auth().getUser(uid);
      const email = firebaseUser.email!;
      const studentHostel = await prisma.studentHostels.findUnique({ where: { email } });
      user = await prisma.user.create({
        data: {
          uid,
          name: firebaseUser.displayName || null,
          hostel_id: studentHostel?.hostel_id || null,
        },
      });
    }

    // 5️⃣ Update score column
    const scoreColumn = `bestScore${gameId}` as keyof typeof user;
    const currentScore = Number(user[scoreColumn] ?? 0) || 0;
    if (score > currentScore) {
      await prisma.user.update({
        where: { uid },
        data: { [scoreColumn]: score },
      });
    }

    return NextResponse.json({ message: "Score submitted successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}
