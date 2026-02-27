"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  "/images/frontshot.jpg",
  "/images/sidebuilding.jpg",
  "/images/tireplusfront.jpg",
];

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {slides.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt="Tires+ shop exterior"
            fill
            priority={index === 0}
            className="object-contain object-center px-5 sm:px-8 pt-2 sm:pt-3 pb-1 sm:pb-2"
          />
        </div>
      ))}
    </div>
  );
}
