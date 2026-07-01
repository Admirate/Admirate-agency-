"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hasMouse, setHasMouse] = useState(false);

  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (isDashboard) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleFirstMove = () => {
      setHasMouse(true);
      window.removeEventListener("mousemove", handleFirstMove);
    };
    window.addEventListener("mousemove", handleFirstMove, { once: true });

    let mx = 0, my = 0, rx = 0, ry = 0;
    let rafId = 0;
    let running = true;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mx}px`;
        cursorRef.current.style.top = `${my}px`;
      }
    };

    const animateRing = () => {
      if (!running) return;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    document.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animateRing);

    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      running = false;
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      if (style.parentNode) document.head.removeChild(style);
    };
  }, [isDashboard]);

  if (isDashboard || !hasMouse) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed z-[9999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          background: "var(--red)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          transition: "transform .1s",
        }}
      />
      <div
        ref={ringRef}
        className="fixed z-[9998] pointer-events-none"
        style={{
          width: 32,
          height: 32,
          border: "1px solid rgba(227,30,36,.4)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          transition: "left .12s var(--ease), top .12s var(--ease)",
        }}
      />
    </>
  );
}
