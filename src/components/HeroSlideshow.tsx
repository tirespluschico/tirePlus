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
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/35 via-transparent to-transparent" />
        </div>
      ))}
    </div>
  );
}
