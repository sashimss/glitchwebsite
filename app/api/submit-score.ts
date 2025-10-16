// pages/api/submit-score.ts
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "@/lib/firebaseadmin";
import forge from "node-forge";
import prisma from "@/lib/prisma"; // your Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // 1️⃣ Verify Firebase token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "Missing Firebase token" });

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2️⃣ Decrypt payload from Unity
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Missing encrypted data" });

    const privateKeyPem = process.env.PRIVATE_KEY!.replace(/\\n/g, "\n");
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decryptedStr = privateKey.decrypt(forge.util.decode64(data), "RSA-OAEP");

    const payload = JSON.parse(decryptedStr);
    if (payload.uid !== uid)
      return res.status(401).json({ error: "UID mismatch" });

    const { gameId, score } = payload;
    if (!gameId || score == null)
      return res.status(400).json({ error: "Invalid payload" });

    // 3️⃣ Insert user if not exists, link hostel from StudentHostels
    let user = await prisma.user.findUnique({ where: { uid } });

    if (!user) {
      const firebaseUser = await admin.auth().getUser(uid);
      const email = firebaseUser.email!;

      const studentHostel = await prisma.studentHostels.findUnique({
        where: { email },
      });

      user = await prisma.user.create({
        data: {
          uid,
          name: firebaseUser.displayName || null,
          hostel_id: studentHostel?.hostel_id || null,
        },
      });
    }

    // 4️⃣ Update the score for the correct game column
    const scoreColumn = `bestScore${gameId}` as keyof typeof user;

    await prisma.user.update({
      where: { uid },
      data: {
        [scoreColumn]: Math.max(user[scoreColumn] || 0, score),
      },
    });

    res.status(200).json({ message: "Score submitted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit score" });
  }
}
