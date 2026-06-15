"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isMagnetic, setIsMagnetic] = useState(false);
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide default cursor for elements that are naturally clickable
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const updateMousePosition = (e: MouseEvent) => {
      setIsVisible(true);
      
      const target = e.target as HTMLElement;
      const magneticElement = target.closest("[data-magnetic]") as HTMLElement;
      const cursorElement = target.closest("[data-cursor]") as HTMLElement;
      const isLinkOrButton = target.closest('a, button, [role="button"], input, select, textarea');

      // Handle magnetic pull
      if (magneticElement) {
        const { left, top, width, height } = magneticElement.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        // Calculate a gentle pull towards the center of the magnetic element
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        setMagneticPos({
          x: centerX + distanceX * 0.1,
          y: centerY + distanceY * 0.1,
        });
        setIsMagnetic(true);
      } else {
        setIsMagnetic(false);
      }

      setPosition({ x: e.clientX, y: e.clientY });

      // Handle text states (PLAY, DRAG)
      if (cursorElement) {
        setCursorText(cursorElement.getAttribute("data-cursor") || "");
        setIsPointer(true);
      } else if (isLinkOrButton || isMagnetic) {
        setCursorText("");
        setIsPointer(true);
      } else {
        setCursorText("");
        setIsPointer(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      document.head.removeChild(style);
    };
  }, []);

  if (!isVisible) return null;

  // Variants for different cursor states
  const variants = {
    default: {
      x: position.x - 10,
      y: position.y - 10,
      width: 20,
      height: 20,
    },
    pointer: {
      x: position.x - 20,
      y: position.y - 20,
      width: 40,
      height: 40,
    },
    text: {
      x: position.x - 40,
      y: position.y - 40,
      width: 80,
      height: 80,
    },
    magnetic: {
      x: magneticPos.x - 20,
      y: magneticPos.y - 20,
      width: 40,
      height: 40,
    }
  };

  let state = "default";
  if (isMagnetic) state = "magnetic";
  else if (cursorText) state = "text";
  else if (isPointer) state = "pointer";

  return (
    <motion.div
      variants={variants}
      animate={state}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center rounded-full bg-white text-black font-bold font-inter text-[12px] tracking-wider mix-blend-difference"
    >
      {cursorText && state === "text" && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-black uppercase"
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}
