import type { NextApiRequest, NextApiResponse } from "next";
import admin from "@/lib/firebaseadmin";
import forge from "node-forge";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing Firebase token" });

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Missing encrypted data" });

    const privateKeyPem = process.env.PRIVATE_KEY!.replace(/\\n/g, "\n");
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decryptedStr = privateKey.decrypt(forge.util.decode64(data), "RSA-OAEP");

    const payload = JSON.parse(decryptedStr);
    if (payload.uid !== uid) return res.status(401).json({ error: "UID mismatch" });

    const { gameId, score } = payload;
    if (!gameId || !score) return res.status(400).json({ error: "Invalid payload" });

    // Insert user if not exists, link hostel from StudentHostels
    const userRes = await pool.query(`SELECT * FROM "User" WHERE uid = $1`, [uid]);
    if (userRes.rowCount === 0) {
      const firebaseUser = await admin.auth().getUser(uid);
      const email = firebaseUser.email!;
      const hostelRes = await pool.query(`SELECT hostel_id FROM "StudentHostels" WHERE email = $1`, [email]);
      const hostel_id = hostelRes?.rows?.[0]?.hostel_id ?? null;

      await pool.query(
        `INSERT INTO "User"(uid, name, hostel_id) VALUES ($1, $2, $3)`,
        [uid, firebaseUser.displayName || null, hostel_id]
      );
    }

    const scoreColumn = `bestScore${gameId}`;
    await pool.query(
      `UPDATE "User" SET "${scoreColumn}" = GREATEST("${scoreColumn}", $1) WHERE uid = $2`,
      [score, uid]
    );

    res.status(200).json({ message: "Score submitted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit score" });
  }
}
