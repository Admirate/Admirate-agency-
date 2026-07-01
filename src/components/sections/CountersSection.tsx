"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Counter = {
  target: number | null;
  suffix: string;
  label: string;
  text?: string;
};

const counters: Counter[] = [
  { target: 10, suffix: "+", label: "Brands worked with" },
  { target: 50, suffix: "+", label: "Projects delivered" },
  { target: null, suffix: "", label: "At your service", text: "Experts" },
  { target: 98, suffix: "%", label: "Client retention rate" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      once: true,
      onEnter: () => {
        if (counted.current) return;
        counted.current = true;
        const dur = 1800;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * ease) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        tick();
      },
    });
  }, [target, suffix]);

  return (
    <div
      ref={ref}
      className="font-disp font-black leading-none"
      style={{
        fontStretch: "expanded",
        fontStyle: "italic",
        fontSize: "clamp(36px, 5vw, 64px)",
        letterSpacing: "-.04em",
        color: "#fff",
      }}
    >
      0
    </div>
  );
}

export default function CountersSection() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.to(".ctr-grid", {
      yPercent: -5,
      ease: "none",
      scrollTrigger: { trigger: "#counters", start: "top bottom", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <section
      id="counters"
      style={{ padding: "clamp(60px,8vw,100px) var(--pad)", background: "var(--ink)" }}
    >
      <div
        className="ctr-grid mx-auto grid gap-[2px]"
        style={{ maxWidth: "var(--maxw)", gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {counters.map((counter, i) => (
          <div
            key={i}
            className="fade-up p-10"
            style={{ border: "1px solid rgba(255,255,255,.06)" }}
          >
            {counter.target !== null ? (
              <AnimatedCounter target={counter.target} suffix={counter.suffix} />
            ) : (
              <div
                className="font-disp font-black leading-none"
                style={{
                  fontStretch: "expanded",
                  fontStyle: "italic",
                  fontSize: "clamp(28px, 3.8vw, 52px)",
                  letterSpacing: "-.03em",
                  color: "#fff",
                }}
              >
                {counter.text}
              </div>
            )}
            <div
              className="font-mono text-[10px] tracking-[.14em] uppercase mt-2.5"
              style={{ color: "rgba(255,255,255,.3)" }}
            >
              {counter.label}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
