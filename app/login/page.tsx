"use client";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hostel, setHostel] = useState("");
  const [needsHostel, setNeedsHostel] = useState(false);
  const [userId, setUserId] = useState(""); // store uid for hostel update
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists() || !userDoc.data()?.hostel) {
        setNeedsHostel(true);
        setUserId(uid);
        return; // wait for hostel input
      }

      const token = await userCred.user.getIdToken();
      setCookie("authToken", token, { path: "/", maxAge: 60 * 60 * 24 });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;

      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists() || !userDoc.data()?.hostel) {
        setNeedsHostel(true);
        setUserId(uid);
        return;
      }

      const token = await result.user.getIdToken();
      setCookie("authToken", token, { path: "/", maxAge: 60 * 60 * 24 });
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
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
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
          <form onSubmit={handleLogin} className="space-y-4 mt-8">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-black text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-black text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-green-600 text-black font-bold hover:bg-green-500 transition"
              style={{ boxShadow: "0 0 10px #00ff00, 0 0 20px #00ff00" }}
            >
              Login
            </button>
          </form>
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

        {!needsHostel && (
          <button
            onClick={handleGoogleSignIn}
            className="w-full mt-4 py-2 rounded-md bg-green-600 text-black font-bold hover:bg-green-500 transition"
            style={{ boxShadow: "0 0 10px #00ff00, 0 0 20px #00ff00" }}
          >
            Sign in with Google
          </button>
        )}

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
