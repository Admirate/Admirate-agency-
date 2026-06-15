"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useSpring } from "framer-motion";

export default function HoverImageReveal({
  text,
  imageSrc,
  className = "",
}: {
  text: string;
  imageSrc: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use framer-motion springs for smooth following
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  
  const containerRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Keep image centered on cursor
    x.set(e.clientX - 100); // 100 is half the width
    y.set(e.clientY - 100); // 100 is half the height
  };

  return (
    <span 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {text}
      
      {/* Portal out the image so it's not clipped by parent containers, or just fixed positioning */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          scale: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 z-[100] w-[200px] h-[200px] pointer-events-none rounded-xl overflow-hidden shadow-2xl"
        style={{ x, y }}
      >
        <Image 
          src={imageSrc} 
          alt={text} 
          fill 
          className="object-cover"
        />
      </motion.div>
    </span>
  );
}