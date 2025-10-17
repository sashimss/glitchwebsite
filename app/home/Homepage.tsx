"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { getCookie } from "cookies-next";
import HomeLeaderboardSection from "@/components/HomeLeaderboardSection";
// import { submitScore } from "@/utils/submitscore";











export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Detect if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get guest / logged-in state
  useEffect(() => {
    const guest = getCookie("guestMode") === "true";
    const token = !!getCookie("authToken");
    setIsGuest(guest);
    setIsLoggedIn(token);
  }, []);

  const shouldShowVideo = isMobile || isGuest; // mobile → video, desktop guest → video
  const shouldShowGame = !isMobile && !isGuest; // desktop logged-in → game

  // // Submit score only if desktop + logged-in
  // useEffect(() => {
  //   if (!shouldShowGame) return; // do nothing for mobile/guest

  //   const interval = setInterval(() => {
  //     submitScore();
  //   }, 2000); // check every 2s if Unity has payload

  //   return () => clearInterval(interval);
  // }, [shouldShowGame]);

  // Define getUID only if logged in AND desktop
  useEffect(() => {
  if (shouldShowGame && isLoggedIn) {
    (window as any).getUID = async () => {
      const token = getCookie("authToken");
      if (!token) return null;

      try {
        const res = await fetch("/api/get-uid", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        // if API returns non-200
        if (!res.ok) {
          console.error("Failed to fetch UID:", res.status, await res.text());
          return null;
        }

        const data = await res.json();
        return data.uid;
      } catch (err) {
        console.error("Error parsing JSON from get-uid:", err);
        return null;
      }
    };
  } else {
    (window as any).getUID = undefined;
  }

  return () => {
    (window as any).getUID = undefined;
  };
}, [shouldShowGame, isLoggedIn]);


useEffect(() => {
  // Listen to messages from iframe
  const listener = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;

    if (event.data.type === "score") {
      const { gameName, score } = event.data;

      const token = getCookie("authToken");
      if (!token) return;

      fetch("/api/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameName, data: score }),
      });
    }
  };

  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}, []);




  return (
    <>
      {shouldShowVideo && (
        <div className="w-full h-[90vh] bg-gray-100 relative overflow-hidden">
          <video
            className="w-full h-[90vh] object-cover brightness-65"
            src="/glitch_promo.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      )}

      {shouldShowGame && (
        <div className="w-360 h-270 gi py-12 ">
          <iframe
            src="/gameglitch/GM/index.html"
            className="w-full h-full border-none"
            title="Topdown Game"
            allowFullScreen
          />
        </div>
      )}

      {/* About section */}
      <div className="w-full min-h-[90vh] bg-[#0B0F13] relative overflow-hidden flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12">
        <div className="w-full lg:w-1/2 p-6 lg:p-12 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 lg:mb-12">
            ABOUT US
          </h1>
          <p className="text-white text-base md:text-lg leading-relaxed">
            Glitch, the epicenter of gaming and game development at Indian Institute of Technology.
            We're the bridge between gaming enthusiasts and aspiring developers, offering thrilling
            tournaments, enlightening workshops, and collaborative coding sessions.
          </p>
          <p className="text-white text-base md:text-lg mt-4 leading-relaxed">
            Join us to celebrate and elevate both playing and creating games in an inclusive and dynamic community.
            Let's level up together!
          </p>
          <Link href="/about">
            <button className="mt-8 bg-green-500 text-black px-5 md:px-6 py-3 rounded-lg text-base md:text-lg hover:bg-white transition">
              NEXT CAN BE YOU →
            </button>
          </Link>
        </div>

        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end p-6 lg:p-12 mt-10 lg:mt-0">
          <div className="absolute inset-0 flex justify-center lg:justify-end items-center">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-b from-green-700 to-green-500 rounded-full blur-3xl opacity-80"></div>
          </div>
          <img
            src="/homepage-1.png"
            alt="Character"
            className="relative h-72 md:h-96 lg:h-[32rem] object-contain z-10"
          />
        </div>
      </div>

      {/* Leaderboard Section */}
      <HomeLeaderboardSection />

      {/* Video image section */}
      <div className="w-full h-[90vh] relative overflow-hidden">
        <img
          src="/homepage-videoimage.png"
          alt="Gaming Setup"
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <FaPlay className="w-8 h-8 text-black" />
        </button>
      </div>
    </>
  );
}
