import React from 'react';

export default function HomePage() {
  return (
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
  );
}
