import type { NextApiRequest, NextApiResponse } from "next";
import admin from "@/lib/firebaseadmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "Missing Firebase token" });

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    res.status(200).json({ uid });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to get UID" });
  }
}
