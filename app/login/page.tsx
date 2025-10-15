"use client";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [needsHostel, setNeedsHostel] = useState(false);
  const [hostel, setHostel] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Restrict login to IITH accounts only
      if (!user.email || !user.email.endsWith("@iith.ac.in")) {
        setError("Please use your IIT Hyderabad account to log in.");
        await auth.signOut();
        return;
      }

      const uid = user.uid;


      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists() || !userDoc.data()?.hostel) {
        setNeedsHostel(true);
        setUserId(uid);
        return;
      }

      const token = await result.user.getIdToken();
      setCookie("authToken", token, { path: "/", maxAge: 60 * 60 * 24 });
      window.dispatchEvent(new Event("storage"));
      setCookie("guestMode", "false", { path: "/", maxAge: 60 * 60 * 24 });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleHostelSubmit = async () => {
    if (!hostel) {
      setError("Please enter your hostel name");
      return;
    }
    try {
      await setDoc(doc(db, "users", userId), { hostel }, { merge: true });
      const user = auth.currentUser!;
      const token = await user.getIdToken();
      setCookie("authToken", token, { path: "/", maxAge: 60 * 60 * 24 });
      window.dispatchEvent(new Event("storage"));
      setCookie("guestMode", "false", { path: "/", maxAge: 60 * 60 * 24 });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestMode = () => {
    // Set a cookie to indicate guest/anonymous mode
    setCookie("guestMode", "true", { path: "/", maxAge: 60 * 60 * 24 });
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div
        className="p-8 rounded-2xl w-[420px]"
        style={{
          backgroundColor: "black",
          border: "1px solid #00ff00",
          boxShadow: "0 0 15px #00ff00, 0 0 30px #00ff00",
        }}
      >
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "white", textShadow: "0 0 10px #00ff00" }}
        >
          Login
        </h2>

        {!needsHostel ? (
          <div className="space-y-4 mt-8">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2 rounded-md bg-green-600 text-black font-bold hover:bg-green-500 transition"
              style={{ boxShadow: "0 0 10px #00ff00, 0 0 20px #00ff00" }}
            >
              Sign in with Google
            </button>

            <button
              onClick={handleGuestMode}
              className="w-full py-2 rounded-md bg-transparent text-green-400 border border-green-400 font-bold hover:bg-green-700/20 transition"
            >
              Continue without login
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-8">
            <p className="text-white">Please enter your hostel name:</p>
            <input
              type="text"
              placeholder="Hostel Name"
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-black text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              onClick={handleHostelSubmit}
              className="w-full py-2 rounded-md bg-green-600 text-black font-bold hover:bg-green-500 transition"
              style={{ boxShadow: "0 0 10px #00ff00, 0 0 20px #00ff00" }}
            >
              Submit Hostel
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
