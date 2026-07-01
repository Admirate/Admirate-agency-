"use client";

import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    let p = 0;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setProgress(100);
      setHiding(true);
      setTimeout(() => setGone(true), 600);
    };

    const interval = setInterval(() => {
      p += Math.random() * 16 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(finish, 250);
      }
      setProgress(Math.round(p));
    }, 65);

    const fallback = setTimeout(finish, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-7"
      style={{
        background: "#0C0C0D",
        opacity: hiding ? 0 : 1,
        transition: "opacity .55s ease",
        pointerEvents: hiding ? "none" : "auto",
      }}
      aria-hidden="true"
    >
      <div
        className="font-disp font-black text-[28px] tracking-tight text-white"
        style={{
          fontStretch: "expanded",
          letterSpacing: "-.02em",
        }}
      >
        ADMIRATE
      </div>
      <div className="relative w-[200px] h-px" style={{ background: "rgba(255,255,255,.12)" }}>
        <div
          className="h-full"
          style={{
            background: "var(--red)",
            width: `${progress}%`,
            transition: "width .07s linear",
          }}
        />
      </div>
      <div
        className="font-mono text-[11px] tracking-[.12em]"
        style={{ color: "rgba(255,255,255,.35)" }}
      >
        {progress}%
      </div>
    </div>
  );
}
