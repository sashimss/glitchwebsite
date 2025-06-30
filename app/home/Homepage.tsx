import React from 'react';
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="w-full h-[90vh] bg-gray-100 relative overflow-hidden">
        <video 
          className="w-full h-[90vh] object-cover brightness-65"
          src="/glitch_promo.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          <img src="/logo-nobg.png" alt="Glitch Logo" className="h-16 mr-4" />
          <span className="text-6xl font-bold text-primary" style={{ textShadow: "0 0 30px #00ff00, 0 0 30px #00ff00, 0 0 0 #00ff00" }}>
            GLITCH
          </span>
        </div>
      </div>
      
      <div className="w-full h-[90vh] bg-[#0B0F13] relative overflow-hidden flex items-center">
        <div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center px-4">
          <div className="w-1/2 p-12">
            <h1 className="text-6xl font-bold text-white mb-12">ABOUT US</h1>
            <p className="text-white text-lg">Glitch, the epicenter of gaming and game development at Indian Institute of Technology. We're the bridge between gaming enthusiasts and aspiring developers, offering thrilling tournaments, enlightening workshops, and collaborative coding sessions.</p>
            <p className="text-white text-lg mt-4">Join us to celebrate and elevate both playing and creating games in an inclusive and dynamic community. Let's level up together!</p>
            <Link href="/about">
            <button className="mt-8 bg-green-500 text-black px-6 py-3 rounded-lg text-lg hover:bg-white">
                NEXT CAN BE YOU →
            </button>
            </Link>

          </div>
          <div className="relative w-1/2 flex justify-end p-12">
            <div className="absolute w-full h-full flex justify-end">
              <div className="relative w-120 h-120 bg-gradient-to-b from-green-700 to-green-0 rounded-full opacity-100"></div>
            </div>
            <img src="/homepage-1.png" alt="Character" className="h-130 relative translate-x-[-20px] translate-y-[30px]" />
          </div>
        </div>
      </div>
    </>
  );
}