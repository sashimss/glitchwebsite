"use client";
import { useEffect, useState } from "react";

export default function TimelineProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollProgress = (scrollPosition / totalHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-700 z-0">
      <div
        className="bg-green-400 w-full transition-all duration-1 ease-linear origin-top"
        style={{ height: `${progress}%` }}
      ></div>
    </div>
  );
}
